from app import app
from flask import jsonify
from models import (
    EconomicIndicator,
    CountryIndicatorValue,
    Country,
    User
)

@app.route('/stats', methods=['GET'])
def get_stats():
    stats = {
        'country_count': len(Country.query.all()),
        'indicator_count': len(EconomicIndicator.query.all()),
        'value_count': len(CountryIndicatorValue.query.all()),
        'user_count': len(User.query.filter_by(accepted=True).all())
    }

    return jsonify(stats), 200