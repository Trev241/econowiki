import numpy as np
import pandas as pd
from sklearn.ensemble import (
    GradientBoostingRegressor,
    RandomForestRegressor,
    AdaBoostRegressor,
)
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.tree import DecisionTreeRegressor

from sqlalchemy.exc import NoResultFound
from models import (
    CountryIndicatorValue,
    country_vals_schema
)

class Forecaster:
    def __init__(self):
        pass

    def window_input_output(input_length: int, output_length: int, data: pd.DataFrame) -> pd.DataFrame:
        df = data.copy()
        
        i = 1
        while i < input_length:
            df[f'x_{i}'] = df['value'].shift(-i)
            i = i + 1
            
        j = 0
        while j < output_length:
            df[f'y_{j}'] = df['value'].shift(-output_length-j)
            j = j + 1
            
        df = df.dropna(axis=0)
        
        return df

    def timeseries_predict(self, country_id, indicator_id, years):
        entries = CountryIndicatorValue.query.filter_by(country_id=country_id, indicator_id=indicator_id).all()
        
        data = {
            'year': [],
            'value': []
        }

        for entry in entries:
            data['year'].append(entry.year)
            data['value'].append(entry.value)

        df = pd.DataFrame(data)
        df.set_index('year', inplace=True)
        length = len(data['year']) // 2 

        mod_df = Forecaster.window_input_output(length, length, df)
        print(mod_df)

        X_cols = [col for col in mod_df if col.startswith('x')]
        X_cols.insert(0, 'value')
        y_cols = [col for col in mod_df if col.startswith('y')]

        X_train = mod_df[X_cols].values
        y_train = mod_df[y_cols].values

        X_test = mod_df[X_cols][-2:].values

        regressor = DecisionTreeRegressor(random_state=42)
        regressor.fit(X_train, y_train)
        preds = regressor.predict(X_test).tolist()

        return {data['year'][length + idx + 1]: item for idx, item in enumerate(preds[-1])}

    def predict(self, country_id, indicator_id, years):
        result = []

        try:
            values = CountryIndicatorValue.query.filter_by(country_id=country_id, indicator_id=indicator_id).all()
            x = []
            y = []     

            for entry in values:
                x.append(entry.year)
                y.append(entry.value)
                
            x = np.array(x).reshape(-1, 1)
            y = np.array(y)

            poly = PolynomialFeatures(degree=5)
            X_poly = poly.fit_transform(x)

            regressor = LinearRegression()
            regressor.fit(X_poly, y)
            
            samples = np.array(years).reshape(-1, 1)
            poly_samples = poly.fit_transform(samples)
            
            result = {years[idx]: prediction for idx, prediction in enumerate(regressor.predict(poly_samples).tolist())}
        except NoResultFound:
            print(f'Could not retrieve any entries')
        except Exception as e:
            print(f'An error occurred while trying to make a prediction. {e}')
        finally:
            return result