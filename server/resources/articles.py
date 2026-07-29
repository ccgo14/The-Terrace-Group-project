from flask import make_response, request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError

try:
    from server.models import db, Article, User, Category, Comment
    from server.schemas import (
        article_schema,
        articles_schema,
        comments_schema,
        comment_schema,
    )
    from server.auth_utils import role_required
except ImportError:
    from models import db, Article, User, Category, Comment
    from schemas import article_schema, articles_schema, comments_schema, comment_schema
    from auth_utils import role_required

# Standard logging fallback
try:
    from server.extensions import log
except ImportError:
    import logging

    log = logging.getLogger(__name__)


# /articles
class ArticlesResource(Resource):
    # GET /articles - Public: Fetch all articles (with optional query filters like category or status)
    def get(self):
        category_id = request.args.get("category_id")
        query = Article.query

        if category_id:
            query = query.filter_by(category_id=category_id)

        articles = query.all()
        log.info("get_all_articles", count=len(articles))
        return make_response(articles_schema.dump(articles), 200)

    # POST /articles - Protected: Create a new article (Admin/Author only)
    @role_required(["admin", "author"])
    def post(self):
        try:
            current_user_id = int(get_jwt_identity())
            data = request.get_json() or {}

            data["user_id"] = current_user_id
            validated_data = article_schema.load(data)

            if not User.query.filter_by(user_id=current_user_id).first():
                return make_response({"status": 404, "message": "User not found"}, 404)

            if "category_id" in validated_data and validated_data["category_id"]:
                if not Category.query.filter_by(
                    category_id=validated_data["category_id"]
                ).first():
                    return make_response(
                        {"status": 404, "message": "Category not found"}, 404
                    )

            new_article = Article(
                title=validated_data.get("title"),
                content=validated_data.get("content"),
                cover_image=validated_data.get("cover_image"),
                view_count=validated_data.get("view_count", 0),
                likes_count=validated_data.get("likes_count", 0),
                author_id=current_user_id,
                category_id=validated_data.get("category_id"),
            )

            db.session.add(new_article)
            db.session.commit()

            return make_response(article_schema.dump(new_article), 201)

        except ValidationError as err:
            log.error("validation_error", errors=err.messages)
            return make_response(
                {
                    "status": 400,
                    "message": "Validation error(s) occurred",
                    "errors": {**err.messages},
                },
                400,
            )

        except IntegrityError as ie:
            db.session.rollback()
            log.error("integrity_error", error=str(ie))
            return make_response(
                {"status": 409, "message": "Database constraint violation occurred"},
                409,
            )

        except Exception as e:
            db.session.rollback()
            log.error("unexpected_error", error=str(e))
            return make_response({"status": 500, "message": "An error occurred"}, 500)


# /articles/<int:article_id>
class ArticleByIDResource(Resource):
    # GET /articles/<int:article_id> - Public: Fetch a single article by ID
    def get(self, article_id):
        article = Article.query.filter_by(article_id=article_id).first()
        if article:
            return make_response(article_schema.dump(article), 200)
        return make_response({"status": 404, "message": "Article not found"}, 404)

    # PATCH /articles/<int:article_id> - Protected: Update article (Owner or Admin)
    @jwt_required()
    def patch(self, article_id):
        current_user_id = int(get_jwt_identity())
        claims = get_jwt()
        user_role = claims.get("role", "user")

        article = Article.query.filter_by(article_id=article_id).first()
        if not article:
            return make_response({"status": 404, "message": "Article not found"}, 404)

        if article.author_id != current_user_id and user_role != "admin":
            return make_response(
                {
                    "status": 403,
                    "message": "Permission denied: Cannot edit this article",
                },
                403,
            )

        try:
            data = request.get_json() or {}
            data.pop("user_id", None)

            validated_data = article_schema.load(data, partial=True)

            for key, value in validated_data.items():
                if hasattr(article, key):
                    setattr(article, key, value)

            db.session.commit()
            return make_response(article_schema.dump(article), 200)

        except ValidationError as err:
            log.error("validation_error", errors=err.messages)
            return make_response(
                {
                    "status": 400,
                    "message": "Validation error(s) occurred",
                    "errors": {**err.messages},
                },
                400,
            )

        except IntegrityError as ie:
            db.session.rollback()
            log.error("integrity_error", error=str(ie))
            return make_response(
                {"status": 409, "message": "Database constraint violation occurred"},
                409,
            )

        except Exception as e:
            db.session.rollback()
            log.error("unexpected_error", error=str(e))
            return make_response({"status": 500, "message": "An error occurred"}, 500)

    # DELETE /articles/<int:article_id> - Protected: Delete article (Owner or Admin)
    @jwt_required()
    def delete(self, article_id):
        current_user_id = int(get_jwt_identity())
        claims = get_jwt()
        user_role = claims.get("role", "user")

        article = Article.query.filter_by(article_id=article_id).first()
        if not article:
            return make_response({"status": 404, "message": "Article not found"}, 404)

        if article.author_id != current_user_id and user_role != "admin":
            return make_response(
                {
                    "status": 403,
                    "message": "Permission denied: Cannot delete this article",
                },
                403,
            )

        try:
            db.session.delete(article)
            db.session.commit()
            return make_response({"message": "Article deleted successfully"}, 200)
        except Exception as e:
            db.session.rollback()
            log.error("unexpected_error", error=str(e))
            return make_response({"status": 500, "message": "An error occurred"}, 500)


# /articles/<int:article_id>/upvote
class ArticleUpvoteResource(Resource):
    # POST /articles/<int:article_id>/upvote - Protected: Increment upvote count for an article
    @jwt_required()
    def post(self, article_id):
        article = Article.query.filter_by(article_id=article_id).first()
        if not article:
            return make_response({"status": 404, "message": "Article not found"}, 404)

        try:
            article.likes_count = (article.likes_count or 0) + 1
            db.session.commit()
            return make_response(article_schema.dump(article), 200)
        except Exception as e:
            db.session.rollback()
            log.error("unexpected_error", error=str(e))
            return make_response({"status": 500, "message": "An error occurred"}, 500)


# /articles/<int:article_id>/comments
class ArticleCommentsResource(Resource):
    # GET /articles/<int:article_id>/comments - Public: Fetch all comments for a specific article
    def get(self, article_id):
        article = Article.query.filter_by(article_id=article_id).first()
        if not article:
            return make_response({"status": 404, "message": "Article not found"}, 404)

        comments = getattr(article, "comments", [])
        return make_response(comments_schema.dump(comments), 200)

    # POST /articles/<int:article_id>/comments - Protected: Add a comment to an article
    @jwt_required()
    def post(self, article_id):
        article = Article.query.filter_by(article_id=article_id).first()
        if not article:
            return make_response({"status": 404, "message": "Article not found"}, 404)

        try:
            current_user_id = int(get_jwt_identity())
            data = request.get_json() or {}
            data["user_id"] = current_user_id
            data["article_id"] = article_id

            validated_data = comment_schema.load(data)

            new_comment = Comment(
                content=validated_data.get("content"),
                user_id=current_user_id,
                article_id=article_id,
            )

            db.session.add(new_comment)
            db.session.commit()

            return make_response(comment_schema.dump(new_comment), 201)

        except ValidationError as err:
            log.error("validation_error", errors=err.messages)
            return make_response(
                {
                    "status": 400,
                    "message": "Validation error(s) occurred",
                    "errors": {**err.messages},
                },
                400,
            )

        except Exception as e:
            db.session.rollback()
            log.error("unexpected_error", error=str(e))
            return make_response({"status": 500, "message": "An error occurred"}, 500)


# /users/<int:user_id>/articles
class UserArticlesResource(Resource):
    # GET /users/<int:user_id>/articles - Public: Fetch all articles written by a specific user
    def get(self, user_id):
        user = User.query.filter_by(user_id=user_id).first()
        if not user:
            return make_response({"status": 404, "message": "User not found"}, 404)

        articles = Article.query.filter_by(author_id=user_id).all()
        return make_response(articles_schema.dump(articles), 200)
