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
    r'*': { 'origins': '*' }
})

basedir = os.path.abspath(os.path.dirname(__file__))

# Setting up SQLALCHEMY connection
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(basedir, "db.sqlite")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_WARN_20'] = 1
db = SQLAlchemy(app)
ma = Marshmallow(app)

# Setting up Flask-JWT extension
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET')
jwt = JWTManager(app)

from routes import *

if __name__ == '__main__':
    app.run(debug=True, port=5001)