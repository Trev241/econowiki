from app import db, ma
from datetime import datetime
from enum import Enum

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

class CountryIndicatorValue(db.Model):
    __tablename__ = 'country_indicator_value'

    id = db.Column(db.Integer, primary_key=True)
    country_id = db.Column(db.Integer, db.ForeignKey('country.id'), nullable=False)
    indicator_id = db.Column(db.Integer, db.ForeignKey('economic_indicator.id'), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    value = db.Column(db.Float, nullable=False)

    country = db.relationship('Country', backref=db.backref('values', lazy=True))
    indicator = db.relationship('EconomicIndicator', backref=db.backref('values', lazy=True))

    constraint = db.UniqueConstraint(country_id, indicator_id, year, name='u_cty_ind_yr')

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

class UserType(str, Enum):
    ADMINISTRATOR = "ADMINISTRATOR"
    MODERATOR = "MODERATOR"
    MEMBER = "MEMBER" 

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(64), unique=True, nullable=False)
    username = db.Column(db.String(64), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    accepted = db.Column(db.Boolean())
    type = db.Column(db.Enum(UserType))
    createdAt = db.Column(db.DateTime(), nullable=False)

    def __init__(self, username, email, password, accepted=False, type=UserType.MEMBER):
        self.email = email
        self.username = username
        self.password = password
        self.accepted = accepted
        self.type = type
        self.createdAt = datetime.now()

class UserSchema(ma.Schema):
    class Meta:
        fields = ('id', 'email', 'username', 'accepted', 'type', 'createdAt')

user_schema = UserSchema()
users_schema = UserSchema(many=True)