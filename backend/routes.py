from app import app, db
from flask import jsonify, request
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

@app.route('/country', methods=['GET'])
def get_countries():
    countries = Country.query.all()
    result = countries_schema.dump(countries)

    return jsonify(result), 200

@app.route('/country/<iso_alpha_3_code>', methods=['GET'])
def get_country(iso_alpha_3_code: str):
    country = Country.query.filter_by(iso_alpha_3_code=iso_alpha_3_code.upper()).one()
    
    return country_schema.jsonify(country), 200

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
def get_values(iso_alpha_3_code: str):
    id = Country.query.filter_by(iso_alpha_3_code=iso_alpha_3_code).one().id
    values = CountryIndicatorValue.query.filter_by(country_id=id).all()
    result = country_vals_schema.dump(values)

    return jsonify(result), 200

@app.route('/value/add', methods=['POST'])
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
def update_value(id: int):
    entry = CountryIndicatorValue.query.get(id)

    entry.country_id = request.json.get('country_id', None)
    entry.indicator_id = request.json.get('indicator_id', None)
    entry.year = request.json.get('year', None)
    entry.value = request.json.get('value', None)

    db.session.commit()

    return country_val_schema.jsonify(entry), 200

@app.route('/value/<id>', methods=['DELETE'])
def delete_value(id: int):
    entry = CountryIndicatorValue.query.get(id)
    db.session.delete(entry)
    db.session.commit()

    return country_val_schema.jsonify(entry), 200

@app.route('/auth/signin', methods=['POST'])
def login():
    email = request.json.get('email', None)
    username = request.json.get('username', None)

    kwargs = {'password': request.json.get('password', None)}
    if username:
        kwargs['username'] = username
    else:
        kwargs['email'] = email 
    
    print(kwargs)

    try:
        user = User.query.filter_by(**kwargs).one()
        access_token = create_access_token(identity=user.username)
        
        return jsonify(access_token=access_token)
    except:
        return jsonify({
            'message': 'Invalid credentials'
        }), 401

@app.route('/auth/signup', methods=['POST'])
def create_user():
    user = User(
        email=request.json.get('email', None),
        username=request.json.get('username', None),
        password=request.json.get('password', None)
    )

    db.session.add(user)
    db.session.commit()

    return user_schema.jsonify(user), 200
