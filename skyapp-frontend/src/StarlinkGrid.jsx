import React, { useState, useEffect } from "react";
import "./StarlinkGrid.css";

// Added props to match your other components
const StarlinkGrid = ({ lat, lon }) => {
  const [satCount, setSatCount] = useState(42); 
  const [health, setHealth] = useState(98.4);

  useEffect(() => {
    const interval = setInterval(() => {
      // Logic: If we have a location, simulate a slight flux in "visible" satellites
      setSatCount(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const newVal = prev + change;
        return newVal < 20 ? 20 : newVal > 60 ? 60 : newVal; // Keep it realistic
      });
      setHealth(prev => parseFloat((98 + Math.random()).toFixed(1)));
    }, 4000);
    return () => clearInterval(interval);
  }, [lat, lon]); // Re-sync if location changes

  return (
    <div className="glass-card starlink-card">
      <div className="card-header">
        <svg 
          className="iss-favicon" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          {/* Satellite Constellation Icon */}
          <circle cx="12" cy="12" r="2" />
          <path d="M12 3L12 5M12 19L12 21M3 12L5 12M19 12L21 12M5.6 5.6L7 7M17 17L18.4 18.4M18.4 5.6L17 7M7 17L5.6 18.4" stroke="currentColor" strokeWidth="2" />
        </svg>
        <p className="orbital-label">STARLINK MESH NETWORK</p>
      </div>

      <h2 style={{ margin: "15px 0 5px 0", fontSize: "1.4rem", letterSpacing: "1px" }}>
        ORBITAL_NODES <span style={{ opacity: 0.5 }}>//</span> SL-MESH
      </h2>

      <div className="sat-visual-grid">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            className="grid-node" 
            style={{ 
              animationDelay: `${i * 0.15}s`,
              backgroundColor: health > 98.8 ? "var(--accent-color)" : "" 
            }} 
          />
        ))}
      </div>

      <div className="stats-row">
        <div className="stat-group">
          <p className="stat-caption">ACTIVE NODES</p>
          <p className="stat-value">{satCount}</p>
        </div>
        <div className="stat-group">
          <p className="stat-caption">LINK HEALTH</p>
          <p className="stat-value">{health}%</p>
        </div>
      </div>
      
      <p className="sector-tag">COORD: {lat?.toFixed(1)}° / {lon?.toFixed(1)}°</p>
    </div>
  );
};

export default StarlinkGrid;