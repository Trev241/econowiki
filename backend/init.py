# SCRIPT TO INITIALIZE DATABASE

import sqlite3

conn = sqlite3.connect('country_statistics.db')

# ---------------
# CREATING TABLES
# ---------------

# Creating COUNTRY table
columns = [
    'id INTEGER PRIMARY KEY AUTOINCREMENT',
    'un_code INTEGER(2) UNIQUE NOT NULL',
    'iso_alpha_2_code CHAR(2) UNIQUE NOT NULL',
    'iso_alpha_3_code CHAR(3) UNIQUE NOT NULL',
    'name VARCHAR(32) NOT NULL'
]
command = f'CREATE TABLE country ({",".join(columns)})'
conn.execute(command)

# Creating ECONOMIC_INDICATOR table
columns = [
    'id INTEGER PRIMARY KEY AUTOINCREMENT',
    'short_name VARCHAR(16) NOT NULL',
    'name VARCHAR(32) NOT NULL',
    'description VARCHAR(128)'
]
command = f'CREATE TABLE economic_indicator ({",".join(columns)})'
conn.execute(command)

# Creating COUNTRY_INDICATOR_VALUE table
columns = [
    'id INTEGER PRIMARY KEY AUTOINCREMENT',
    'country_id INTEGER',
    'indicator_id INTEGER',
    'year INTEGER(2)',
    'value FLOAT',
    'FOREIGN KEY (country_id) REFERENCES country(id)',
    'FOREIGN KEY (indicator_id) REFERENCES economic_indicator(id)'
]
command = f'CREATE TABLE country_indicator_value ({",".join(columns)})'
conn.execute(command)

# --------------
# INSERTING DATA
#---------------

# TODO: Inserting data about all countries

# Inserting data about all economic indiactors
indicators = [
    '"GFCF" "Gross Fixed Capital Formation" "The acquisition of produced assets (including purchases of second-hand assets), including the production of such assets by producers for their own use, minus disposals."',
    ''
]