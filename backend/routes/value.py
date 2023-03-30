import logging

from app import app, db
from flask import jsonify, request
from middleware import isAuth
from collections import OrderedDict
from predictions.forecaster import Forecaster
from models import (
    Country,
    CountryIndicatorValue,
    country_val_schema,
    EconomicIndicator,
    Log,
    LogType
)

@app.route('/value/<iso_alpha_3_code>', methods=['GET'])
@isAuth()
def get_values(iso_alpha_3_code):
    id = Country.query.filter_by(iso_alpha_3_code=iso_alpha_3_code).one().id
    values = CountryIndicatorValue.query.filter_by(country_id=id).all()

    data = OrderedDict(
        (
            indicator.short_name, 
            OrderedDict(
                [('indicator_id', indicator.id),
                 ('data', OrderedDict())]
            )
        ) for indicator in EconomicIndicator.query.all()
    )

    for entry in values:
        data[entry.indicator.short_name]['data'][entry.year] = {
            'value_id': entry.id,
            'value': entry.value
        }

    if request.args.get('withProjected', False):
        forecaster = Forecaster()
        
        for indicator, group in data.items():
            years = list(map(int, list(group['data'].keys())))
            
            # Skip if no data available
            if not years:
                continue

            input_years = years + [year for year in range(years[-1] + 1, years[-1] + 4)]
            
            predictions = forecaster.predict(id, group['indicator_id'], input_years)
            for year, prediction in predictions.items():
                prediction = round(prediction, 2)
                datasubset = data[indicator]['data']

                if year in datasubset:
                    datasubset[year]['prediction'] = prediction
                else:
                    datasubset[year] = {'prediction' : prediction}

    app.logger.info('Fetched values')
    return jsonify(data), 200

@app.route('/value/add', methods=['POST'])
@isAuth()
def add_value():
    new_value = CountryIndicatorValue(
        country_id=request.json.get('country_id', None), 
        indicator_id=request.json.get('indicator_id', None), 
        year=request.json.get('year', None), 
        value=request.json.get('value', None)
    )
    log = Log(request.uid, LogType.CREATE)

    db.session.add(new_value)
    db.session.add(log)
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

    log = Log(request.uid, LogType.UPDATE)

    db.session.add(log)
    db.session.commit()

    return country_val_schema.jsonify(entry), 200

@app.route('/value/<id>', methods=['DELETE'])
@isAuth()
def delete_value(id):
    entry = CountryIndicatorValue.query.get(int(id))
    db.session.delete(entry)
    log = Log(request.uid, LogType.DELETE)

    db.session.add(log)
    db.session.commit()

    return country_val_schema.jsonify(entry), 200