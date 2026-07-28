import logging
import os
import time
from datetime import timedelta
from dotenv import load_dotenv
from flask import Flask, jsonify, request, g
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_jwt_extended import JWTManager
import structlog
from flask_sqlalchemy import SQLAlchemy  

# Import models & bcrypt from server directory
from .models import db, bcrypt

# Load environment variables from server/.env
load_dotenv()

# Instantiate extensions (FIXED: db is now an instance)
cors = CORS()
jwt = JWTManager()
db = SQLAlchemy()
migrate = Migrate()


def configure_logging():
    """Configure structlog and standard library logging integration."""
    logging.basicConfig(
        format="%(message)s",
        stream=logging.sys.stdout,
        level=logging.INFO,
    )

    structlog.configure(
        processors=[
            structlog.contextvars.merge_contextvars,
            structlog.processors.add_log_level,
            structlog.processors.StackInfoRenderer(),
            structlog.dev.set_exc_info,
            structlog.processors.TimeStamper(fmt="iso"),
            # ConsoleRenderer for pretty colored output in development
            structlog.dev.ConsoleRenderer() if os.getenv("FLASK_ENV") != "production" else structlog.processors.JSONRenderer(),
        ],
        wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),
        context_class=dict,
        logger_factory=structlog.PrintLoggerFactory(),
        cache_logger_on_first_use=True,
    )


def create_app():
    app = Flask(__name__)

    # APPLICATION CONFIGURATION (.env integration)
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-flask-secret-key")
    basedir = os.path.abspath(os.path.dirname(__file__))
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:////{basedir}/instance/app.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Security & JWT Expiry
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super-secret-jwt-key")
    
    access_minutes = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES_MINUTES", 60))
    refresh_days = int(os.getenv("JWT_REFRESH_TOKEN_EXPIRES_DAYS", 30))
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=access_minutes)
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=refresh_days)

    # JWT Cookie Setup
    app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
    app.config["JWT_COOKIE_SECURE"] = os.getenv("FLASK_ENV") == "production"  # True in prod, False in dev
    app.config["JWT_COOKIE_CSRF_PROTECT"] = True
    app.config["JWT_ACCESS_COOKIE_PATH"] = "/"
    app.config["JWT_REFRESH_COOKIE_PATH"] = "/auth/refresh"
    app.config["JWT_COOKIE_SAMESITE"] = "Lax"  # Allows cross-port localhost requests (3000 -> 5555)

    # 0. INITIALIZE LOGGING & MIDDLEWARE
    configure_logging()
    logger = structlog.get_logger()
    logger.info("Initializing Flask application", env=os.getenv("FLASK_ENV", "development"))

    @app.before_request
    def log_request_start():
        g.start_time = time.time()
        if request.path != "/favicon.ico":
            logger.info(
                "Incoming HTTP Request",
                method=request.method,
                path=request.path,
                remote_addr=request.remote_addr,
            )

    @app.after_request
    def log_request_complete(response):
        if request.path == "/favicon.ico":
            return response
            
        duration = time.time() - getattr(g, "start_time", time.time())
        
        log_method = logger.info
        if 400 <= response.status_code < 500:
            log_method = logger.warn
        elif response.status_code >= 500:
            log_method = logger.error

        log_method(
            "HTTP Request Completed",
            method=request.method,
            path=request.path,
            status=response.status_code,
            duration_seconds=round(duration, 4),
        )
        return response

    @app.teardown_request
    def log_request_exception(exception=None):
        if exception:
            logger.error("Unhandled exception during request lifecycle", error=str(exception), exc_info=True)

    # 1. INITIALIZE CORS
    frontend_origin = os.getenv("FRONTEND_URL", "http://localhost:3000")
    cors.init_app(
        app,
        supports_credentials=True,  # Required for HttpOnly cookies across origins
        origins=[frontend_origin, "http://127.0.0.1:3000"],
        allow_headers=["Content-Type", "Authorization", "X-CSRF-TOKEN"],
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    )

    # 2. INITIALIZE EXTENSIONS
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    # 3. REGISTER CUSTOM JWT ERROR HANDLERS
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({
            "status": 401,
            "error": "unauthorized",
            "message": "Request is missing a valid authorization token."
        }), 401

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({
            "status": 401,
            "error": "token_expired",
            "message": "The token has expired. Please refresh your token."
        }), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({
            "status": 422,
            "error": "invalid_token",
            "message": "Signature verification failed or token is malformed."
        }), 422

    @jwt.revoked_token_loader
    def revoked_token_callback(jwt_header, jwt_payload):
        return jsonify({
            "status": 401,
            "error": "token_revoked",
            "message": "This token has been revoked. Please log in again."
        }), 401

    # 4. REGISTER RESTFUL API RESOURCES
    api = Api(app)
    register_routes(api)

    return app


def register_routes(api):
    # Import resource classes relative to server structure
    from server.resources.auth import (
        RegisterResource, 
        LoginResource, 
        LogoutResource, 
        MeResource, 
        RefreshTokenResource
    )
    from server.resources.users import (
        UsersResource, UserByIDResource, UserFollowResource, 
        UserFollowersResource, UserFollowingResource, UserStatsResource
    )
    from server.resources.categories import CategoriesResource, CategoryByIDResource, CategoryArticlesResource
    from server.resources.articles import ArticlesResource, ArticleByIDResource, ArticleUpvoteResource, ArticleCommentsResource, UserArticlesResource    
    from server.resources.reactions import ReactionsResource, ArticleReactionsResource, ReactionByIDResource, ReactionUpvoteResource, UserReactionsResource
    from server.resources.leagues import LeaguesResource, LeagueByIDResource
    from server.resources.teams import TeamsResource, TeamByIDResource
    from server.resources.matches import MatchesResource, MatchByIDResource, MatchLiveResource, MatchEventsResource, MatchPredictionsResource
    from server.resources.predictions import PredictionsResource, PredictionByIDResource, PredictionResolveResource, UserPredictionsResource
    from server.resources.admin import AdminReportsResource, AdminArticlePublishResource

    # Auth Routes
    api.add_resource(RegisterResource, "/auth/register")
    api.add_resource(LoginResource, "/auth/login")
    api.add_resource(LogoutResource, "/auth/logout") 
    api.add_resource(MeResource, "/auth/me")
    api.add_resource(RefreshTokenResource, "/auth/refresh")

    # Users
    api.add_resource(UsersResource, "/users")
    api.add_resource(UserByIDResource, "/users/<int:user_id>")
    api.add_resource(UserFollowResource, "/users/<int:user_id>/follow")
    api.add_resource(UserFollowersResource, "/users/<int:user_id>/followers")
    api.add_resource(UserFollowingResource, "/users/<int:user_id>/following")
    api.add_resource(UserStatsResource, "/users/<int:user_id>/stats")
    api.add_resource(UserArticlesResource, "/users/<int:user_id>/articles")
    api.add_resource(UserPredictionsResource, "/users/<int:user_id>/predictions")
    api.add_resource(UserReactionsResource, "/users/<int:user_id>/reactions")

    # Categories
    api.add_resource(CategoriesResource, "/categories")
    api.add_resource(CategoryByIDResource, "/categories/<int:category_id>")
    api.add_resource(CategoryArticlesResource, "/categories/<int:category_id>/articles")

    # Articles
    api.add_resource(ArticlesResource, "/articles")
    api.add_resource(ArticleByIDResource, "/articles/<int:article_id>")
    api.add_resource(ArticleUpvoteResource, "/articles/<int:article_id>/upvote")
    api.add_resource(ArticleCommentsResource, "/articles/<int:article_id>/comments")

    # Reactions
    api.add_resource(ReactionsResource, "/reactions")
    api.add_resource(ArticleReactionsResource, "/articles/<int:article_id>/reactions")
    api.add_resource(ReactionByIDResource, "/reactions/<int:reaction_id>")
    api.add_resource(ReactionUpvoteResource, "/reactions/<int:reaction_id>/upvote")

    # Leagues & Teams
    api.add_resource(LeaguesResource, "/leagues")
    api.add_resource(LeagueByIDResource, "/leagues/<int:league_id>")
    api.add_resource(TeamsResource, "/teams")
    api.add_resource(TeamByIDResource, "/teams/<int:team_id>")

    # Matches
    api.add_resource(MatchesResource, "/matches")
    api.add_resource(MatchByIDResource, "/matches/<int:match_id>")
    api.add_resource(MatchLiveResource, "/matches/<int:match_id>/live")
    api.add_resource(MatchEventsResource, "/matches/<int:match_id>/events")
    api.add_resource(MatchPredictionsResource, "/matches/<int:match_id>/predictions")

    # Predictions
    api.add_resource(PredictionsResource, "/predictions")
    api.add_resource(PredictionByIDResource, "/predictions/<int:prediction_id>")
    api.add_resource(PredictionResolveResource, "/predictions/<int:prediction_id>/resolve")

    # Admin
    api.add_resource(AdminReportsResource, "/admin/reports")
    api.add_resource(AdminArticlePublishResource, "/admin/articles/<int:article_id>/publish")