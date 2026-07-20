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
    password = db.Column(db.String(50), nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    profile_pic = db.Column(db.String(200), nullable=True)
    bio = db.Column(db.String(400), nullable=False)
    role = db.Column(db.String(10), nullable=False )
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)

class Article(db.Model):
    __tablename__ = 'articles'

    article_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False, unique=True)
    content = db.Column(db.String(2000), nullable=False)
    cover_image = db.Column(db.String(100))
    view_count = db.Column(db.Integer)
    likes_count = db.Column(db.Integer)
    author_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey("categories.category_id"), nullable=False)
    published_at = db.Column(db.DateTime(), default=datetime.now())
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)


class Category(db.Model):
    __tablename__ = 'categories'


    category_id = db.Column(db.Integer, primary_key=True)
    category_name = db.Column(db.String(100), nullable=False, unique=True)
    icon = db.Column(db.String(20), nullable=False)
    description = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Reaction(db.Model):
    __tablename__ = 'reactions'

    reaction_id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.String(1000))
    reaction_type = db.Column(db.String(100))
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    article_id= db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Follow(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey("categories.category_id"), primary_key=True)




