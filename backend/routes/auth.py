import json
import bcrypt
import re

from app import app, db
from flask import jsonify, request, make_response
from flask_jwt_extended import create_access_token
from middleware import isAuth, isNotAuth
from utils import sendMail
from sqlalchemy.exc import IntegrityError, NoResultFound
from models import (
    UserType,
    User,
    user_schema
)

@app.route('/auth/signin', methods=['POST'])
@isNotAuth()
def login():
    kwargs = {}

    nameOrEmail = request.json.get('nameOrEmail', "")
    password = request.json.get('password', "")

    errors = {}
    if len(nameOrEmail.strip()) == 0:
        errors['nameOrEmail'] = 'Name/Email must not be empty!'
    if len(password.strip()) < 8:
        errors['password'] = 'Password length must be >= 8!'
    if json.dumps(errors) != "{}":
        return jsonify(errors), 403
    
    emailRegex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
    if re.fullmatch(emailRegex, nameOrEmail):
        kwargs['email'] = nameOrEmail
    else:
        kwargs['username'] = nameOrEmail

    try:
        user = User.query.filter_by(**kwargs).one()
        if not bcrypt.checkpw(password.encode('utf-8'), user.password):
            raise Exception("Wrong credentials!")
        if not user.accepted:
            raise Exception("Your registration is still pending approval. Please try again later.")

        token = create_access_token(identity=user.id, expires_delta=False)
        response = make_response(jsonify(user_schema.jsonify(user).json), 200)
        response.set_cookie('token', token, 60 * 60 * 24 * 7)
        return response
        
    except NoResultFound as e:
        return jsonify({'message': 'No such user exists.'}), 400
    except Exception as e:
        print(e)
        return jsonify({'message': str(e)}), 401

@app.route('/auth/signup', methods=['POST'])
@isNotAuth()
def create_user():
    email=request.json.get('email', '')
    username=request.json.get('username', '')
    password=request.json.get('password', '')

    errors = {}
    if len(username.strip()) == 0:
        errors['username'] = 'Username must not be empty!'
    if not re.fullmatch(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b', email.strip()):
        errors['email'] = 'The email given is invalid!'
    if len(password.strip()) < 8:
        errors['password'] = 'Password must contain at least 8 characters!'
    if json.dumps(errors) != "{}":
        return jsonify(errors), 400

    try:
        user = User(
            email=email, 
            username=username,
            password=bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(12)),
        )

        db.session.add(user)
        db.session.commit()

        admins = User.query.filter_by(type=UserType.ADMINISTRATOR)

        for admin in admins:
            body = f'''
                <p>Hello <b>ADMIN @{admin.username}</b>, a new user has signed up, visit the dashboard to accept/reject the user!</p>
                <span>DASHBOARD: <a href="http://localhost:3000/dashboard">http://localhost:3000/dashboard</a></span>
                <br />
                <span>MEMBER: <b>@{user.username}</b></span>
            '''
            sendMail(admin.email, 'user registration alert!', body)
        return jsonify({'message': 'User registration success'}), 200
    except IntegrityError:
        return jsonify({'message': 'An account with the given email or username already exists. Please login instead.'}), 422

@app.route('/auth/logout', methods=['POST'])
@isAuth()
def logout_user():
    response = make_response({'message': 'User logout success'}, 200)
    response.set_cookie('token', '', 0)
    return response

@app.route('/auth/user', methods=['GET'])
@isAuth()
def get_user():
    user = User.query.get(request.uid)
    return user_schema.jsonify(user), 200
    