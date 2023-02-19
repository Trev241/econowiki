from app import app, db
from flask import jsonify, request
from models import (
    Country,
    country_schema,
    countries_schema,
    EconomicIndicator,
    eco_indicator_schema,
    eco_indicators_schema,
    CountryIndicatorValue,
    country_val_schema,
    country_vals_schema
)

@app.route('/country', methods=['GET'])
def get_countries():
    countries = Country.query.all()
    result = countries_schema.dump(countries)

    return jsonify(result)

@app.route('/country/<iso_alpha_3_code>', methods=['GET'])
def get_country(iso_alpha_3_code: str):
    country = Country.query.filter_by(iso_alpha_3_code=iso_alpha_3_code.upper()).one()
    
    return country_schema.jsonify(country)

@app.route('/indicator', methods=['GET'])
def get_indicators():
    indicators = EconomicIndicator.query.all()
    result = eco_indicators_schema.dump(indicators)

    return jsonify(result)

@app.route('/indicator/<short_name>', methods=['GET'])
def get_indicator(short_name: str):
    indicator = EconomicIndicator.query.filter_by(short_name=short_name).one()

    return eco_indicator_schema.jsonify(indicator)

@app.route('/value/<iso_alpha_3_code>', methods=['GET'])
def get_values(iso_alpha_3_code: str):
    id = Country.query.filter_by(iso_alpha_3_code=iso_alpha_3_code).one().id
    values = CountryIndicatorValue.query.filter_by(country_id=id).all()
    result = country_vals_schema.dump(values)

    return jsonify(result)

@app.route('/value/add/', methods=['POST'])
def add_value():
    country_id = request.json['country_id']
    indicator_id = request.json['indicator_id']
    year = request.json['year']
    value = request.json['value']

    new_value = CountryIndicatorValue(country_id, indicator_id, year, value)

    db.session.add(new_value)
    db.session.commit()

    return country_val_schema.jsonify(new_value)

@app.route('/value/update/<id>', methods=['PUT'])
def update_value(id: int):
    entry = CountryIndicatorValue.query.get(id)

    country_id = request.json['country_id']
    indicator_id = request.json['indicator_id']
    year = request.json['year']
    value = request.json['value']

    entry.country_id = country_id
    entry.indicator_id = indicator_id
    entry.year = year
    entry.value = value

    db.session.commit()

    return country_val_schema.jsonify(entry)