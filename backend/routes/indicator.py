from flask import jsonify, request
from sqlalchemy.exc import IntegrityError

from app import app, db
from middleware import isAuth
from models import (
    EconomicIndicator,
    eco_indicator_schema,
    eco_indicators_schema
)

@app.route('/indicator', methods=['GET'])
def get_indicators():
    indicators = EconomicIndicator.query.all()
    result = eco_indicators_schema.dump(indicators)

    return jsonify(result), 200

@app.route('/indicator/<short_name>', methods=['GET'])
def get_indicator(short_name):
    indicator = EconomicIndicator.query.filter_by(short_name=short_name).one()

    return eco_indicator_schema.jsonify(indicator), 200

@app.route('/indicator/add', methods=['POST'])
@isAuth()
def add_indicator():
    for field in ['name', 'short_name', 'description']:
        if not request.json[field]:
            return jsonify({'message': f'Field "{field}" cannot be empty'}), 400

    try:
        new_indicator = EconomicIndicator(
            name=request.json.get('name', None),
            short_name=request.json.get('short_name', None),
            description=request.json.get('description', None)
        )
        
        db.session.add(new_indicator)
        db.session.commit()

        return eco_indicator_schema.jsonify(new_indicator), 200
    except IntegrityError as e:
        return jsonify({'message': 'The property "code" must be unique.'}), 400

@app.route('/indicator/update/<id>', methods=['PUT'])
@isAuth()
def update_indicator(id):
    indicator = EconomicIndicator.query.get(int(id))

    indicator.name = request.json.get('name', None)
    indicator.short_name = request.json.get('short_name', None)
    indicator.description = request.json.get('description', None)

    db.session.commit()

    return eco_indicator_schema.jsonify(indicator), 200

@app.route('/indicator/<id>', methods=['DELETE'])
@isAuth()
def delete_indicator(id):
    try:
        indicator = EconomicIndicator.query.get(int(id))
        db.session.delete(indicator)
        db.session.commit()

        return eco_indicator_schema.jsonify(indicator), 200
    except:
        return jsonify({'message': 'Failed to delete indicator. This could be because some values use it.'}), 400