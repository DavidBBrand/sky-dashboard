import React, { memo } from "react"; 
import "./Planets.css";

const Planets = memo(({ skyData }) => { 
  if (!skyData) return null;

  const { sun, planets } = skyData;

  const planetIcons = {
    Mercury: "🌑",
    Venus: "🌕",
    Mars: "🔴",
    Jupiter: "🟠",
    Saturn: "🪐",
    Uranus: "💎",
    Neptune: "🔵"
  };

  const getPlanetSymbol = (name) => {
    const symbols = {
      Venus: "♀",
      Mars: "♂",
      Jupiter: "♃",
      Saturn: "♄",
      Mercury: "☿",
      Uranus: "♅",
      Neptune: "♆"
    };
    return symbols[name] || "•";
  };

  const getCompassDirection = (az) => {
    const azimuth = parseFloat(az);
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(azimuth / 45) % 8;
    return directions[index];
  };

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <h2 className="card-title">Planetary Telemetry</h2>
          <div className="planet-grid">
            {Object.entries(planets).map(([name, info]) => (
              <div key={name} className="planet-item">
                <div style={{ fontSize: "2.4rem", marginBottom: "2px" }}>
                  {planetIcons[name] || "✨"}
                </div>

                <div style={{ fontSize: "1rem", fontWeight: "400", color: "var(--text-main)" }}>
                  <span
                    className="glow-sub2"
                    style={{
                      fontSize: "1.8rem",
                      fontFamily: "serif",
                      fontWeight: "400"
                    }}
                  >
                    {getPlanetSymbol(name)}
                  </span>
                </div>
                
                <div
                  className="glow-sub2"
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: "400",
                    
                    color: "var(--text-main)"
                  }}
                >
                  {name}
                </div>

                <span className={`status-tag ${info.is_visible ? "status-visible" : "status-set"}`}>
                  {info.is_visible ? "Visible" : "Set"}
                </span>

                <div 
                  className="glow-sub2"
                  style={{
                    fontSize: "0.95rem", 
                    color: "var(--text-sub)",
                    marginTop: "8px",
                    opacity: 0.8
                  }}
                >
                  {getCompassDirection(info.azimuth)} at {info.azimuth}° Az
                </div>
                
                <div
                  className="glow-sub2"
                  style={{
                    fontSize: "0.95rem",
                    color: "var(--text-sub)",
                    opacity: 0.8
                  }}
                >
                  {info.altitude}° Alt
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default Planets;
