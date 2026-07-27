from flask import make_response, request
from flask_restful import Resource
from models import db, Category, Article
from schemas import category_schema, categories_schema, articles_schema
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError
from auth_utils import role_required  # Properly imported!

# Standard logging fallback
try:
    from extensions import log
except ImportError:
    import logging
    log = logging.getLogger(__name__)


# /categories
class CategoriesResource(Resource):
    # GET /categories - Public: Fetch all categories
    def get(self):
        categories = Category.query.all()
        log.info("get_all_categories", request_data=categories_schema.dump(categories))
        return make_response(categories_schema.dump(categories), 200)

    # POST /categories - Protected: Admin/Author creation of categories
    @role_required(["admin", "author"])
    def post(self):
        try:
            data = request.get_json() or {}

            # Validate and deserialize input using Marshmallow schema
            validated_data = category_schema.load(data)

            # Check for duplicate category name before inserting
            if Category.query.filter_by(category_name=validated_data["category_name"]).first():
                return make_response(
                    {"status": 409, "message": "Category name already exists"}, 409
                )

            # Create new Category instance
            new_category = Category(
                category_name=validated_data["category_name"],
                icon=validated_data.get("icon"),
                description=validated_data.get("description"),
            )

            db.session.add(new_category)
            db.session.commit()

            return make_response(category_schema.dump(new_category), 201)

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
                "message": "A category with that name already exists",
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


# /categories/<int:category_id>
class CategoryByIDResource(Resource):
    # GET /categories/<int:category_id> - Public: Fetch a single category
    def get(self, category_id):
        category = Category.query.filter_by(category_id=category_id).first()

        if category:
            return make_response(category_schema.dump(category), 200)

        response = {"status": 404, "message": "Category not found"}
        return make_response(response, 404)

    # PATCH /categories/<int:category_id> - Protected: Admin/Author update
    @role_required(["admin", "author"])
    def patch(self, category_id):
        category = Category.query.filter_by(category_id=category_id).first()

        if not category:
            return make_response({"status": 404, "message": "Category not found"}, 404)

        try:
            data = request.get_json() or {}

            # partial=True allows selective field updates for PATCH
            validated_data = category_schema.load(data, partial=True)

            for key, value in validated_data.items():
                if hasattr(category, key):
                    setattr(category, key, value)

            db.session.commit()
            return make_response(category_schema.dump(category), 200)

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
                "message": "A category with that name already exists",
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

    # DELETE /categories/<int:category_id> - Protected: Admin only delete
    @role_required(["admin"])
    def delete(self, category_id):
        category = Category.query.filter_by(category_id=category_id).first()

        if category:
            try:
                db.session.delete(category)
                db.session.commit()
                return make_response({"message": "Category deleted successfully"}, 200)
            except Exception as e:
                db.session.rollback()
                log.error("unexpected_error", error=str(e))
                return make_response({"status": 500, "message": "An error occurred"}, 500)

        response = {"status": 404, "message": "Category not found"}
        return make_response(response, 404)


# /categories/<int:category_id>/articles
class CategoryArticlesResource(Resource):
    # GET /categories/<int:category_id>/articles - Public: Fetch all articles belonging to a specific category
    def get(self, category_id):
        category = Category.query.filter_by(category_id=category_id).first()
        if not category:
            return make_response({"status": 404, "message": "Category not found"}, 404)
        
        articles = Article.query.filter_by(category_id=category_id).all()
        return make_response(articles_schema.dump(articles), 200)