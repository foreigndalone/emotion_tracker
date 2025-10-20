# ai_server.py
import os
import json
from flask import Flask, request, jsonify, abort
from flask import Response
from flask_cors import CORS


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
import psycopg2
from db_controller import DBController


# UNIVERSAL REQUEST HANDLER
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    return response



connection = psycopg2.connect(
            dbname="emotion_tracker", 
            user="postgres", 
            password="elvis9020ozik",
            host="localhost",
            port="5432")

db_controller = DBController(connection=connection)

@app.route("/api/")
def home():
    return "✅ Flask server is running!"


# RECIEVING USER'S NAME AND AGE
@app.route("/api/add_user_info", methods=["POST", "OPTIONS"])
def addUserInfo():
    if request.method == "OPTIONS":
        # Браузер делает preflight — просто отвечаем "ок"
        return ("", 204)

    if not request.is_json:
        abort(400, description="Request must be JSON with Content‑Type: application/json")

    payload = request.get_json(silent=True) or {}
    age = payload.get("userAge")
    name = payload.get("userName")
    password = payload.get("userPassword")

    if not age or not name or not password:
        abort(400, description="Field 'choice' is required")

    id = db_controller.add(name, age, password)

    print(f"Name: {name} | ID: {id} | Password: {password} Age: {age}")

    if id:
            response_data = id
            return Response(
                json.dumps(response_data, ensure_ascii=False),
                content_type="application/json"
            ), 200
    else:
        print('Name Error!')
        response_data = "Name Error!"
        return Response(
            json.dumps(response_data, ensure_ascii=False),
            content_type="application/json"
            ), 200



# PASSWORD 
@app.route("/api/login_user", methods=["POST", "OPTIONS"])
def passwordHandler():
    if request.method == "OPTIONS":
    # Браузер делает preflight — просто отвечаем "ок"
        return ("", 204)
    if not request.is_json:
        abort(400, description="Request must be JSON with Content‑Type: application/json")
    payload = request.get_json(silent=True) or {}
    name = payload.get("userName")
    password = payload.get("userPassword")

    if not name or not password:
        abort(400, description="Field 'choice' is required")

    print(f"Name: {name} | Password: {password}")

    id = db_controller.password_handler_db(name, password)
    print(id)

    if id:
            response_data = id
            return Response(
                json.dumps(response_data, ensure_ascii=False),
                content_type="application/json"
            ), 200
    else:
        print('Name Error!')
        response_data = "Name Error!"
        return Response(
            json.dumps(response_data, ensure_ascii=False),
            content_type="application/json"
            ), 200








# RECIEVING USER'S GOAL 
@app.route("/api/add_user_goal", methods=["POST"])
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
@app.route("/api/add_user_reminder", methods=["POST", "OPTIONS"])
def addUserReminderTime():
    if request.method == "OPTIONS":
        return ("", 204)
    
    if not request.is_json:
        abort(400, description="Request must be JSON with Content‑Type: application/json")

    payload = request.get_json(silent=True) or {}
    reminder = payload.get("reminder")
    userId = payload.get("userId")

    if not userId or not reminder:
        abort(400, description="Field 'choice' is required")

    reminders = db_controller.add_reminder_db(userId, reminder)
    print(f"Reminder time: {reminder}")

    return Response(
        json.dumps(reminders, ensure_ascii=False),
        content_type="application/json"
    ), 200

@app.route("/api/delete_reminder", methods=["POST", "OPTIONS"])
def deleteReminder():
    if request.method == "OPTIONS":
        return ("", 204)
    
    if not request.is_json:
        abort(400, description="Request must be JSON with Content‑Type: application/json")

    payload = request.get_json(silent=True) or {}
    userId = payload.get('userId')
    reminder = payload.get('reminder')

    reminders = db_controller.delete_reminder_db(userId, reminder)
    return jsonify(reminders), 200

@app.route("/api/get_user_reminders", methods=["POST", "OPTIONS"])
def getUserReminders():
    if request.method == "OPTIONS":
        return ("", 204)
    if not request.is_json:
        abort(400, description="Request must be JSON with Content‑Type: application/json")

    payload = request.get_json(silent=True) or {}
    userId = payload.get("userId")

    if not userId:
        abort(400, description="Field 'choice' is required")

    reminders = db_controller.get_reminders_db(userId)

    response_data = reminders

    return Response(
        json.dumps(response_data, ensure_ascii=False),
        content_type="application/json"
    ), 200


# RECIEVING USER'S REFLECTIONS
@app.route("/api/add_reflection", methods=["POST"])
def addReflection():
    if not request.is_json:
        abort(400, description="Request must be JSON with Content‑Type: application/json")

    payload = request.get_json(silent=True) or {}
    user_id = payload.get("userId")
    text = payload.get('userText')
    mood = payload.get('userMood')
    dateOfReflection = payload.get('dateOfReflection')

    if not user_id or not text or not mood:
        abort(400, description="Field 'choice' is required")

    db_controller.add_reflection_db(user_id, mood, text)

    print(f"Reflection added for user {user_id}: {text} ({mood}) {dateOfReflection}")

    response_data =  "Reflection saved successfully"

    return Response(
        json.dumps(response_data, ensure_ascii=False),
        content_type="application/json"
    ), 200





# GET ALL REFLECTIONS OF USER
@app.route("/api/get_reflections", methods=["POST"])
def getReflections():
    print('pipiski')
    if not request.is_json:
        abort(400, description="Request must be JSON with Content‑Type: application/json")

    payload = request.get_json(silent=True) or {}
    userId = payload.get('userId')
    print(userId)
    reflections = db_controller.get_reflections_db(userId)
    print(f'{reflections} pipiski nashi')
    return jsonify(reflections), 200


@app.route("/api/delete_reflection", methods=["POST", "OPTIONS"])
def deleteReflections():
    if request.method == "OPTIONS":
        return ("", 204)
    
    if not request.is_json:
        abort(400, description="Request must be JSON with Content‑Type: application/json")

    payload = request.get_json(silent=True) or {}
    userId = payload.get('userId')
    id = payload.get('Id')

    reflections = db_controller.delete_reflection_db(id, userId)
    return jsonify(reflections), 200


# ENTRY‑POINT
if __name__ == "__main__":
    PORT = int(os.getenv("PORT", 5050))
    app.run(host="127.0.0.1", port=PORT, debug=False)

