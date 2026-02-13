import "./Weather.css";
import React, { useState, useEffect } from "react";

const Weather = ({ lat, lon, sun, onDataReceived }) => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setWeather(null);
    setError(false);

    fetch(`http://127.0.0.1:8000/weather?lat=${lat}&lon=${lon}`)
      .then((res) => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then((data) => {
        if (data.error) {
          setError(true);
        } else {
          setWeather(data);
          if (onDataReceived) {
            onDataReceived(data);
          }
        }
      })
      .catch((err) => {
        console.error(err);
        setError(true);
      });
  }, [lat, lon, onDataReceived]);

  const getWeatherIcon = (description) => {
    if (!description) return "🌡️";
    const desc = description.toLowerCase();

    // 1. Get current time
    const now = new Date();

    // 2. Use the exact sunrise/sunset times from your sun data
    // We convert them to Date objects so we can compare them easily
    const sunriseTime = sun?.sunrise ? new Date(sun.sunrise) : null;
    const sunsetTime = sun?.sunset ? new Date(sun.sunset) : null;

    // 3. Logic: If we have sun data, compare 'now' to sunrise/sunset.
    // Otherwise, fallback to 6am-6pm.
    let isDaylight = false;
    if (sunriseTime && sunsetTime) {
      isDaylight = now >= sunriseTime && now <= sunsetTime;
    } else {
      isDaylight = now.getHours() >= 6 && now.getHours() < 18;
    }

    // 4. Return the correct icon
    if (desc.includes("clear")) {
      return isDaylight ? "☀️" : "🌙";
    }

    if (desc.includes("thunderstorm")) return "⛈️";
    if (desc.includes("drizzle") || desc.includes("rain")) return "🌧️";
    if (desc.includes("snow")) return "❄️";
    if (desc.includes("clouds")) {
      return desc.includes("few") || desc.includes("scattered") ? "🌤️" : "☁️";
    }
    return "🌡️";
  };

  // Update your placeholder as well
  const isCurrentlyDay =
    new Date().getHours() >= 6 && new Date().getHours() < 18;
  const placeholderIcon = isCurrentlyDay ? "☀️" : "🌙";

  // ... (useEffect remains the same)

  if (error)
    return (
      <div className="weather-card" style={{ color: "#992323ff" }}>
        Weather currently unavailable
      </div>
    );

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h2
        style={{
          fontSize: "1.2rem",
          textTransform: "uppercase",
          letterSpacing: "2px",
          color: "var(--text-main)",
          fontWeight: "500",
          margin: "20px 0 10px"
        }}
      >
        {weather ? "Current Weather" : "Live Weather"}
      </h2>

      <div
        className={!weather ? "weather-loading-pulse" : ""}
        style={{
          fontSize: "6rem",
          lineHeight: "1",
          margin: "20px 10px 10px 10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {/* Render the icon or the placeholder */}
        {weather ? getWeatherIcon(weather.description) : placeholderIcon}
      </div>

      <h4 style={{ fontSize: "1.8rem", fontWeight: "400", margin: "16px" }}>
        {weather ? `${weather.temp}°F` : "--°F"}
      </h4>
      <p
        style={{
          fontSize: "1.2rem",
          fontWeight: "500",
          color: "var(--text-sub)",
          margin: "5px 0"
        }}
      >
        {weather ? weather.description : "Synchronizing..."}
      </p>

      <div
        style={{
          marginTop: "1.0rem",
          fontSize: "1.2rem",
          color: "var(--text-sub)",
          fontWeight: "500"
        }}
      >
        Wind: {weather ? `${weather.windspeed} mph` : "-- mph"}
      </div>
    </div>
  );
};

export default Weather;
