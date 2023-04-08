from app import app
from flask import jsonify
from models import Log, logs_schema

@app.route('/logs', methods=['GET'])
def get_logs():
    logs = Log.query.order_by(Log.createdAt.desc()).all()
    result = logs_schema.dump(logs)

    return jsonify(result), 200
