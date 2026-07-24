from marshmallow import Schema, fields, ValidationError, validates_schema


# 1. PROFILE SCHEMAS


class ProfileSchema(Schema):
    id = fields.Int(dump_only=True)
    gender = fields.Str(required=True)
    bio = fields.Str(required=True)
    profile_pic = fields.Str(dump_default="https://placeholder.com")
    role = fields.Str(dump_default="user")

    # Relationship
    user = fields.Nested("UserSchema", exclude=("profile",))

    @validates_schema
    def validate_schema(self, data, **kwargs):
        errors = {}
        if "bio" in data and len(data["bio"]) > 400:
            errors["bio"] = ["Bio cannot exceed 400 characters"]
        if "role" in data and data["role"] not in ["admin", "author", "user"]:
            errors["role"] = ["Role must be one of: admin, author, user"]
        if errors:
            raise ValidationError(errors)


profile_schema = ProfileSchema()
profiles_schema = ProfileSchema(many=True)


# 2. USER SCHEMAS

class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    first_name = fields.Str(required=True)
    last_name = fields.Str(required=True)
    username = fields.Str(required=True)
    email = fields.Email(required=True)
    password = fields.Str(load_only=True, required=True)
    created_at = fields.DateTime(dump_only=True, required=True)
    updated_at = fields.DateTime(dump_only=True, required=True)

    # Relationships
    profile = fields.Nested(ProfileSchema, exclude=("user",))
    articles = fields.List(fields.Nested("ArticleSchema", exclude=("author",)))
    comments = fields.List(fields.Nested("CommentSchema", exclude=("user",)))

    @validates_schema
    def validate_schema(self, data, **kwargs):
        errors = {}
        if "first_name" in data and len(data["first_name"]) > 20:
            errors["first_name"] = ["First name cannot exceed 20 characters"]
        if "last_name" in data and len(data["last_name"]) > 20:
            errors["last_name"] = ["Last name cannot exceed 20 characters"]
        if "username" in data and len(data["username"]) > 50:
            errors["username"] = ["Username cannot exceed 50 characters"]
        if "password" in data and not (6 <= len(data["password"]) <= 255):
            errors["password"] = ["Password length must be between 6 and 255 characters"]
        if errors:
            raise ValidationError(errors)


user_schema = UserSchema()
users_schema = UserSchema(many=True)


# 3. CATEGORY SCHEMAS

class CategorySchema(Schema):
    id = fields.Int(dump_only=True)
    category_name = fields.Str(required=True)
    icon = fields.Str()
    description = fields.Str()

    # Relationships
    articles = fields.List(fields.Nested("ArticleSchema", exclude=("category",)))

    @validates_schema
    def validate_schema(self, data, **kwargs):
        errors = {}
        if "category_name" in data and len(data["category_name"]) > 100:
            errors["category_name"] = ["Category name cannot exceed 100 characters"]
        if "icon" in data and len(data["icon"]) > 50:
            errors["icon"] = ["Icon path/name cannot exceed 50 characters"]
        if "description" in data and len(data["description"]) > 500:
            errors["description"] = ["Description cannot exceed 500 characters"]
        if errors:
            raise ValidationError(errors)


category_schema = CategorySchema()
categories_schema = CategorySchema(many=True)


# 4. ARTICLE SCHEMAS


class ArticleSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True)
    content = fields.Str(required=True)
    cover_image = fields.Str(dump_default="https://placeholder.com")
    published = fields.Bool(dump_default=False)
    created_at = fields.DateTime(dump_only=True)

    # Relationships & Foreign Keys
    author_id = fields.Int(required=True)
    category_id = fields.Int(required=True)
    author = fields.Nested(UserSchema, only=("id", "username", "first_name", "last_name"))
    category = fields.Nested(CategorySchema, only=("id", "category_name"))

    @validates_schema
    def validate_schema(self, data, **kwargs):
        errors = {}
        if "title" in data and len(data["title"]) > 100:
            errors["title"] = ["Title cannot exceed 100 characters"]
        if "content" in data and len(data["content"]) > 2000:
            errors["content"] = ["Content cannot exceed 2000 characters"]
        if errors:
            raise ValidationError(errors)


article_schema = ArticleSchema()
articles_schema = ArticleSchema(many=True)


# 5. REACTION SCHEMAS


class ReactionSchema(Schema):
    id = fields.Int(dump_only=True)
    body = fields.Str(required=True)
    reaction_type = fields.Str(required=True)

    # Foreign Keys & Relationships
    user_id = fields.Int(required=True)
    article_id = fields.Int(required=True)
    user = fields.Nested(UserSchema, only=("id", "username"))

    @validates_schema
    def validate_schema(self, data, **kwargs):
        errors = {}
        if "body" in data and len(data["body"]) > 1000:
            errors["body"] = ["Reaction text cannot exceed 1000 characters"]
        if "reaction_type" in data and len(data["reaction_type"]) > 30:
            errors["reaction_type"] = ["Reaction type cannot exceed 30 characters"]
        if errors:
            raise ValidationError(errors)


reaction_schema = ReactionSchema()
reactions_schema = ReactionSchema(many=True)



# 6. COMMENT SCHEMAS

class CommentSchema(Schema):
    id = fields.Int(dump_only=True)
    content = fields.Str(required=True)
    created_at = fields.DateTime(dump_only=True)

    # Foreign Keys & Relationships
    user_id = fields.Int(required=True)
    article_id = fields.Int(required=True)
    user = fields.Nested(UserSchema, only=("id", "username"))

    @validates_schema
    def validate_schema(self, data, **kwargs):
        errors = {}
        if "content" in data and len(data["content"]) > 1000:
            errors["content"] = ["Comment content cannot exceed 1000 characters"]
        if errors:
            raise ValidationError(errors)


comment_schema = CommentSchema()
comments_schema = CommentSchema(many=True)



# 7. FOLLOW (JUNCTION) SCHEMAS


class FollowSchema(Schema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int(required=True)
    category_id = fields.Int(required=True)

    user = fields.Nested(UserSchema, only=("id", "username"))
    category = fields.Nested(CategorySchema, only=("id", "category_name"))


follow_schema = FollowSchema()
follows_schema = FollowSchema(many=True)