from flask import make_response, request
from flask_restful import Resource
from models import db, User
from schemas import user_schema, users_schema
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError

# Standard logging fallback if 'extensions' module is not in your project
try:
    from extensions import log
except ImportError:
    import logging
    log = logging.getLogger(__name__)


# /users
class UsersResource(Resource):
    # GET /users - Fetch all users
    def get(self):
        users = User.query.all()
        log.info("get_all_users", request_data=users_schema.dump(users))
        return make_response(users_schema.dump(users), 200)

    # POST /users - Create a new user
    def post(self):
        try:
            data = request.get_json() or {}

            # Validate and deserialize input
            validated_data = user_schema.load(data)

            # Check for duplicates before inserting
            if User.query.filter_by(username=validated_data["username"]).first():
                return make_response(
                    {"status": 409, "message": "Username already taken"}, 409
                )
            if User.query.filter_by(email=validated_data["email"]).first():
                return make_response(
                    {"status": 409, "message": "Email address already taken"}, 409
                )

            # Create new User instance using validated data
            new_user = User(
                first_name=validated_data["first_name"],
                last_name=validated_data["last_name"],
                username=validated_data["username"],
                email=validated_data["email"],
                password=validated_data["password"],  # Note: Remember to hash in real app
            )

            db.session.add(new_user)
            db.session.commit()

            return make_response(user_schema.dump(new_user), 201)

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
                "message": "A user with that email or username already exists",
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


# /users/<int:user_id>
class UserByIDResource(Resource):
    # GET /users/<int:user_id> - Fetch single user
    def get(self, user_id):
        user = User.query.filter_by(id=user_id).first()

        if user:
            return make_response(user_schema.dump(user), 200)
        
        response = {"status": 404, "message": "User not found"}
        return make_response(response, 404)

    # PATCH /users/<int:user_id> - Update user
    def patch(self, user_id):
        user = User.query.filter_by(id=user_id).first()

        if not user:
            return make_response({"status": 404, "message": "User not found"}, 404)

        try:
            data = request.get_json() or {}

            # partial=True allows validating only provided attributes for PATCH
            validated_data = user_schema.load(data, partial=True)

            for key, value in validated_data.items():
                if hasattr(user, key):
                    setattr(user, key, value)

            db.session.commit()
            return make_response(user_schema.dump(user), 200)

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
                "message": "A user with that email or username already exists",
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

    # DELETE /users/<int:user_id> - Delete a user
    def delete(self, user_id):
        user = User.query.filter_by(id=user_id).first()

        if user:
            try:
                db.session.delete(user)
                db.session.commit()
                return make_response({"message": "User deleted successfully"}, 200)
            except Exception as e:
                db.session.rollback()
                log.error("unexpected_error", error=str(e))
                return make_response({"status": 500, "message": "An error occurred"}, 500)

        response = {"status": 404, "message": "User not found"}
        return make_response(response, 404)