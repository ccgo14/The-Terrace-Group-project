import logging
import os
import time
from datetime import timedelta
from pathlib import Path
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

# Load environment variables from server/.env explicitly
env_path = Path(__file__).parent / ".env"
load_dotenv(env_path)

# Instantiate extensions (FIXED: db is now an instance)
cors = CORS()
jwt = JWTManager()
# db = SQLAlchemy()
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
            (
                structlog.dev.ConsoleRenderer()
                if os.getenv("FLASK_ENV") != "production"
                else structlog.processors.JSONRenderer()
            ),
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

    # ---------------------------------------------------------
    # Database Directory & URI Configuration
    # ---------------------------------------------------------

    # 1. Ensure Flask's default instance directory exists
    try:
        os.makedirs(app.instance_path, exist_ok=True)
    except OSError as e:
        raise RuntimeError(
            f"Cannot create instance directory at {app.instance_path}: {e}. "
            "Ensure the application has write permissions to its root directory."
        ) from e

    # 2. Configure Database URI and safely handle paths
    database_url = os.getenv("DATABASE_URL")

    if database_url:
        if database_url.startswith("sqlite:////"):
            # Absolute SQLite path: sqlite:////home/caleb/.../app.db
            db_path = database_url[10:]  # Retains leading '/'
            db_dir = os.path.dirname(db_path)
            if db_dir:
                os.makedirs(db_dir, exist_ok=True)
            app.config["SQLALCHEMY_DATABASE_URI"] = database_url

        elif database_url.startswith("sqlite:///"):
            # Relative SQLite path: sqlite:///instance/app.db
            # Strip prefix (10 chars) AND any leading slashes to force relative pathing
            rel_path = database_url[10:].lstrip("/")

            # Anchor relative path cleanly to app.root_path (Group-project/server)
            abs_db_path = os.path.abspath(os.path.join(app.root_path, rel_path))
            db_dir = os.path.dirname(abs_db_path)
            if db_dir:
                os.makedirs(db_dir, exist_ok=True)

            # Format as an absolute URI with 4 slashes
            app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{abs_db_path}"

        else:
            # Non-SQLite database URLs (e.g., PostgreSQL, MySQL)
            app.config["SQLALCHEMY_DATABASE_URI"] = database_url
    else:
        # Default fallback: Use absolute path inside Flask's server/instance/ folder
        db_path = os.path.join(app.instance_path, "app.db")
        app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_path}"

    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Security & JWT Expiry
    jwt_secret_key = os.getenv("JWT_SECRET_KEY")
    if not jwt_secret_key:
        raise RuntimeError("JWT_SECRET_KEY must be configured in the environment")
    app.config["JWT_SECRET_KEY"] = jwt_secret_key

    access_minutes = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES_MINUTES", 60))
    refresh_days = int(os.getenv("JWT_REFRESH_TOKEN_EXPIRES_DAYS", 30))
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=access_minutes)
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=refresh_days)

    # JWT Token Setup (header-based only)
    app.config["JWT_TOKEN_LOCATION"] = ["headers"]

    # 0. INITIALIZE LOGGING & MIDDLEWARE
    configure_logging()
    logger = structlog.get_logger()
    logger.info(
        "Initializing Flask application", env=os.getenv("FLASK_ENV", "development")
    )

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
            log_method = logger.warning
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
            logger.error(
                "Unhandled exception during request lifecycle",
                error=str(exception),
                exc_info=True,
            )

    # 1. INITIALIZE CORS
    frontend_origin = os.getenv("FRONTEND_URL", "http://localhost:5173")
    vercel_origin = os.getenv("VERCEL_URL")
    origins = [
        frontend_origin,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    if vercel_origin:
        origins.append(vercel_origin)
    cors.init_app(
        app,
        supports_credentials=True,
        origins=origins,
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
        return (
            jsonify(
                {
                    "status": 401,
                    "error": "unauthorized",
                    "message": "Request is missing a valid authorization token.",
                }
            ),
            401,
        )

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return (
            jsonify(
                {
                    "status": 401,
                    "error": "token_expired",
                    "message": "The token has expired. Please refresh your token.",
                }
            ),
            401,
        )

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return (
            jsonify(
                {
                    "status": 422,
                    "error": "invalid_token",
                    "message": "Signature verification failed or token is malformed.",
                }
            ),
            422,
        )

    @jwt.revoked_token_loader
    def revoked_token_callback(jwt_header, jwt_payload):
        return (
            jsonify(
                {
                    "status": 401,
                    "error": "token_revoked",
                    "message": "This token has been revoked. Please log in again.",
                }
            ),
            401,
        )

    # 4. REGISTER RESTFUL API RESOURCES
    api = Api(app)

    # ---------------------------------------------------------
    # Root / Health Check Route
    # ---------------------------------------------------------
    @app.route("/")
    def index():
        """Root endpoint returning basic API status information."""
        return jsonify({
            "message": "Welcome to the Moringa Dev Hub API",
            "status": "online",
            "endpoints": {
                "articles": "/articles",
                "auth": "/auth",
                "categories": "/categories",
                "matches": "/matches",
                "predictions": "/predictions",
            }
        }), 200

    register_routes(api)

    return app


def register_routes(api):
    # Import resource classes using absolute/direct imports relative to server directory
    from .resources.auth import (
        RegisterResource,
        LoginResource,
        LogoutResource,
        MeResource,
        RefreshTokenResource,
    )
    from .resources.users import (
        UsersResource,
        UserByIDResource,
        UserFollowResource,
        UserFollowersResource,
        UserFollowingResource,
        UserStatsResource,
    )
    from .resources.categories import (
        CategoriesResource,
        CategoryByIDResource,
        CategoryArticlesResource,
    )
    from .resources.articles import (
        ArticlesResource,
        ArticleByIDResource,
        ArticleUpvoteResource,
        ArticleCommentsResource,
        UserArticlesResource,
    )
    from .resources.reactions import (
        ReactionsResource,
        ArticleReactionsResource,
        ReactionByIDResource,
        ReactionUpvoteResource,
        UserReactionsResource,
    )
    from .resources.leagues import LeaguesResource, LeagueByIDResource
    from .resources.teams import TeamsResource, TeamByIDResource
    from .resources.matches import (
        MatchesResource,
        MatchByIDResource,
        MatchLiveResource,
        MatchEventsResource,
        MatchPredictionsResource,
    )
    from .resources.predictions import (
        PredictionsResource,
        PredictionByIDResource,
        PredictionResolveResource,
        UserPredictionsResource,
    )
    from .resources.comments import CommentsResource, CommentByIDResource
    from .resources.admin import AdminReportsResource, AdminArticlePublishResource

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
    api.add_resource(
        PredictionResolveResource, "/predictions/<int:prediction_id>/resolve"
    )

    # Admin
    api.add_resource(AdminReportsResource, "/admin/reports")
    api.add_resource(
        AdminArticlePublishResource, "/admin/articles/<int:article_id>/publish"
    )

    # Comments
    api.add_resource(CommentsResource, "/comments")
    api.add_resource(CommentByIDResource, "/comments/<int:comment_id>")
