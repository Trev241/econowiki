import json
import pandas as pd

from flask import Flask
from flask_restful import Api, Resource

app = Flask(__name__)
api = Api(app)

# Reading data from CSV file
# TODO: Maybe change to SQL database 
INCOMES = pd.read_csv('data/incomes.csv')
INCOMES.set_index(['Country'], inplace=True)

class Country(Resource):
    def get(self, country_code):
        return json.loads(INCOMES.loc[country_code].to_json())

api.add_resource(Country, '/<string:country_code>')

if __name__ == '__main__':
    app.run(debug=True)