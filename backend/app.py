import os

from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_jwt_extended import JWTManager

from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
cors = CORS(app, resources={
    r'*': { 'origins': 'http://localhost:3000' },
}, supports_credentials=True)

basedir = os.path.abspath(os.path.dirname(__file__))

# Setting up SQLALCHEMY connection
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(basedir, "db.sqlite")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_WARN_20'] = 1
db = SQLAlchemy(app)
ma = Marshmallow(app)

# Setting up Flask-JWT extension
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
jwt = JWTManager(app)

# Setting up routes
from routes.auth import *
from routes.country import *
from routes.indicator import *
from routes.prediction import *
from routes.user import *
from routes.value import *

if __name__ == '__main__':
    # from models import User
    # User.__table__.drop(db.engine)

    # db.create_all()
    app.run(debug=True, port=5001)