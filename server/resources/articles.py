from flask import make_response, request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from ..models import db, Article, User, Category
from ..schemas import article_schema, articles_schema, comments_schema
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError
from ..auth_utils import role_required

# Standard logging fallback
try:
    from extensions import log
except ImportError:
    import logging
    log = logging.getLogger(__name__)


# /articles
class ArticlesResource(Resource):
    # GET /articles - Public: Fetch paginated articles with filtering & sorting options
    def get(self):
        try:
            category_id = request.args.get('category', type=int)
            kind = request.args.get('kind', type=str)
            author_id = request.args.get('author', type=int)
            sort = request.args.get('sort', default='new', type=str)
            page = request.args.get('page', default=1, type=int)
            limit = request.args.get('limit', default=10, type=int)

            query = Article.query

            # Apply query filters if provided
            if category_id:
                query = query.filter(Article.category_id == category_id)
            if kind and hasattr(Article, 'kind'):
                query = query.filter(Article.kind == kind)
            if author_id:
                query = query.filter(Article.author_id == author_id)

            # Apply sorting rules
            if sort == 'top' and hasattr(Article, 'view_count'):
                query = query.order_by(Article.view_count.desc())
            elif sort == 'hot' and hasattr(Article, 'likes_count'):
                query = query.order_by(Article.likes_count.desc())
            else:  # default to 'new'
                query = query.order_by(Article.created_at.desc())

            # Paginate results
            paginated = query.paginate(page=page, per_page=limit, error_out=False)

            log.info(f"get_filtered_articles count: {len(paginated.items)}")
            return make_response({
                "articles": articles_schema.dump(paginated.items),
                "pagination": {
                    "total_items": paginated.total,
                    "total_pages": paginated.pages,
                    "current_page": paginated.page,
                    "limit": limit,
                    "has_next": paginated.has_next,
                    "has_prev": paginated.has_prev
                }
            }, 200)

        except Exception as e:
            log.error(f"unexpected_error: {str(e)}")
            return make_response({"status": 500, "message": "An error occurred"}, 500)

    # POST /articles - Protected: Restrict article creation to Authors and Admins only
    @role_required(["admin", "author"])
    def post(self):
        try:
            current_user_id = int(get_jwt_identity())
            data = request.get_json() or {}

            # Ensure author_id matches the authenticated JWT identity
            data["author_id"] = current_user_id

            # Validate and deserialize input using Marshmallow schema
            validated_data = article_schema.load(data)

            # Foreign key existence checks
            if not Category.query.filter_by(category_id=validated_data["category_id"]).first():
                return make_response(
                    {"status": 404, "message": "Category not found"}, 404
                )

            # Create new Article instance
            new_article = Article(
                title=validated_data["title"],
                content=validated_data["content"],
                cover_image=validated_data.get("cover_image", "https://placeholder.com"),
                author_id=current_user_id,
                category_id=validated_data["category_id"],
                published=validated_data.get("published", False),
            )

            db.session.add(new_article)
            db.session.commit()

            return make_response(article_schema.dump(new_article), 201)

        except ValidationError as err:
            log.error(f"validation_error: {err.messages}")
            response = {
                "status": 400,
                "message": "Validation error(s) occurred",
                "errors": err.messages,
            }
            return make_response(response, 400)

        except IntegrityError as ie:
            db.session.rollback()
            log.error(f"integrity_error: {str(ie)}")
            response = {
                "status": 409,
                "message": "Database constraint violation occurred",
            }
            return make_response(response, 409)

        except Exception as e:
            db.session.rollback()
            log.error(f"unexpected_error: {str(e)}")
            response = {
                "status": 500,
                "message": "An error occurred",
            }
            return make_response(response, 500)


# /articles/<int:article_id>
class ArticleByIDResource(Resource):
    # GET /articles/<int:article_id> - Public: Fetch single article
    def get(self, article_id):
        article = Article.query.filter_by(article_id=article_id).first()

        if article:
            return make_response(article_schema.dump(article), 200)

        return make_response({"status": 404, "message": "Article not found"}, 404)

    # PATCH /articles/<int:article_id> - Protected: Selective update (Owner or Admin)
    @jwt_required()
    def patch(self, article_id):
        current_user_id = int(get_jwt_identity())
        claims = get_jwt()
        user_role = claims.get("role", "user")

        article = Article.query.filter_by(article_id=article_id).first()

        if not article:
            return make_response({"status": 404, "message": "Article not found"}, 404)

        # Allow edit if author OR admin
        if article.author_id != current_user_id and user_role != "admin":
            return make_response({"status": 403, "message": "Permission denied: You can only update your own articles"}, 403)

        try:
            data = request.get_json() or {}

            # Validate input partially for PATCH
            validated_data = article_schema.load(data, partial=True)

            # Check foreign key existence if changing category
            if "category_id" in validated_data:
                if not Category.query.filter_by(category_id=validated_data["category_id"]).first():
                    return make_response(
                        {"status": 404, "message": "Category not found"}, 404
                    )

            for key, value in validated_data.items():
                if hasattr(article, key):
                    setattr(article, key, value)

            db.session.commit()
            return make_response(article_schema.dump(article), 200)

        except ValidationError as err:
            log.error(f"validation_error: {err.messages}")
            response = {
                "status": 400,
                "message": "Validation error(s) occurred",
                "errors": err.messages,
            }
            return make_response(response, 400)

        except IntegrityError as ie:
            db.session.rollback()
            log.error(f"integrity_error: {str(ie)}")
            response = {
                "status": 409,
                "message": "Database constraint violation occurred",
            }
            return make_response(response, 409)

        except Exception as e:
            db.session.rollback()
            log.error(f"unexpected_error: {str(e)}")
            response = {
                "status": 500,
                "message": "An error occurred",
            }
            return make_response(response, 500)

    # DELETE /articles/<int:article_id> - Protected: Delete article (Owner or Admin)
    @jwt_required()
    def delete(self, article_id):
        current_user_id = int(get_jwt_identity())
        claims = get_jwt()
        user_role = claims.get("role", "user")

        article = Article.query.filter_by(article_id=article_id).first()

        if not article:
            return make_response({"status": 404, "message": "Article not found"}, 404)

        # Allow delete if author OR admin
        if article.author_id != current_user_id and user_role != "admin":
            return make_response({"status": 403, "message": "Permission denied: You can only delete your own articles"}, 403)

        try:
            db.session.delete(article)
            db.session.commit()
            return make_response({"message": "Article deleted successfully"}, 200)
        except Exception as e:
            db.session.rollback()
            log.error(f"unexpected_error: {str(e)}")
            return make_response({"status": 500, "message": "An error occurred"}, 500)


# /articles/<int:article_id>/upvote
class ArticleUpvoteResource(Resource):
    # POST /articles/<int:article_id>/upvote - Protected: Upvote an article (Any logged-in user)
    @jwt_required()
    def post(self, article_id):
        article = Article.query.filter_by(article_id=article_id).first()
        if not article:
            return make_response({"status": 404, "message": "Article not found"}, 404)

        try:
            if hasattr(article, 'likes_count'):
                article.likes_count = (article.likes_count or 0) + 1
            db.session.commit()
            return make_response({
                "status": 200, 
                "message": "Upvoted successfully", 
                "likes_count": getattr(article, 'likes_count', 0)
            }, 200)
        except Exception as e:
            db.session.rollback()
            log.error(f"upvote_error: {str(e)}")
            return make_response({"status": 500, "message": "An error occurred"}, 500)


# /articles/<int:article_id>/comments
class ArticleCommentsResource(Resource):
    # GET /articles/<int:article_id>/comments - Public: Get comments associated with an article
    def get(self, article_id):
        article = Article.query.filter_by(article_id=article_id).first()
        if not article:
            return make_response({"status": 404, "message": "Article not found"}, 404)

        comments = getattr(article, 'comments', [])
        return make_response(comments_schema.dump(comments), 200)


# /users/<int:user_id>/articles
class UserArticlesResource(Resource):
    # GET /users/<int:user_id>/articles - Public: Fetch all articles written by a specific author
    def get(self, user_id):
        author = User.query.filter_by(user_id=user_id).first()
        if not author:
            return make_response({"status": 404, "message": "Author not found"}, 404)

        articles = Article.query.filter_by(author_id=user_id).all()
        log.info(f"get_author_{user_id}_articles")

        return make_response(articles_schema.dump(articles), 200)