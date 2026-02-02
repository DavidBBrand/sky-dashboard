import React, { useState, useEffect } from "react";
import "./StarlinkGrid.css";

const StarlinkGrid = ({ lat, lon }) => {
  const [satCount, setSatCount] = useState(0); 
  const [health, setHealth] = useState(99.1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStarlink = async () => {
      try {
        // Fetching the General Perturbations data for the Starlink group
        const res = await fetch(
          "https://celestrak.org/NORAD/elements/gp.php?GROUP=starlink&FORMAT=json"
        );
        const data = await res.json();
        
        // setSatCount(data.length); // Total active satellites in orbit
        
        // Simulation logic: Total satellites is data.length, 
        // but we simulate 'visible' nodes as a fraction of that.
        const totalInOrbit = data.length;
        setSatCount(Math.floor(totalInOrbit / 100) + Math.floor(Math.random() * 10));
        
        setLoading(false);
      } catch (e) {
        console.error("Starlink API Offline", e);
        setSatCount(6000); // Fallback to estimated total
        setLoading(false);
      }
    };

    fetchStarlink();
    
    // Refresh the "Health" jitter every 5 seconds
    const interval = setInterval(() => {
      setHealth(prev => parseFloat((98 + Math.random() * 1.8).toFixed(1)));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card starlink-card">
      <div className="card-header">
        <svg className="iss-favicon" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="2" />
          <path d="M12 3L12 5M12 19L12 21M3 12L5 12M19 12L21 12M5.6 5.6L7 7M17 17L18.4 18.4M18.4 5.6L17 7M7 17L5.6 18.4" stroke="currentColor" strokeWidth="2" />
        </svg>
        <p className="orbital-label">STARLINK MESH NETWORK</p>
      </div>

      <h2 style={{ margin: "15px 0 5px 0", fontSize: "1.4rem", letterSpacing: "1px" }}>
        ORBITAL_NODES <span style={{ opacity: 0.5 }}>//</span> SL-LIVE
      </h2>

      <div className="sat-visual-grid">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            className="grid-node" 
            style={{ 
              animationDelay: `${i * 0.15}s`,
              backgroundColor: !loading && health > 99 ? "var(--accent-color)" : "" 
            }} 
          />
        ))}
      </div>

      <div className="stats-row">
        <div className="stat-group">
          <p className="stat-caption">LOCAL NODES</p>
          <p className="stat-value">{loading ? "..." : satCount}</p>
        </div>
        <div className="stat-group">
          <p className="stat-caption">LINK HEALTH</p>
          <p className="stat-value">{health}%</p>
        </div>
      </div>
      
      <p className="sector-tag">
        {loading ? "SYNCHRONIZING..." : `ACTIVE CONSTELLATION MESH // ${lat?.toFixed(2)}N`}
      </p>
    </div>
  );
};

export default StarlinkGrid;