import json
import pandas as pd

from flask import Flask
from flask_restful import Api, Resource
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app, resources={r"*": {"origins": "*"}})
api = Api(app)

# ----------------------------------
# Reading data from CSV file
# TODO: Maybe change to SQL database 
# ----------------------------------
RESOURCES = {
    'INCOME_INDEX': 'income_index.csv', 
    'CAPITAL': 'capital_formation.csv', 
    'DOMESTIC_CREDITS': 'domestic_credits.csv', 
    'GDP_PER_CAPITA': 'gdp_per_capita.csv', 
    'GDP': 'gdp.csv', 
    'GNI_FEMALE': 'gni_female.csv', 
    'GNI MALE': 'gni_male.csv', 
    'GNI_PER_CAPITA': 'gni_per_capita.csv', 
    'LABOUR_SHARE': 'labour_share.csv'
}

DATA = dict()

for name, resource in RESOURCES.items():
    print(f'Reading {name} from resource: {resource}...')
    
    data = pd.read_csv(f'data/{resource}')
    data.set_index(['Country'], inplace=True)

    DATA[name] = data

class Country(Resource):
    def get(self, country_code):
        response = dict()
        
        for resource_name in RESOURCES.keys():
            # TODO: Ignore favicon.ico GET requests
            response[resource_name] = DATA[resource_name].loc[country_code].to_json()
        
        return json.dumps(response)

api.add_resource(Country, '/<string:country_code>')

if __name__ == '__main__':
    app.run(debug=True)