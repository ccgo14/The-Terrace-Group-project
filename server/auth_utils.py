from functools import wraps
from flask import make_response
from flask_jwt_extended import verify_jwt_in_request, get_jwt

def role_required(allowed_roles):
    """
    Decorator to enforce Role-Based Access Control (RBAC).
    Usage: @role_required(["admin"]) or @role_required(["admin", "author"])
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            # 1. Verifies a valid JWT cookie/header exists
            verify_jwt_in_request()
            
            # 2. Extract claims and verify user role
            claims = get_jwt()
            user_role = claims.get("role", "user")

            if user_role not in allowed_roles:
                return make_response(
                    {"status": 403, "message": "Access denied: insufficient permissions"}, 
                    403
                )
            return fn(*args, **kwargs)
        return wrapper
    return decorator