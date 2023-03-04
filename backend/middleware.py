from functools import wraps
from flask import request, jsonify
from flask_jwt_extended import decode_token, exceptions

def isNotAuth():
    def _isNotAuth(f):
        @wraps(f)
        def __isNotAuth(*args, **kwargs):
            token = request.cookies.get('token', None)
            try:
                if token:
                    payload = decode_token(token)
                    return jsonify({'status': 500,
                                    'message': 'You are already authenticated!'})
            except exceptions.JWTDecodeError as e:
                print(e)
            response = f(*args, **kwargs)
            return response
        return __isNotAuth
    return _isNotAuth


def isAuth():
    def _isAuth(f):
        @wraps(f)
        def __isAuth(*args, **kwargs):
            token = request.cookies.get('token', None)
            try:
                if not token:
                    raise exceptions.JWTDecodeError("Token is corrupted!")
                payload = decode_token(token)
                request.uid = payload.get('sub', None)
                response = f(*args, **kwargs)
                return response
            except exceptions.JWTDecodeError as e:
                print(e)
                return jsonify({'status': 401, 'message': 'Token is corrupted!'})
        return __isAuth
    return _isAuth