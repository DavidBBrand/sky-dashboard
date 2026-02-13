import "./Weather.css";
import React, { useState, useEffect } from "react";

const Weather = ({ lat, lon, onDataReceived }) => {
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



  // ... (useEffect remains the same)

  const getWeatherIcon = (description) => {
    const desc = description.toLowerCase();

    // Check if current time is between sunrise and sunset
    // We use weather.sunrise/sunset if available, otherwise fall back to 6am/6pm
    const now = Math.floor(Date.now() / 1000);
    const isDaylight = weather 
      ? (now > weather.sunrise && now < weather.sunset)
      : (new Date().getHours() >= 6 && new Date().getHours() <= 18);

    // ONLY show SunBaby if it's "clear" AND it's currently daylight hours
    if (desc.includes("clear") && isDaylight) {
      return (
        <img
          src="/SunBaby.jpg"
          alt="Sun Baby"
          className="sun-baby-icon"
          style={{
            width: "1.1em",
            height: "1.1em",
            objectFit: "cover",
            borderRadius: "50%",
            verticalAlign: "middle",
            display: "block"
          }}
        />
      );
    }

    // If it's "clear" but NIGHT time, show the Moon
    if (desc.includes("clear") && !isDaylight) return "🌙";

    // Standard condition returns
    if (desc.includes("thunderstorm")) return "⛈️";
    if (desc.includes("drizzle") || desc.includes("rain")) return "🌧️";
    if (desc.includes("snow")) return "❄️";
    if (desc.includes("clouds")) {
      return (desc.includes("few") || desc.includes("scattered")) ? "🌤️" : "☁️";
    }
    return "🌡️";
  };

  // ... (rest of the component)
  // Determine placeholder based on time
  const isDaytime = new Date().getHours() >= 6 && new Date().getHours() <= 18;
  const placeholderIcon = isDaytime ? getWeatherIcon("clear") : "🌙";

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
