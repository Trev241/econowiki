import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from sklearn.linear_model import LinearRegression

def clean(items):
    for idx, v in enumerate(items):
        try:
            items[idx] = float(v)
        except:
            items[idx] = np.NaN

    return items 

dataframe = pd.read_csv('../data/capital_formation.csv', index_col=False)
dataframe.set_index('Country', inplace=True)
dataframe.apply(clean, result_type='expand')

row = dataframe.iloc[0].copy()
row.dropna(inplace=True)

print(row)

x = np.array(row.keys()).reshape(-1, 1)
y = row.values

regressor = LinearRegression()
regressor.fit(x, y)
print(regressor.predict(x))

plot_x = x.flatten()
plot_y = y

plt.plot(plot_x, plot_y)
