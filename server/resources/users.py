from flask import request, make_response
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_
from marshmallow import ValidationError
from ..models import db, User, Profile, Article, Prediction, Reaction
from ..schemas import user_schema, users_schema, profile_schema
from auth_utils import role_required


try:
    from server.extensions import log
except ImportError:
    import logging
    log = logging.getLogger(__name__)


# /users
class UsersResource(Resource):
    @role_required(["admin"])
    # GET /users - Public: List/search users with pagination
    def get(self):
        try:
            q = request.args.get('q', default='', type=str).strip()
            page = request.args.get('page', default=1, type=int)
            limit = request.args.get('limit', default=10, type=int)

            query = User.query
            if q:
                search_term = f"%{q}%"
                query = query.filter(
                    or_(
                        User.username.ilike(search_term),
                        User.first_name.ilike(search_term),
                        User.last_name.ilike(search_term),
                        User.email.ilike(search_term)
                    )
                )

            paginated = query.paginate(page=page, per_page=limit, error_out=False)
            return make_response({
                "users": users_schema.dump(paginated.items),
                "pagination": {
                    "total_items": paginated.total,
                    "total_pages": paginated.pages,
                    "current_page": paginated.page,
                    "limit": limit
                }
            }, 200)
        except Exception as e:
            return make_response({"message": str(e)}, 500)


# /users/<int:user_id>
class UserByIDResource(Resource):
    # GET /users/<int:user_id> - Public: Fetch profile details
    def get(self, user_id):
        user = db.session.get(User, user_id)
        if not user:
            return make_response({"status": 404, "message": "User not found"}, 404)
        return make_response(user_schema.dump(user), 200)

    # PATCH /users/<int:user_id> - Protected: Update user profile (Owner only)
    @jwt_required()
    def patch(self, user_id):
        current_user_id = int(get_jwt_identity())

        # Ownership check
        if current_user_id != user_id:
            return make_response(
                {"status": 403, "message": "Permission denied: You can only edit your own profile"}, 403
            )

        user = db.session.get(User, user_id)
        if not user:
            return make_response({"status": 404, "message": "User not found"}, 404)

        data = request.get_json() or {}

        try:
            # Update basic user fields if sent
            if "first_name" in data:
                user.first_name = data["first_name"]
            if "last_name" in data:
                user.last_name = data["last_name"]

            # Update profile table fields if sent
            if user.profile:
                if "bio" in data:
                    user.profile.bio = data["bio"]
                if "avatar" in data or "profile_pic" in data:
                    user.profile.profile_pic = data.get("avatar") or data.get("profile_pic")
                if "role" in data:
                    user.profile.role = data["role"]
                if "gender" in data:
                    user.profile.gender = data["gender"]

            db.session.commit()
            return make_response(user_schema.dump(user), 200)
        except Exception as e:
            db.session.rollback()
            return make_response({"message": str(e)}, 400)


# /users/<int:user_id>/stats
class UserStatsResource(Resource):
    # GET /users/<int:user_id>/stats - Public: Fetch user activity stats
    def get(self, user_id):
        user = db.session.get(User, user_id)
        if not user:
            return make_response({"status": 404, "message": "User not found"}, 404)

        posts_count = Article.query.filter_by(author_id=user_id).count()
        predictions_count = Prediction.query.filter_by(user_id=user_id).count()

        # Calculate accuracy from resolved predictions
        resolved_preds = Prediction.query.filter_by(user_id=user_id, status="RESOLVED").all()
        correct_preds = sum(1 for p in resolved_preds if getattr(p, 'is_correct', False))
        accuracy = (correct_preds / len(resolved_preds) * 100) if resolved_preds else 0.0

        return make_response({
            "user_id": user_id,
            "posts": posts_count,
            "predictions": predictions_count,
            "accuracy_percentage": round(accuracy, 2),
            "upvotes": 0,
            "followers": 0,
            "following": 0
        }, 200)


# /users/<int:user_id>/follow
class UserFollowResource(Resource):
    # POST /users/<int:user_id>/follow - Protected: Follow or unfollow a target user
    @jwt_required()
    def post(self, user_id):
        current_user_id = int(get_jwt_identity())

        if current_user_id == user_id:
            return make_response({"status": 400, "message": "You cannot follow yourself"}, 400)

        target_user = db.session.get(User, user_id)
        if not target_user:
            return make_response({"status": 404, "message": "Target user not found"}, 404)

        # Toggle follow/unfollow logic goes here using `current_user_id` as the follower
        return make_response(
            {"message": f"User {current_user_id} toggled follow status for target user {user_id}"}, 200
        )


# /users/<int:user_id>/followers
class UserFollowersResource(Resource):
    # GET /users/<int:user_id>/followers - Public: Fetch followers list
    def get(self, user_id):
        user = db.session.get(User, user_id)
        if not user:
            return make_response({"status": 404, "message": "User not found"}, 404)

        return make_response({"followers": []}, 200)


# /users/<int:user_id>/following
class UserFollowingResource(Resource):
    # GET /users/<int:user_id>/following - Public: Fetch following list
    def get(self, user_id):
        user = db.session.get(User, user_id)
        if not user:
            return make_response({"status": 404, "message": "User not found"}, 404)

        return make_response({"following": []}, 200)