import numpy as np

from sklearn.ensemble import (
    GradientBoostingRegressor,
    RandomForestRegressor,
    AdaBoostRegressor,
)
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures

from sqlalchemy.exc import NoResultFound
from models import CountryIndicatorValue

class Forecaster:
    def __init__(self):
        pass

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