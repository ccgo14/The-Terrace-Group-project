from flask import Flask
from flask_migrate import Migrate
from flask_restful import Api
from models import db

# Import all resource classes from your resource modules
from resources.users import UsersResource, UserByIDResource
from resources.categories import CategoriesResource, CategoryByIDResource
from resources.articles import (
    ArticlesResource,
    ArticleByIDResource,
    UserArticlesResource,
)
from resources.reactions import (
    ReactionsResource,
    ReactionByIDResource,
    UserReactionsResource,
)
from resources.comments import (
    CommentsResource,
    CommentByIDResource,
    UserCommentsResource,
)

# Initialize Flask app
app = Flask(__name__)

# Application Configuration
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize extensions
db.init_app(app=app)
migrate = Migrate(app=app, db=db)
api = Api(app)

# API Route Registration

# Users Routes
api.add_resource(UsersResource, "/users")
api.add_resource(UserByIDResource, "/users/<int:user_id>")

# Categories Routes
api.add_resource(CategoriesResource, "/categories")
api.add_resource(CategoryByIDResource, "/categories/<int:category_id>")

# Articles Routes
api.add_resource(ArticlesResource, "/articles")
api.add_resource(ArticleByIDResource, "/articles/<int:article_id>")
api.add_resource(UserArticlesResource, "/users/<int:user_id>/articles")

# Reactions Routes
api.add_resource(ReactionsResource, "/reactions")
api.add_resource(ReactionByIDResource, "/reactions/<int:reaction_id>")
api.add_resource(UserReactionsResource, "/users/<int:user_id>/reactions")

# Comments Routes
api.add_resource(CommentsResource, "/comments")
api.add_resource(CommentByIDResource, "/comments/<int:comment_id>")
api.add_resource(UserCommentsResource, "/users/<int:user_id>/comments")


if __name__ == "__main__":
    app.run(port=5555, debug=True)