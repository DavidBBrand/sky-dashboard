# 🌙 Sky Dashboard

A full-stack dashboard featuring real-time moon illumination tracking and local weather data.

## 🚀 Project Structure
- **/backend**: Python FastAPI server using `Skyfield` for astronomical calculations.
- **/moon-app**: React frontend built with Vite and Tailwind CSS.

## 🛠️ Setup Instructions

### 1. Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
python main.py