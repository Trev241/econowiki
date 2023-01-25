import sqlite3

conn = sqlite3.connect('country_stats.db')
columns = [
    'id INTEGER PRIMARY KEY AUTOINCREMENT',
    'un_code CHAR(3) UNIQUE NOT NULL',
    'iso_alpha_2_code CHAR(2) UNIQUE NOT NULL',
    'iso_alpha_3_code CHAR(3) UNIQUE NOT NULL',
    'name VARCHAR(32) NOT NULL'
]

create_table_cmd = f"CREATE TABLE Country ({','.join(columns)})"
# conn.execute(create_table_cmd)

columns = [
    'id INTEGER PRIMARY KEY AUTOINCREMENT',
    'short_name VARCHAR(16) NOT NULL',
    'name VARCHAR(32) NOT NULL',
    'description VARCHAR(128)',
]

create_table_cmd = f"CREATE TABLE Economic_Indicator ({','.join(columns)})"
# conn.execute(create_table_cmd)

columns = [
    'id INTEGER PRIMARY KEY AUTOINCREMENT',
    'country__id INTEGER'
    'economic_indicator_id INTEGER'
    'year '
    'FOREIGN KEY (country_id) REFERENCES Country(id)',
    'FOREIGN KEY (economic_indicator_id) REFERENCES Economic_Indicator(id)'
]

