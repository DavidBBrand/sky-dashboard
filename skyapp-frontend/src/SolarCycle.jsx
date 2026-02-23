import React, { memo } from "react"; // Added memo
import "./SolarCycle.css";

const SolarCycle = memo(({ sun, date }) => { // Wrapped in memo
  if (!sun) return null;

  const formatTime = (isoString) => {
    if (!isoString) return "--:--";
    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="solar-cycle-container">
      <h4 className="glow-sub">Solar Cycle for <div className="card-title">{date}</div></h4> 
      
      <div className="solar-flex">
        {/* Sunrise Section */}
        <div className="planet-item" style={{ flex: 1 }}>
          <span style={{ fontSize: "4.0rem" }} role="img" aria-label="sunrise">🌅</span>
          <p className="solar-time">{formatTime(sun.sunrise)}</p>
          <p className="solar-label glow-sub">SUNRISE</p>
        </div>

        {/* Sunset Section */}
        <div className="planet-item" style={{ flex: 1 }}>
          <span style={{ fontSize: "4.0rem" }} role="img" aria-label="sunset">🌇</span>
          <p className="solar-time">{formatTime(sun.sunset)}</p>
          <p className="solar-label glow-sub">SUNSET</p>
        </div>
      </div>
    </div>
  );
});

export default SolarCycle;