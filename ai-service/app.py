from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

NODE_BACKEND_URL = os.getenv("NODE_BACKEND_URL", "http://localhost:5000")

# Load OpenCV's built-in face detector (Haar Cascade)
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

@app.route('/api/analyze-frame', methods=['POST'])
def analyze_frame():
    if 'frame' not in request.files:
        return jsonify({"error": "No frame provided"}), 400

    file = request.files['frame']
    file_bytes = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    if img is None:
        return jsonify({"error": "Invalid image"}), 400

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.05, minNeighbors=4, minSize=(40, 40))

    face_count = len(faces)


    result = {
        "faceCount": face_count,
        "status": "ok"
    }

    if face_count == 0:
        result["violation"] = "no-face"
    elif face_count > 1:
        result["violation"] = "multiple-faces"

    return jsonify(result)


@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "EagleEye AI service is running"})


if __name__ == '__main__':
    port = int(os.getenv("PORT", 6000))
    app.run(debug=True, port=port)