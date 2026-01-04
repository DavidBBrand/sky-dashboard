import "./Weather.css";

import React, { useState, useEffect } from "react";

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/weather")
      .then((res) => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then((data) => {
        if (data.error) {
          setError(true);
        } else {
          setWeather(data);
        }
      })
      .catch((err) => {
        console.error(err);
        setError(true);
      });
  }, []);

  // 1. If there's an error, show this instead of crashing
  if (error)
    return <p style={{ color: "#ff4444" }}>Weather currently unavailable</p>;

  // 2. While waiting for Python, show nothing or a loader
  if (!weather) return <p style={{ color: "#555" }}>Loading sky data...</p>;

  // 3. Only if weather is NOT null, render the UI
  return (
    <div className="weather-card">
      <p
        style={{
          fontSize: "0.8rem",
          textTransform: "uppercase",
          letterSpacing: "2px",
          opacity: 0.8
        }}
      >
        Current Weather
      </p>
      <h2 style={{ fontSize: "3rem", margin: "10px 0" }}>{weather.temp}°</h2>
      <p style={{ fontSize: "1.1rem", fontWeight: "500" }}>
        {weather.description}
      </p>
      <div style={{ marginTop: "15px", fontSize: "0.9rem", opacity: 0.7 }}>
        Wind: {weather.windspeed} mph
      </div>
    </div>
  );
};

export default Weather;
