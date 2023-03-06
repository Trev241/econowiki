import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from sklearn.linear_model import LinearRegression
from models import CountryIndicatorValue

class Forecaster:
    def __init__(self):
        pass

    def predict(self, country_id, indicator_id):
        values = CountryIndicatorValue.query.filter_by(country_id=country_id).all()
        
        x = []
        y = []

        for entry in values:
            if entry.indicator_id == indicator_id:
                x.append(entry.year)
                y.append(entry.value)

        x = np.array(x).reshape(-1, 1)
        y = np.array(y)

        regressor = LinearRegression()
        regressor.fit(x, y)

        return regressor.predict(x).tolist()
