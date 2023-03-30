from app import app
from flask import jsonify, request
from middleware import isAuth
from sqlalchemy.exc import NoResultFound
from predictions.forecaster import Forecaster
from models import (
    Country,
    EconomicIndicator
)

@app.route('/prediction', methods=['POST'])
# @isAuth()
def fetch_predictions():
    iso_alpha_3_code = request.json.get('iso_alpha_3_code', None)
    indicator_short_name = request.json.get('indicator_short_name', None)
    years = request.json.get('years', None)

    try:
        country_id = Country.query.filter_by(iso_alpha_3_code=iso_alpha_3_code).one().id
        indicator_id = EconomicIndicator.query.filter_by(short_name=indicator_short_name).one().id
        
        forecaster = Forecaster()
        result = forecaster.timeseries_predict(country_id, indicator_id, years)
        # result = forecaster.predict(country_id, indicator_id, years)

        return jsonify(result), 200
    except NoResultFound:
        return jsonify({'message': f'The country code or indicator short name specified does not exist.'}), 422