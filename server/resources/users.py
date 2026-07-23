from flask_restful import Resource
from models import db, User
from flask import make_response

class UsersResource(Resource):
    def get(self):
        users = User.query.all()
        users_list = []
        for user in users:
            if user.profile:
                profile_pic = user.profile.profile_pic
                bio = user.profile.bio
            else:
                profile_pic = None
                bio = None
                
            users_list.append({
                'user_id': user.user_id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'username': user.username,
                'email': user.email,
                'created_at': user.created_at,
                'updated_at': user.updated_at,
                'profile_pic': profile_pic,
                'bio': bio
            })
        return make_response({'users': users_list}, 200)