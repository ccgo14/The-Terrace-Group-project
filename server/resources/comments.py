from flask import make_response, request
from flask_restful import Resource
from models import db, Comment, User, Article
from schemas import comment_schema, comments_schema
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError

# Standard logging fallback if 'extensions' module is not in your project
try:
    from extensions import log
except ImportError:
    import logging
    log = logging.getLogger(__name__)


# /comments
class CommentsResource(Resource):
    # GET /comments - Fetch all comments
    def get(self):
        comments = Comment.query.all()
        log.info("get_all_comments", request_data=comments_schema.dump(comments))
        return make_response(comments_schema.dump(comments), 200)

    # POST /comments - Create a new comment
    def post(self):
        try:
            data = request.get_json() or {}

            # Validate and deserialize input using Marshmallow schema
            validated_data = comment_schema.load(data)

            # Check foreign key existence
            if not User.query.filter_by(id=validated_data["user_id"]).first():
                return make_response(
                    {"status": 404, "message": "User not found"}, 404
                )
            if not Article.query.filter_by(id=validated_data["article_id"]).first():
                return make_response(
                    {"status": 404, "message": "Article not found"}, 404
                )

            # Create new Comment instance
            new_comment = Comment(
                content=validated_data["content"],
                user_id=validated_data["user_id"],
                article_id=validated_data["article_id"],
            )

            db.session.add(new_comment)
            db.session.commit()

            return make_response(comment_schema.dump(new_comment), 201)

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


# /comments/<int:comment_id>
class CommentByIDResource(Resource):
    # GET /comments/<int:comment_id> - Fetch single comment
    def get(self, comment_id):
        comment = Comment.query.filter_by(id=comment_id).first()

        if comment:
            return make_response(comment_schema.dump(comment), 200)

        response = {"status": 404, "message": "Comment not found"}
        return make_response(response, 404)

    # PATCH /comments/<int:comment_id> - Update comment selectively
    def patch(self, comment_id):
        comment = Comment.query.filter_by(id=comment_id).first()

        if not comment:
            return make_response({"status": 404, "message": "Comment not found"}, 404)

        try:
            data = request.get_json() or {}

            # Validate input partially for PATCH
            validated_data = comment_schema.load(data, partial=True)

            for key, value in validated_data.items():
                if hasattr(comment, key):
                    setattr(comment, key, value)

            db.session.commit()
            return make_response(comment_schema.dump(comment), 200)

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
        

    # /users/<int:user_id>/comments
class UserCommentsResource(Resource):
    # GET /users/<int:user_id>/comments - Fetch all comments made by a specific user
    def get(self, user_id):
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return make_response({"status": 404, "message": "User not found"}, 404)

        comments = Comment.query.filter_by(user_id=user_id).all()
        log.info(f"get_user_{user_id}_comments", request_data=comments_schema.dump(comments))

        return make_response(comments_schema.dump(comments), 200)

    # DELETE /comments/<int:comment_id> - Delete comment
    def delete(self, comment_id):
        comment = Comment.query.filter_by(id=comment_id).first()

        if comment:
            try:
                db.session.delete(comment)
                db.session.commit()
                return make_response({"message": "Comment deleted successfully"}, 200)
            except Exception as e:
                db.session.rollback()
                log.error("unexpected_error", error=str(e))
                return make_response({"status": 500, "message": "An error occurred"}, 500)

        response = {"status": 404, "message": "Comment not found"}
        return make_response(response, 404)