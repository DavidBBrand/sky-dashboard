import "./Weather.css";
import React, { useState, useEffect, useRef } from "react";

const Weather = ({ lat, lon, sun, onDataReceived }) => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(false);
  
  // Use a Ref to keep track of the function without triggering the Effect
  const onDataReceivedRef = useRef(onDataReceived);

  // Sync the ref whenever the prop changes
  useEffect(() => {
    onDataReceivedRef.current = onDataReceived;
  }, [onDataReceived]);

  useEffect(() => {
    let isMounted = true;
    setWeather(null);
    setError(false);

    console.log("Weather Fetching for:", lat, lon); // Debug log

    fetch(`http://127.0.0.1:8000/weather?lat=${lat}&lon=${lon}`)
      .then((res) => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then((weatherData) => {
        if (!isMounted) return;
        if (weatherData.error) {
          setError(true);
        } else {
          setWeather(weatherData);
          // Call the ref instead of the prop directly to stop the loop
          if (onDataReceivedRef.current) {
            onDataReceivedRef.current(weatherData);
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Weather Fetch Error:", err);
          setError(true);
        }
      });
      
    return () => { isMounted = false; };
    // DO NOT put onDataReceived in this array
  }, [lat, lon]);

  const getWeatherIcon = (description) => {
    if (!description) return "🌡️";
    const desc = description.toLowerCase();
    const now = new Date();
    const sunriseTime = sun?.sunrise ? new Date(sun.sunrise) : null;
    const sunsetTime = sun?.sunset ? new Date(sun.sunset) : null;

    let isDaylight = false;
    if (sunriseTime && sunsetTime) {
      isDaylight = now >= sunriseTime && now <= sunsetTime;
    } else {
      isDaylight = now.getHours() >= 6 && now.getHours() < 18;
    }

    if (desc.includes("clear")) return isDaylight ? "☀️" : "🌙";
    if (desc.includes("thunderstorm")) return "⛈️";
    if (desc.includes("drizzle") || desc.includes("rain")) return "🌧️";
    if (desc.includes("snow")) return "❄️";
    if (desc.includes("clouds")) {
      return desc.includes("few") || desc.includes("scattered") ? "🌤️" : "☁️";
    }
    return "🌡️";
  };

  if (error) return (
    <div className="glass-card" style={{ color: "#992323ff", padding: '20px' }}>
      Weather currently unavailable
    </div>
  );

  return (
    <div>
      <h2 style={{ fontSize: "1.2rem", textTransform: "uppercase", letterSpacing: "2px", color: "var(--text-main)", fontWeight: "500", margin: "20px 0 10px" }}>
        {weather ? "Current Weather" : "Live Weather"}
      </h2>

      <div className={!weather ? "weather-loading-pulse" : ""} style={{ fontSize: "6.0rem", margin: "20px" }}>
        {weather ? getWeatherIcon(weather.description) : (new Date().getHours() >= 6 && new Date().getHours() < 18 ? "☀️" : "🌙")}
      </div>

      <h4 style={{ fontSize: "1.8rem", fontWeight: "400", margin: "10px" }}>
        {weather ? `${Math.round(weather.temp)}°F` : "--°F"}
      </h4>
      
      <p style={{ fontSize: "1.1rem", color: "var(--text-sub)", margin: "5px 0", textTransform: 'capitalize' }}>
        {weather ? weather.description : "Synchronizing..."}
      </p>

      {/* Atmospheric Telemetry Grid - Only show if weather exists */}
      {weather && (
        <div className="weather-details-grid" style={{ marginTop: '20px', width: '100%',color: "var(--text-sub)", borderTop: '1px solid var(--card-border)', paddingTop: '15px' }}>
          <div className="detail-item">
            <span className="label">Humidity: </span>
            <span className="value">{weather.humidity}%</span>
          </div>
          <div className="detail-item">
            <span className="label">Pressure: </span>
            <span className="value">{weather.pressure} hPa</span>
          </div>
          <div className="detail-item">
            <span className="label">Visibility: </span>
            <span className="value">{(weather.visibility / 1000).toFixed(1)} km</span>
          </div>
          <div className="detail-item">
            <span className="label">Wind Speed: </span>
            <span className="value">{weather.windspeed} mph</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
