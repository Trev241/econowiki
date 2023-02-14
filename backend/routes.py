from app import app
from flask import jsonify
from models import (
    Country,
    country_schema,
    countries_schema,
    EconomicIndicator,
    eco_indicators_schema,
    CountryIndicatorValue,
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

@app.route('/value/<iso_alpha_3_code>', methods=['GET'])
def get_values(iso_alpha_3_code: str):
    id = Country.query.filter_by(iso_alpha_3_code=iso_alpha_3_code).one().id
    values = CountryIndicatorValue.query.filter_by(country_id=id).all()
    result = country_vals_schema.dump(values)
    return jsonify(result)