from flask import make_response, request
from flask_restful import Resource
from models import db, Article, User, Category
from schemas import article_schema, articles_schema
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError

# Standard logging fallback if 'extensions' module is not in your project
try:
    from extensions import log
except ImportError:
    import logging
    log = logging.getLogger(__name__)


# /articles
class ArticlesResource(Resource):
    # GET /articles - Fetch all articles with author and category details
    def get(self):
        articles = Article.query.all()
        log.info("get_all_articles", request_data=articles_schema.dump(articles))
        return make_response(articles_schema.dump(articles), 200)

    # POST /articles - Create a new article
    def post(self):
        try:
            data = request.get_json() or {}

            # Validate and deserialize input using Marshmallow schema
            validated_data = article_schema.load(data)

            # Foreign key existence checks
            if not User.query.filter_by(id=validated_data["author_id"]).first():
                return make_response(
                    {"status": 404, "message": "Author not found"}, 404
                )
            if not Category.query.filter_by(id=validated_data["category_id"]).first():
                return make_response(
                    {"status": 404, "message": "Category not found"}, 404
                )

            # Create new Article instance
            new_article = Article(
                title=validated_data["title"],
                content=validated_data["content"],
                cover_image=validated_data.get("cover_image", "https://placeholder.com"),
                author_id=validated_data["author_id"],
                category_id=validated_data["category_id"],
                published=validated_data.get("published", False),
            )

            db.session.add(new_article)
            db.session.commit()

            return make_response(article_schema.dump(new_article), 201)

        except ValidationError as err:
            log.error("validation_error", errors=err.messages)
            response = {
                "status": 400,
                "message": "Validation error(s) occurred",
                "errors": {**err.messages},
            }
            return make_response(response, 400)

        except IntegrityError as ie:
            db.session.rollback()
            log.error("integrity_error", error=str(ie))
            response = {
                "status": 409,
                "message": "Database constraint violation occurred",
            }
            return make_response(response, 409)

        except Exception as e:
            db.session.rollback()
            log.error("unexpected_error", error=str(e))
            response = {
                "status": 500,
                "message": "An error occurred",
            }
            return make_response(response, 500)


# /articles/<int:article_id>
class ArticleByIDResource(Resource):
    # GET /articles/<int:article_id> - Fetch single article
    def get(self, article_id):
        article = Article.query.filter_by(id=article_id).first()

        if article:
            return make_response(article_schema.dump(article), 200)

        response = {"status": 404, "message": "Article not found"}
        return make_response(response, 404)

    # PATCH /articles/<int:article_id> - Selective update
    def patch(self, article_id):
        article = Article.query.filter_by(id=article_id).first()

        if not article:
            return make_response({"status": 404, "message": "Article not found"}, 404)

        try:
            data = request.get_json() or {}

            # Validate input partially for PATCH
            validated_data = article_schema.load(data, partial=True)

            # Check foreign key existence if changing category
            if "category_id" in validated_data:
                if not Category.query.filter_by(id=validated_data["category_id"]).first():
                    return make_response(
                        {"status": 404, "message": "Category not found"}, 404
                    )

            for key, value in validated_data.items():
                if hasattr(article, key):
                    setattr(article, key, value)

            db.session.commit()
            return make_response(article_schema.dump(article), 200)

        except ValidationError as err:
            log.error("validation_error", errors=err.messages)
            response = {
                "status": 400,
                "message": "Validation error(s) occurred",
                "errors": {**err.messages},
            }
            return make_response(response, 400)

        except IntegrityError as ie:
            db.session.rollback()
            log.error("integrity_error", error=str(ie))
            response = {
                "status": 409,
                "message": "Database constraint violation occurred",
            }
            return make_response(response, 409)

        except Exception as e:
            db.session.rollback()
            log.error("unexpected_error", error=str(e))
            response = {
                "status": 500,
                "message": "An error occurred",
            }
            return make_response(response, 500)

    # DELETE /articles/<int:article_id> - Delete article
    def delete(self, article_id):
        article = Article.query.filter_by(id=article_id).first()

        if article:
            try:
                db.session.delete(article)
                db.session.commit()
                return make_response({"message": "Article deleted successfully"}, 200)
            except Exception as e:
                db.session.rollback()
                log.error("unexpected_error", error=str(e))
                return make_response({"status": 500, "message": "An error occurred"}, 500)

        response = {"status": 404, "message": "Article not found"}
        return make_response(response, 404)


# /users/<int:user_id>/articles
class UserArticlesResource(Resource):
    # GET /users/<int:user_id>/articles - Fetch all articles written by a specific author
    def get(self, user_id):
        author = User.query.filter_by(id=user_id).first()
        if not author:
            return make_response({"status": 404, "message": "Author not found"}, 404)

        articles = Article.query.filter_by(author_id=user_id).all()
        log.info(f"get_author_{user_id}_articles", request_data=articles_schema.dump(articles))

        return make_response(articles_schema.dump(articles), 200)