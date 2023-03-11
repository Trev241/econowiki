from app import app, db
from flask import jsonify, request
from middleware import isAuth
from models import (
    Country,
    CountryIndicatorValue,
    country_val_schema,
    country_vals_schema
)

@app.route('/value/<iso_alpha_3_code>', methods=['GET'])
@isAuth()
def get_values(iso_alpha_3_code):
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
def update_value(id):
    entry = CountryIndicatorValue.query.get(int(id))

    entry.country_id = request.json.get('country_id', None)
    entry.indicator_id = request.json.get('indicator_id', None)
    entry.year = request.json.get('year', None)
    entry.value = request.json.get('value', None)

    db.session.commit()

    return country_val_schema.jsonify(entry), 200

@app.route('/value/<id>', methods=['DELETE'])
@isAuth()
def delete_value(id):
    entry = CountryIndicatorValue.query.get(int(id))
    db.session.delete(entry)
    db.session.commit()

    return country_val_schema.jsonify(entry), 200