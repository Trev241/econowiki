import sqlite3

conn = sqlite3.connect('db.sqlite.')

cur = conn.cursor()
cur.execute('SELECT * FROM country_indicator_value WHERE country_id=103 ')

matches = cur.fetchall()
print(matches)