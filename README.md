# 🦅 EagleEye — AI-Based Online Exam Proctoring System

EagleEye is a real-time AI-based online exam proctoring system that monitors students during a test using their webcam and browser activity, automatically flagging suspicious behaviour for instructor review — without requiring a human proctor to watch every student live.

## 📌 Problem Statement

The rapid growth of online examinations has made it difficult to ensure academic integrity without a human proctor physically supervising every student. EagleEye addresses this by combining computer vision, browser-level monitoring, and a custom rule engine to detect and score suspicious activity in real time.

## ✨ Features

- **Real-time face detection** — flags when a student's face is not visible or when multiple faces appear in frame (OpenCV)
- **Tab-switch & window-blur detection** — catches when a student navigates away from the test tab
- **Consecutive-detection thresholding** — avoids false positives from brief head movements by requiring sustained violations before penalizing
- **Automatic Integrity Scoring** — a custom rule engine deducts points based on violation severity, producing a final trust score per student
- **Multi-subject MCQ tests** — DSA, Operating Systems, DBMS, Computer Networks, and AI & ML question banks
- **Student Dashboard** — test history, average integrity score, and quick access to start a new test
- **Instructor Dashboard** — view all students' sessions, scores, and a full violation timeline per session
- **Camera preview step** — confirms webcam access before the test begins, with guaranteed camera shutdown on submission
- **Role-based authentication** — separate student and instructor experiences via JWT

## 🏗️ Architecture

┌───────────────────┐        ┌───────────────────┐        ┌───────────────────┐
│   React Frontend   │◄──────►│  Node/Express API  │◄──────►│   MongoDB Atlas     │
│      (Vite)         │        │  (Auth, Sessions,   │        │ (Users, Sessions,   │
│                      │        │   Violations,        │        │    Violations)       │
│                      │        │   Integrity Score)   │        │                      │
└──────────┬───────────┘        └─────────────────────┘    └──────────────────────┘
           │
           │  webcam frame every 5s
           ▼
┌───────────────────────┐
│  Python/Flask Service   │
│  OpenCV Face Detection   │
└───────────────────────────┘


The React frontend coordinates between the two backend services: it sends webcam frames to the Python AI service for analysis, and if a violation is detected, it calls the Node backend to log it and update the integrity score.

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, Axios |
| Backend | Node.js, Express.js, JWT Authentication |
| Database | MongoDB Atlas (Mongoose) |
| AI Service | Python, Flask, OpenCV (Haar Cascade face detection) |
| Deployment | Render (backend + AI service), Vercel (frontend) |

## 📂 Project Structure

eagleeye-proctoring/
├── client/ # React frontend
│ └── src/
│ ├── pages/ # Login, Register, TestPage, Dashboard, StudentDashboard
│ └── components/ # Sidebar, Navbar
├── server/ # Node/Express backend
│ ├── models/ # User, TestSession, ViolationLog
│ ├── routes/ # auth, testSession, violation
│ └── middleware/ # JWT verification
└── ai-service/ # Python/Flask AI microservice
└── app.py # Face detection endpoint


## 🚀 Running Locally

### Prerequisites
- Node.js (v18+)
- Python (3.9+)
- A MongoDB Atlas account (free tier)

### 1. Backend
```bash
cd server
npm install
# Create a .env file with MONGO_URI, JWT_SECRET, PORT
npm run dev
```

### 2. AI Service
```bash
cd ai-service
python -m venv venv
venv\Scripts\Activate.ps1   # Windows
pip install flask flask-cors opencv-python==4.10.0.84 requests python-dotenv
# Create a .env file with PORT
python app.py
```

### 3. Frontend
```bash
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## 🔐 Roles

- **Student** — registers via the Register page, takes proctored tests, views own test history
- **Instructor** — created manually (not publicly self-registerable), views all students' sessions and violation timelines

## 📊 Integrity Scoring Logic

| Violation | Severity | Score Deduction |
|---|---|---|
| No face detected (sustained) | Medium | -5 |
| Multiple faces detected (sustained) | High | -15 |
| Tab switch | Low | -2 |
| Window lost focus | Low | -2 |

## 📖 References

- Shih, Y.-S., et al., "AI-assisted Gaze Detection for Proctoring Online Exams," arXiv:2409.16923, 2024.
- "AI-Based Proctoring System for Online Tests," International Journal of Research Publication and Reviews, Vol. 6, Issue 4, 2025.
- "ProctorEdge: Advanced AI Examination Monitoring and Security System," Proceedings of INCOFT 2025.

## 👤 Author

**Arun Raut**
B.Tech Information Technology, Maharaja Surajmal Institute of Technology

---

*This project was built as a college minor project, demonstrating a full-stack, multi-service system combining computer vision, real-time monitoring, and role-based access control.*