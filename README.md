# 🌙 Sky Watch Telemetry Dashboard

A high-precision, observatory-style dashboard featuring real-time astronomical tracking and local weather synchronization.

## 🚀 Getting Started

Better yet, visit: [skywatchdash.com](https://www.skywatchdash.com)

To run this application locally, you will need **two terminal windows** open (Node.js and Python 3.8+ required).

### Frontend Setup (React + Vite)
```bash
cd skyapp-frontend
npm install
npm run dev

## BACKEND SETUP
## open your second terminal

cd backend
python -m venv venv


## activate virtual environment on Windows:

.\venv\Scripts\activate

## On Mac/Linux:
source venv/bin/activate

## Install libraries and dependencies

pip install -r requirements.txt

## Launch Uvicorn ASGI server

uvicorn main:app --reload
```
## 🛰️ System Architecture

```mermaid
graph TD
    subgraph Frontend [React Frontend - Vite]
        UI[App.jsx / Dashboard UI]
        LC[LocationContext - GPS/Address]
        TC[ThemeContext - Night/Day Mode]
        Map[Leaflet - Star/ISS Map]
    end

    subgraph Backend [FastAPI - Python]
        API[Main API Endpoints]
        SF[Skyfield - Ephemeris Engine]
        Redis[(Redis Cache)]
    end

    subgraph External [External Data]
        NASA[NASA JPL/DE421 Data]
        ReverseGeo[Reverse Geocoding API]
    end

    %% Interactions
    LC -->|Lat/Lon| UI
    UI -->|GET /sky-summary| API
    API -->|Check Cache| Redis
    Redis -->|Miss| SF
    SF -->|Orbital Math| NASA
    SF -->|Result| API
    API -->|JSON Data| UI
    UI -->|Render Planets/Moon| Map
```

## ⏱️ Timing Diagram

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant FastAPI
    participant Redis
    participant NASA

    User->>Browser: Opens Sky Watch
    Browser->>Browser: Get GPS Coord
    Browser->>FastAPI: GET /sky-summary?lat=xx&lon=yy
    FastAPI->>Redis: Check Cache
    alt Cache Hit
        Redis-->>FastAPI: Return Cached Data
    else Cache Miss
        FastAPI->>NASA: Fetch Ephemeris (DE421)
        NASA-->>FastAPI: Planetary Vectors
        FastAPI->>Redis: Store Result (24h)
    end
    FastAPI-->>Browser: JSON Payload
    Browser->>User: Render HUD & Star Map
```
