import React from "react";

const SolarCycle = ({ sun }) => {
  // Guard clause in case data hasn't loaded yet
  if (!sun) return null;

  // Helper to format the ISO string from Skyfield/Python
  const formatTime = (isoString) => {
    if (!isoString) return "--:--";
    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="solar-cycle-container">
      <h3
        className="rainbow-warm"
        style={{
          fontSize: "1.2rem",
          textTransform: "uppercase",
          letterSpacing: "4px",
          marginBottom: "10px"
        }}
      >
        Solar Cycle
      </h3>
      
      <div style={{ display: "flex", gap: "10px" }}>
        {/* Sunrise Section */}
        <div className="planet-item" style={{ flex: 1 }}>
          <span style={{ fontSize: "2.0rem" }}>🌅</span>
          <p
            style={{
              fontSize: "0.8rem",
              margin: "5px 0 0 0",
              fontWeight: "500",
              color: "var(--text-main)"
            }}
          >
            {formatTime(sun.sunrise)}
          </p>
          <p
            style={{
              fontSize: "0.8rem",
              color: "var(--text-sub)",
              margin: 0
            }}
          >
            SUNRISE
          </p>
        </div>

        {/* Sunset Section */}
        <div className="planet-item" style={{ flex: 1 }}>
          <span style={{ fontSize: "2.0rem" }}>🌇</span>
          <p
            style={{
              fontSize: "0.8rem",
              margin: "5px 0 0 0",
              fontWeight: "500",
              color: "var(--text-main)"
            }}
          >
            {formatTime(sun.sunset)}
          </p>
          <p
            style={{
              fontSize: "0.8rem",
              color: "var(--text-sub)",
              margin: 0
            }}
          >
            SUNSET
          </p>
        </div>
      </div>
    </div>
  );
};

export default SolarCycle;