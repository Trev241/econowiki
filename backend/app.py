import os
import pandas as pd

from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from sqlalchemy.orm import relationship

app = Flask(__name__)
cors = CORS(
    app, 
    resources={
        r'*': {'origins': '*'}
    }
)
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(basedir, "db.sqlite")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
ma = Marshmallow(app)

class Country(db.Model):
    __tablename__ = 'country'

    id = db.Column(db.Integer, primary_key=True)
    un_code = db.Column(db.Integer, unique=True, nullable=False)
    iso_alpha_2_code = db.Column(db.String(2), unique=True, nullable=False)
    iso_alpha_3_code = db.Column(db.String(3), unique=True, nullable=False)
    name = db.Column(db.String(32), nullable=False)

    def __init__(self, un_code, iso_alpha_2_code, iso_alpha_3_code, name):
        self.un_code = un_code
        self.iso_alpha_2_code = iso_alpha_2_code
        self.iso_alpha_3_code = iso_alpha_3_code
        self.name = name

class CountrySchema(ma.Schema):
    class Meta:
        fields = ('id', 'un_code', 'iso_alpha_2_code', 'iso_alpha_3_code', 'name')

country_schema = CountrySchema()
countries_schema = CountrySchema(many=True)

@app.route('/country', methods=['GET'])
def get_countries():
    countries = Country.query.all()
    result = countries_schema.dump(countries)
    return jsonify(result)

@app.route('/country/<iso_alpha_3_code>', methods=['GET'])
def get_country(iso_alpha_3_code: str):
    country = Country.query.filter_by(iso_alpha_3_code=iso_alpha_3_code.upper()).one()
    return country_schema.jsonify(country)

class EconomicIndicator(db.Model):
    __tablename__ = 'economic_indicator'

    id = db.Column(db.Integer, primary_key=True)
    short_name = db.Column(db.String(16), unique=True, nullable=False)
    name = db.Column(db.String(32), nullable=False)
    description = db.Column(db.String(128), nullable=False)

    def __init__(self, short_name, name, description):
        self.short_name = short_name
        self.name = name
        self.description = description

class EconomicIndicatorSchema(ma.Schema):
    class Meta:
        fields = ('id', 'short_name',  'name', 'description')

eco_indicator_schema = EconomicIndicatorSchema()
eco_indicators_schema = EconomicIndicatorSchema(many=True)

@app.route('/indicator', methods=['GET'])
def get_indicators():
    indicators = EconomicIndicator.query.all()
    result = eco_indicators_schema.dump(indicators)
    return jsonify(result)

class CountryIndicatorValue(db.Model):
    __tablename__ = 'country_indicator_value'

    id = db.Column(db.Integer, primary_key=True)
    country_id = db.Column(db.Integer, db.ForeignKey('country.id'), nullable=False)
    indicator_id = db.Column(db.Integer, db.ForeignKey('economic_indicator.id'), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    value = db.Column(db.Float, nullable=False)

    country = db.relationship('Country', backref=db.backref('values', lazy=True))
    indicator = db.relationship('EconomicIndicator', backref=db.backref('values', lazy=True))

    def __init__(self, country_id, indicator_id, year, value):
        self.country_id = country_id
        self.indicator_id = indicator_id
        self.year = year
        self.value = value

class CountryIndicatorValueSchema(ma.Schema):
    class Meta:
        fields = ('id', 'country_id', 'indicator_id', 'year', 'value')

country_val_schema = CountryIndicatorValueSchema()
country_vals_schema = CountryIndicatorValueSchema(many=True)

@app.route('/value/<iso_alpha_3_code>', methods=['GET'])
def get_values(iso_alpha_3_code: str):
    id = Country.query.filter_by(iso_alpha_3_code=iso_alpha_3_code).one().id
    values = CountryIndicatorValue.query.filter_by(country_id=id).all()
    result = country_vals_schema.dump(values)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, port=5001)