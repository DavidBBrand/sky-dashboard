import React, { memo } from "react"; 
import "./SolarCycle.css";

const SolarCycle = memo(({ sun, date }) => { 
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
      <div className="solar-flex">
        
        <div className="planet-item" style={{ flex: 1 }}>
          <span style={{ fontSize: "6.0rem" }} role="img" aria-label="sunrise">🌅</span>
          <p className="solar-time">{formatTime(sun.sunrise)}</p>
          <p className="solar-label glow-sub">SUNRISE</p>
        </div>      
        <div className="planet-item" style={{ flex: 1 }}>
          <span style={{ fontSize: "6.0rem" }} role="img" aria-label="sunset">🌇</span>
          <p className="solar-time">{formatTime(sun.sunset)}</p>
          <p className="solar-label glow-sub">SUNSET</p>
        </div>
      </div>
    </div>
  );
});

export default SolarCycle;