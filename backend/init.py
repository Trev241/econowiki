# SCRIPT TO INITIALIZE DATABASE

import re
import pandas as pd
import app
import bcrypt

from models import User, UserType

# Create database
app.db.create_all()

# COUNTRIES
file = open('data/countries.txt', 'r')
for line in file.readlines():
    countries = re.search("[A-Z].+", line)
    parts = re.split(",", countries.group())
    
    country = app.Country(parts[3], parts[1], parts[2], parts[0])
    app.db.session.add(country)

file.close()
app.db.session.commit()

# ECONOMIC INDICATORS
file = open('data/indicators.txt', 'r')
for line in file.readlines():
    parts = line.split('\t')

    indicator = app.EconomicIndicator(parts[0], parts[1], parts[2])
    app.db.session.add(indicator)

file.close()
app.db.session.commit()

# VALUES
RESOURCES = {
    'GFCF': 'capital_formation.csv',
    'DCRED': 'domestic_credits.csv',
    'GDPPC': 'gdp_per_capita.csv',
    'GDP': 'gdp.csv',
    'GNI(F)': 'gni_female.csv',
    'GNI(M)': 'gni_male.csv',
    'GNIPC': 'gni_per_capita.csv',
    'II': 'income_index.csv',
    'LS': 'labour_share.csv'
}

values = list()

for name, file in RESOURCES.items():
    data = pd.read_csv(f'data/{file}')
    data.set_index(['Country'], inplace=True)
    
    # Fetch indicator id    
    indicator_id = app.EconomicIndicator.query.with_entities(app.EconomicIndicator.id).filter_by(short_name=name).one()[0]
    years = data.columns

    for row in data.itertuples():
        try:
            # Fetch country id
            country_id = app.Country.query.with_entities(app.Country.id).filter_by(name=row[0]).one()[0]
            for i, year in enumerate(years):
                try:
                    # Converting values
                    value = float(row[i + 1])
                    year = int(year)

                    # Insert values
                    entry = app.CountryIndicatorValue(country_id, indicator_id, year, value)
                    app.db.session.add(entry)
                except Exception as e:
                    pass

        except:
            print(f'Could not find ID for {row[0]}! Data excluded from migration')

app.db.session.commit()

# Create a root user
root = User(
    email="admin@gmail.com",
    username="admin",
    password=bcrypt.hashpw("admin1234".encode('utf-8'), bcrypt.gensalt(12)),
    accepted=True,
    type=UserType.ADMINISTRATOR
)
app.db.session.add(root)
app.db.session.commit()

# Close session
app.db.session.close()