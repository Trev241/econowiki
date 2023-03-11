from app import app, db
from flask import jsonify, request
from middleware import isAuth
from utils import sendMail
from models import (
    UserType,
    User,
    users_schema
)

@app.route('/users/<accepted>', methods=['GET'])
@isAuth()
def get_users(accepted):
    users = []
    if int(accepted) == 0:
        users = User.query.filter(User.accepted == False and User.id != request.uid).all()
    else:
        users = User.query.filter(User.accepted == True).all()
    users = users_schema.dump(users)
    return jsonify(users), 200

@app.route('/user/confirm', methods=['POST'])
@isAuth()
def confirm_signup():
    uid = int(request.json.get('uid', "0"))
    user = User.query.get(uid)
    if int(request.json.get('accept')) == 1:
        user.accepted = True
        body = f'''
            <p>Welcome <b>@{user.username}</b>, you are officially a MEMBER of the WORLD INCOME!</p>
            <span>Login: <a href="http://localhost:3000/login">http://localhost:3000/login</a></span>
        '''
        sendMail(user.email, 'user acceptance alert!', body)
    else:
        User.query.filter(User.id == uid).delete()
        body = f'''
            <p>Hello <b>@{user.username}</b>, the admin has rejected your registration!</p>
        '''
        sendMail(user.email, 'user acceptance alert!', body)

    db.session.commit()
    return jsonify({'message': 'User operation succeeded'}), 200
        
@app.route('/user/promote/<uid>/<promote>', methods=['POST'])
def promote_user(uid, promote):
    user = User.query.get(int(uid))
    types = list(UserType)
    if int(promote) == 1:
        user.type = types[types.index(user.type) - 1].value
    else:
        user.type = types[types.index(user.type) + 1].value

    db.session.commit()
    return jsonify({'type': user.type}), 200