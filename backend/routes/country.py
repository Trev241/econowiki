from app import app
from models import (
    Country,
    country_schema,
    countries_schema
)
from flask import jsonify

@app.route('/country', methods=['GET'])
def get_countries():
    countries = Country.query.all()
    result = countries_schema.dump(countries)

    return jsonify(result), 200

@app.route('/country/<iso_alpha_3_code>', methods=['GET'])
def get_country(iso_alpha_3_code):
    country = Country.query.filter_by(iso_alpha_3_code=iso_alpha_3_code.upper()).one()
    
    return country_schema.jsonify(country), 200 