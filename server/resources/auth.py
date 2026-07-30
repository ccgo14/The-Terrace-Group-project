from flask import request, make_response
from flask_restful import Resource
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    set_access_cookies,
    set_refresh_cookies,
    unset_jwt_cookies,
    jwt_required,
    get_jwt_identity,
    get_jwt,
)
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError

try:
    from server.models import db, User, Profile
    from server.schemas import user_schema, login_schema, register_schema
except ImportError:
    from models import db, User, Profile
    from schemas import user_schema, login_schema, register_schema


class RegisterResource(Resource):
    def post(self):
        try:
            data = request.get_json() or {}
            validated_data = register_schema.load(data)

            existing_user = db.session.execute(
                db.select(User).filter(
                    (User.username == validated_data["username"])
                    | (User.email == validated_data["email"])
                )
            ).scalar_one_or_none()

            if existing_user:
                if existing_user.username == validated_data["username"]:
                    return make_response(
                        {"status": 400, "message": "Username already taken"}, 400
                    )
                return make_response(
                    {"status": 400, "message": "Email already registered"}, 400
                )

            user = User(
                first_name=validated_data["first_name"],
                last_name=validated_data["last_name"],
                username=validated_data["username"],
                email=validated_data["email"],
            )
            user.set_password(validated_data["password"])

            db.session.add(user)
            db.session.flush()

            assigned_role = "user"
            profile = Profile(
                user_id=user.user_id,
                role=assigned_role,
                bio="",
                gender="Not Specified",
            )
            db.session.add(profile)
            db.session.commit()

            additional_claims = {"role": assigned_role}
            access_token = create_access_token(
                identity=str(user.user_id),
                additional_claims=additional_claims,
            )
            refresh_token = create_refresh_token(
                identity=str(user.user_id),
                additional_claims=additional_claims,
            )

            response = make_response(
                {
                    "message": "User registered successfully",
                    "user": user_schema.dump(user),
                },
                201,
            )

            set_access_cookies(response, access_token)
            set_refresh_cookies(response, refresh_token)

            return response

        except ValidationError as err:
            return make_response({"status": 400, "errors": err.messages}, 400)
        except IntegrityError:
            db.session.rollback()
            return make_response({"status": 409, "message": "Database conflict"}, 409)


class LoginResource(Resource):
    def post(self):
        try:
            data = request.get_json() or {}
            validated_data = login_schema.load(data)

            user = db.session.execute(
                db.select(User).filter_by(email=validated_data["email"])
            ).scalar_one_or_none()

            if not user or not user.check_password(validated_data["password"]):
                return make_response(
                    {"status": 401, "message": "Invalid email or password"}, 401
                )

            user_role = (
                user.profile.role
                if (hasattr(user, "profile") and user.profile)
                else "user"
            )
            additional_claims = {"role": user_role}

            access_token = create_access_token(
                identity=str(user.user_id),
                additional_claims=additional_claims,
            )
            refresh_token = create_refresh_token(
                identity=str(user.user_id),
                additional_claims=additional_claims,
            )

            response = make_response(
                {
                    "message": "Login successful",
                    "user": user_schema.dump(user),
                },
                200,
            )

            set_access_cookies(response, access_token)
            set_refresh_cookies(response, refresh_token)

            return response

        except ValidationError as err:
            return make_response({"status": 400, "errors": err.messages}, 400)


class LogoutResource(Resource):
    def post(self):
        """Logs out the user by clearing the JWT cookies from the browser."""
        response = make_response({"message": "Successfully logged out"}, 200)
        unset_jwt_cookies(response)
        return response


class RefreshTokenResource(Resource):
    @jwt_required(refresh=True)
    def post(self):
        """Generates a new access token using a valid refresh cookie/token."""
        current_user_id = get_jwt_identity()
        claims = get_jwt()

        user_role = claims.get("role", "user")
        new_access_token = create_access_token(
            identity=current_user_id,
            additional_claims={"role": user_role},
        )

        response = make_response({"message": "Token refreshed successfully"}, 200)
        set_access_cookies(response, new_access_token)
        return response


class MeResource(Resource):
    @jwt_required()
    def get(self):
        """Protected route to get current authenticated user's profile."""
        current_user_id = get_jwt_identity()
        user = db.session.get(User, int(current_user_id))

        if not user:
            return make_response({"status": 404, "message": "User not found"}, 404)

        return make_response(user_schema.dump(user), 200)
