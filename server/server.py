# ai_server.py
import os
import json
from flask import Flask, request, jsonify, abort
from flask import Response
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

import psycopg2
from db_controller import DBController

connection = psycopg2.connect(
            dbname="emotion_tracker", 
            user="postgres", 
            password="elvis9020ozik",
            host="localhost",
            port="5432")

db_controller = DBController(connection=connection)


# RECIEVING USER'S NAME AND AGE
@app.route("/add_user_info", methods=["POST"])
def addUserInfo():
    if not request.is_json:
        abort(400, description="Request must be JSON with Content‑Type: application/json")

    payload = request.get_json(silent=True) or {}
    age = payload.get("userAge")
    name = payload.get("userName")

    if not age or not name:
        abort(400, description="Field 'choice' is required")

    db_controller.add(name, age)

    print(f"Name: {name} | Age: {age}")

    response_data = "Recieved user's name and age!"

    return Response(
        json.dumps(response_data, ensure_ascii=False),
        content_type="application/json"
    ), 200


# RECIEVING USER'S GOAL 
@app.route("/add_user_goal", methods=["POST"])
def addUserGoal():
    if not request.is_json:
        abort(400, description="Request must be JSON with Content‑Type: application/json")

    payload = request.get_json(silent=True) or {}
    goal = payload.get("userGoal")

    if not goal:
        abort(400, description="Field 'choice' is required")

    print(f"Goal: {goal}")

    response_data = "Recieved user's goal!"

    return Response(
        json.dumps(response_data, ensure_ascii=False),
        content_type="application/json"
    ), 200


# RECIEVING USER'S REMINDER'S TIME
@app.route("/add_user_reminders", methods=["POST"])
def addUserReminderTime():
    if not request.is_json:
        abort(400, description="Request must be JSON with Content‑Type: application/json")

    reminders = request.get_json(silent=True) or {}

    if not len(reminders):
        abort(400, description="Field 'choice' is required")

    print(f"Reminder time: {reminders}")

    response_data = "Recieved user's goal!"

    return Response(
        json.dumps(response_data, ensure_ascii=False),
        content_type="application/json"
    ), 200




# ENTRY‑POINT
if __name__ == "__main__":
    PORT = int(os.getenv("PORT", 5000))
    app.run(host="127.0.0.1", port=PORT, debug=False)
