import os
import logging

from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_jwt_extended import JWTManager

from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
cors = CORS(app, resources={
    r'*': { 'origins': 'http://localhost:3000' },
}, supports_credentials=True)

basedir = os.path.abspath(os.path.dirname(__file__))

# Logging
logger = logging.getLogger('werkzeug')
handler = logging.FileHandler(f'logs/{datetime.now().strftime("%Y-%m-%d")}.txt')
logger.addHandler(handler)

# Setting up SQLALCHEMY connection
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(basedir, "db.sqlite")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_WARN_20'] = 1
db = SQLAlchemy(app)
ma = Marshmallow(app)

# Do not sort JSON response keys
app.config['JSON_SORT_KEYS'] = False

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
from routes.log import *

if __name__ == '__main__':
    # from models import Log
    # Log.__table__.drop(db.engine)

    # db.create_all()
    app.run(debug=True, port=5001)