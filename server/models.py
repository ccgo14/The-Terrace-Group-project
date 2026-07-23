from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from datetime import datetime

metadata = MetaData(
    naming_convention={
        "ix": "ix_%(column_0_label)s",
        "uq": "uq_%(table_name)s_%(column_0_name)s",
        "ck": "ck_%(table_name)s_%(constraint_name)s",
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
        "pk": "pk_%(table_name)s",
    }
)

db = SQLAlchemy(metadata=metadata)


class User(db.Model):
    __tablename__ = 'users'

    user_id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(20), nullable=False)
    last_name = db.Column(db.String(20), nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # 1. One-to-One with Profile (uselist=False ensures 1:1)
    profile = db.relationship('Profile', back_populates='user', uselist=False, cascade='all, delete-orphan')

    # 2. One-to-Many with Articles
    articles = db.relationship('Article', back_populates='author', cascade='all, delete-orphan')

    # 4. One-to-Many with Reactions
    reactions = db.relationship('Reaction', back_populates='user', cascade='all, delete-orphan')

    # 6. Many-to-Many with Categories (via Follows bridge)
    followed_categories = db.relationship('Category', secondary='follows', back_populates='followers')

    #a one-to-many relationship with Comment
    comments = db.relationship('Comment', back_populates='user', cascade='all, delete-orphan')


class Profile(db.Model):
    __tablename__ = 'profile'

    id = db.Column(db.Integer, primary_key=True)
    gender = db.Column(db.String(10), nullable=False)
    profile_pic = db.Column(db.String(200), default='https://placeholder.com')
    bio = db.Column(db.String(400), nullable=False)
    role = db.Column(db.Enum("admin", "author", "user"), nullable=False, default="user")
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), unique=True, nullable=False)

    # Relationship back to User
    user = db.relationship('User', back_populates='profile')


class Article(db.Model):
    __tablename__ = 'articles'

    article_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False, unique=True)
    content = db.Column(db.String(2000), nullable=False)
    cover_image = db.Column(db.String(100), default='https://placeholder.com')
    view_count = db.Column(db.Integer, default=0, nullable=False)
    likes_count = db.Column(db.Integer, default=0, nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey("categories.category_id"), nullable=False)
    published_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    author = db.relationship('User', back_populates='articles')
    category = db.relationship('Category', back_populates='articles')
    reactions = db.relationship('Reaction', back_populates='article', cascade='all, delete-orphan')
    comments = db.relationship('Comment', back_populates='article', cascade='all, delete-orphan')


# Add this new Comment class
class Comment(db.Model):
    __tablename__ = 'comments'

    comment_id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(1000), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    article_id = db.Column(db.Integer, db.ForeignKey("articles.article_id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships back to User and Article
    user = db.relationship('User', back_populates='comments')
    article = db.relationship('Article', back_populates='comments')


class Category(db.Model):
    __tablename__ = 'categories'

    category_id = db.Column(db.Integer, primary_key=True)
    category_name = db.Column(db.String(100), nullable=False, unique=True)
    icon = db.Column(db.String(50), nullable=True)
    description = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    articles = db.relationship('Article', back_populates='category', cascade='all, delete-orphan')
    followers = db.relationship('User', secondary='follows', back_populates='followed_categories')


class Reaction(db.Model):
    __tablename__ = 'reactions'

    reaction_id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.String(1000), nullable=False)
    reaction_type = db.Column(db.String(30), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    article_id = db.Column(db.Integer, db.ForeignKey("articles.article_id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    user = db.relationship('User', back_populates='reactions')
    article = db.relationship('Article', back_populates='reactions')


class Follow(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey("categories.category_id"), primary_key=True)