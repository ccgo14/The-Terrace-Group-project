from flask import Flask
from models import db
from flask_migrate import Migrate


# create an instance of the flask app
app = Flask(__name__)

# app config
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"

# add flask migrate

migrate = Migrate(app=app, db=db)

# initialize app to use sqlalchemy
db.init_app(app=app)

if __name__ == '__main__':
    app.run(port=5555, debug=True)
    