from app import app, db
from flask import jsonify, request, make_response
from flask_jwt_extended import create_access_token
from models import (
    Country,
    country_schema,
    countries_schema,
    EconomicIndicator,
    eco_indicator_schema,
    eco_indicators_schema,
    CountryIndicatorValue,
    country_val_schema,
    country_vals_schema,
    User,
    user_schema
)
from middleware import isNotAuth, isAuth
import bcrypt
import re

@app.route('/country', methods=['GET'])
def get_countries():
    countries = Country.query.all()
    result = countries_schema.dump(countries)

    return jsonify({'status': 200, 'countries': jsonify(result).json})

@app.route('/country/<iso_alpha_3_code>', methods=['GET'])
def get_country(iso_alpha_3_code: str):
    country = Country.query.filter_by(iso_alpha_3_code=iso_alpha_3_code.upper()).one()
    
    return jsonify({'status': 200, 'country': country_schema.jsonify(country).json}) 

@app.route('/indicator', methods=['GET'])
def get_indicators():
    indicators = EconomicIndicator.query.all()
    result = eco_indicators_schema.dump(indicators)

    return jsonify(result), 200

@app.route('/indicator/<short_name>', methods=['GET'])
def get_indicator(short_name: str):
    indicator = EconomicIndicator.query.filter_by(short_name=short_name).one()

    return eco_indicator_schema.jsonify(indicator), 200

@app.route('/value/<iso_alpha_3_code>', methods=['GET'])
@isAuth()
def get_values(iso_alpha_3_code: str):
    id = Country.query.filter_by(iso_alpha_3_code=iso_alpha_3_code).one().id
    values = CountryIndicatorValue.query.filter_by(country_id=id).all()
    result = country_vals_schema.dump(values)

    return jsonify(result), 200

@app.route('/value/add', methods=['POST'])
@isAuth()
def add_value():
    new_value = CountryIndicatorValue(
        country_id=request.json.get('country_id', None), 
        indicator_id=request.json.get('indicator_id', None), 
        year=request.json.get('year', None), 
        value=request.json.get('value', None)
    )

    db.session.add(new_value)
    db.session.commit()

    return country_val_schema.jsonify(new_value), 200

@app.route('/value/update/<id>', methods=['PUT'])
@isAuth()
def update_value(id: int):
    entry = CountryIndicatorValue.query.get(id)

    entry.country_id = request.json.get('country_id', None)
    entry.indicator_id = request.json.get('indicator_id', None)
    entry.year = request.json.get('year', None)
    entry.value = request.json.get('value', None)

    db.session.commit()

    return country_val_schema.jsonify(entry), 200

@app.route('/value/<id>', methods=['DELETE'])
@isAuth()
def delete_value(id: int):
    entry = CountryIndicatorValue.query.get(id)
    db.session.delete(entry)
    db.session.commit()

    return country_val_schema.jsonify(entry), 200

@app.route('/auth/signin', methods=['POST'])
@isNotAuth()
def login():
    kwargs = {}

    nameOrEmail = request.json.get('nameOrEmail', None)
    emailRegex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
    if re.fullmatch(emailRegex, nameOrEmail):
        kwargs['email'] = nameOrEmail
    else:
        kwargs['username'] = nameOrEmail

    try:
        user = User.query.filter_by(**kwargs).one()
        if not bcrypt.checkpw(request.json.get('password', None).encode('utf-8'),
            user.password):
            raise Exception("Wrong credentials!")

        token = create_access_token(identity=user.id, expires_delta=False)
        response = make_response(jsonify({'user': user_schema.jsonify(user).json,
            'status': 200}))
        response.set_cookie('token', token, 60 * 60 * 24 * 7)
        return response
        
    except Exception as e:
        print(e)
        return jsonify({
            'status': 401,
            'message': 'Wrong credentials!'
        })

@app.route('/auth/signup', methods=['POST'])
@isNotAuth()
def create_user():
    user = User(
        email=request.json.get('email', None),
        username=request.json.get('username', None),
        password=bcrypt.hashpw(request.json.get('password', None).encode('utf-8'),
            bcrypt.gensalt(12)),
        accepted=False,
        type=request.json.get('type', None)
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({'status': 200})

@app.route('/auth/logout', methods=['POST'])
@isAuth()
def logout_user():
    response = make_response(jsonify({'status': 200}))
    response.set_cookie('token', '', 0)
    return response

@app.route('/auth/user', methods=['GET'])
@isAuth()
def get_user():
    user = User.query.get(request.uid)
    return jsonify({'status': 200, 'user': user_schema.jsonify(user).json})