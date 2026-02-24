import { useState, useEffect } from "react";
// ADD THIS IMPORT BELOW:
import { useLocation } from "./LocationContext.jsx";

import "./App.css";
import Weather from "./Weather.jsx";
import Planets from "./Planets.jsx";
import LocationSearch from "./LocationSearch.jsx";
import GoldenHour from "./GoldenHour.jsx";
import MapCard from "./MapCard.jsx";
import ISSWatcher from "./ISSWatcher.jsx";
import Starlink from "./Starlink.jsx";
import Moon from "./Moon.jsx";

function App() {
  const { location, updateLocation } = useLocation(); // Now this will work!

  const [isNight, setIsNight] = useState(true);
  const [skyData, setSkyData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [issDistance, setIssDistance] = useState(null);
  const [locationDate, setLocationDate] = useState("");

  const getLocalSolarTime = () => {
    if (!location) return "--:--";
    const now = new Date();
    const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60;
    const solarOffset = location.lon / 15;
    let localSolarHours = (utcHours + solarOffset + 24) % 24;
    const h = Math.floor(localSolarHours);
    const m = Math.floor((localSolarHours - h) * 60);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  const getLiveLocalTime = () => {
    if (!weatherData || !weatherData.utc_offset) return "--:--";
    const now = new Date();
    const utcTimestamp = now.getTime() + now.getTimezoneOffset() * 60000;
    const remoteTime = new Date(utcTimestamp + weatherData.utc_offset * 1000);
    return remoteTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  // Sync Date with Timezone
  useEffect(() => {
    const targetTimeZone = weatherData?.timezone || "America/Chicago";
    try {
      const dateString = new Date()
        .toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          timeZone: targetTimeZone
        })
        .replace(/(\w+)/, "$1.");
      setLocationDate(dateString);
    } catch (e) {
      console.error("Timezone Error:", e);
    }
  }, [location.lat, location.lon, weatherData?.timezone]);

  // Theme Sync
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isNight ? "night" : "day"
    );
  }, [isNight]);

  // Global Sky Data Fetch
  useEffect(() => {
    // 1. Create the controller
    const controller = new AbortController();

    const fetchSkyData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/sky-summary?lat=${location.lat}&lon=${location.lon}`,
          { signal: controller.signal } // 2. Attach the signal to the fetch
        );
        const data = await response.json();
        setSkyData(data);
      } catch (err) {
        // 3. Ignore errors caused by our intentional abort
        if (err.name === "AbortError") {
          console.log(
            "Fetch aborted: New request started or component unmounted"
          );
        } else {
          console.error("FETCH ERROR:", err);
        }
      }
    };

    setSkyData(null);
    fetchSkyData();

    const skyInterval = setInterval(fetchSkyData, 120000);

    return () => {
      // 4. Cancel the fetch if the component re-renders or unmounts
      controller.abort();
      clearInterval(skyInterval);
    };
  }, [location.lat, location.lon]);

  return (
    <div className="app-container">
      <button onClick={() => setIsNight(!isNight)} className="theme-toggle-btn">
        {isNight ? "🌙 Night Mode" : "☀️ Day Mode"}
      </button>

      <header className="header-section">
        <h1 className="main-title">SKY WATCH</h1>
        <div
          className="logo-container"
          role="img"
          aria-label="Sky Dashboard Logo"
        />

        <div className="search-wrapper">
          <LocationSearch onLocationChange={updateLocation} />
        </div>

        <div className="telemetry-info">
          <span>{location.name}</span>
          <span>
            {Math.abs(location.lat).toFixed(2)}°{location.lat >= 0 ? "N" : "S"}{" "}
            / {Math.abs(location.lon).toFixed(2)}°
            {location.lon >= 0 ? "E" : "W"}
          </span>
          <span className="time-display">
            Solar Time: {getLocalSolarTime()}
          </span>
          <span>
            UTC OFFSET: {location.lon >= 0 ? "+" : ""}
            {(location.lon / 15).toFixed(1)} HRS
          </span>
          <span className="time-display">
            LOCAL TIME: {weatherData ? getLiveLocalTime() : "--:--"}
          </span>
          {skyData?.sun?.phase && <GoldenHour sunData={skyData.sun} />}
        </div>
      </header>

      <div className="dashboard-grid">
        <div className="glass-card">
          <Moon date={locationDate} />
        </div>
        <div className="glass-card">
          <Weather
            onDataReceived={setWeatherData}
            sun={skyData?.sun}
            theme={isNight ? "night" : "day"}
          />
        </div>
        <div
          className={`glass-card ${issDistance < 500 ? "proximity-alert-active" : ""}`}
        >
          <ISSWatcher onDistanceUpdate={setIssDistance} />
        </div>
        <div className="glass-card">
          <Starlink />
        </div>
        <div className="glass-card">
          <MapCard
            theme={isNight ? "night" : "day"}
            skyData={skyData}
            date={locationDate}
          />
        </div>
        <div className="glass-card">
          {skyData ? (
            <Planets skyData={skyData} />
          ) : (
            <div className="loading-card">
              <p>Synchronizing with {location.name}...</p>
            </div>
          )}
        </div>
      </div>
      <p className="copyright">Copyright © 2026 David Brand</p>
    </div>
  );
}

export default App;
