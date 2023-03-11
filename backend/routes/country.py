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

    return jsonify({'status': 200, 'countries': jsonify(result).json})

@app.route('/country/<iso_alpha_3_code>', methods=['GET'])
def get_country(iso_alpha_3_code):
    country = Country.query.filter_by(iso_alpha_3_code=iso_alpha_3_code.upper()).one()
    
    return jsonify({'status': 200, 'country': country_schema.jsonify(country).json}) 