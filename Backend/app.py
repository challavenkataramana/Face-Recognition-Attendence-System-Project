from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import subprocess
import csv
import cv2
import uuid
import base64
from PIL import Image
from io import BytesIO
import numpy as np
import face_recognition  

app = Flask(__name__)
CORS(app) 


DATASET_FOLDER = "dataset"
ATTENDANCE_FILE = "attendance.csv"

os.makedirs(DATASET_FOLDER, exist_ok=True)

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    name = data.get("name")
    image_data = data.get("image")

    if not name or not image_data:
        return jsonify({"error": "Name and image are required"}), 400

    person_dir = os.path.join(DATASET_FOLDER, name)
    os.makedirs(person_dir, exist_ok=True)

    try:
        
        header, encoded = image_data.split(",", 1)
        img_bytes = base64.b64decode(encoded)
        img = Image.open(BytesIO(img_bytes)).convert("RGB")

        img_cv = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)

        
        face_locations = face_recognition.face_locations(img_cv)
        if len(face_locations) == 0:
            return jsonify({"error": "No face detected. Please try again with better lighting or alignment."}), 400

        img_filename = f"{name}_{uuid.uuid4().hex[:6]}.jpg"
        img_path = os.path.join(person_dir, img_filename)
        cv2.imwrite(img_path, img_cv)

        return jsonify({"message": f"Face image saved to {img_path}"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to save image: {e}"}), 500


@app.route("/encode", methods=["POST"])
def encode_faces():
    try:
        result = subprocess.run(["python3", "encode_faces.py"], capture_output=True, text=True)
        output = result.stdout + "\n" + result.stderr 
        return jsonify({"output": output.strip()}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/recognize", methods=["GET"])
def recognize_faces():
    try:
       
        result = subprocess.run(
            ["python3", "recognize_and_log.py"],
            capture_output=True,
            text=True
        )
        
        output = result.stdout.strip()
        print("[DEBUG] Script output:\n", output)

        name = "Unknown"
        for line in output.splitlines():
            if "[ATTENDANCE]" in line:
                parts = line.split()
                if len(parts) >= 2:
                    name = parts[1] 
                    break

        return jsonify({"message": f"Face recognized: {name}"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/attendance", methods=["GET"])
def get_attendance():
    try:
        if not os.path.exists(ATTENDANCE_FILE):
            return jsonify({"attendance": []}), 200

        with open(ATTENDANCE_FILE, "r") as f:
            reader = csv.DictReader(f)
            attendance = list(reader)

        return jsonify({"attendance": attendance}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)




"""
app.py - Flask Backend for Real-Time Face Recognition Attendance System

This file serves as the backend server for the Real-Time Face Recognition Attendance System.
Originally, the project was implemented using only Python scripts for face registration, encoding, and attendance logging.
As an enhancement, a web-based frontend was added using React to provide a user-friendly interface.

Key Responsibilities:
- Exposes REST API endpoints for face registration, encoding, and attendance logging.
- Handles image uploads and communicates with the face recognition logic.
- Sends and receives data to/from the React frontend via HTTP requests (JSON).
- Manages server-side data storage and processing.

Frontend Integration:
- The React frontend interacts with this Flask backend by making API calls for all major functionalities.
- Users can register faces, view attendance, and trigger recognition through the web interface.
- All heavy processing (face detection, encoding, and recognition) is handled by this backend.

This file is the main entry point for the backend server. 
To run the complete application, start this Flask server and then run the React frontend.
"""
