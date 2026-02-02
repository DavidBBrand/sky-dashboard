import React, { useState, useEffect } from "react";
import * as satellite from "satellite.js";
import "./StarlinkGrid.css";

const StarlinkGrid = ({ lat, lon }) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [totalInOrbit, setTotalInOrbit] = useState(0);
  const [health, setHealth] = useState(99.4);
  const [loading, setLoading] = useState(true);
  const [cityName, setCityName] = useState("Scanning Location...");

  // 1. Reverse Geocoding Effect (Get City Name)
  useEffect(() => {
    const getLocalName = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
        );
        const data = await res.json();
        const city = data.address.city || data.address.town || data.address.village || data.address.suburb || "Ground Station";
        const state = data.address.state || "";
        setCityName(`${city}${state ? ", " + state : ""}`);
      } catch (e) {
        setCityName("Orbital Uplink Established");
      }
    };

    if (lat && lon) getLocalName();
  }, [lat, lon]);

  // 2. Orbital Calculation Effect
  useEffect(() => {
    let tles = [];

    const fetchData = async () => {
      try {
        const res = await fetch("https://celestrak.org/NORAD/elements/gp.php?GROUP=starlink&FORMAT=json");
        tles = await res.json();
        setTotalInOrbit(tles.length);
        setLoading(false);
      } catch (e) {
        console.error("Orbital Data Timeout", e);
      }
    };

    fetchData();

    const calculateVisible = () => {
      if (!tles.length || !lat || !lon) return;

      let count = 0;
      const now = new Date();
      
      const observerGd = {
        longitude: satellite.degreesToRadians(lon),
        latitude: satellite.degreesToRadians(lat),
        height: 0.1 
      };

      tles.forEach(sat => {
        try {
          const satrec = satellite.twoline2satrec(sat.TLE_LINE1, sat.TLE_LINE2);
          const positionAndVelocity = satellite.propagate(satrec, now);
          const positionEci = positionAndVelocity.position;
          
          if (positionEci) {
            const gmst = satellite.gstime(now);
            const lookAngles = satellite.ecfToLookAngles(
              satellite.eciToEcf(positionEci, gmst), 
              observerGd
            );
            
            if (lookAngles.elevation > 0) count++;
          }
        } catch (e) { /* Skip malformed TLEs */ }
      });

      setVisibleCount(count);
      setHealth(parseFloat((98 + Math.random() * 1.5).toFixed(1)));
    };

    const interval = setInterval(calculateVisible, 10000);
    return () => clearInterval(interval);
  }, [lat, lon]);

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
        LOCAL_NODES <span style={{ opacity: 0.5 }}>//</span> OVERHEAD
      </h2>

      <div className="sat-visual-grid">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="grid-node" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>

      <div className="stats-row">
        <div className="stat-group">
          <p className="stat-caption">VISIBLE NODES</p>
          <p className="stat-value">{loading ? "SCANNING" : visibleCount}</p>
        </div>
        <div className="stat-group">
          <p className="stat-caption">CONSTELLATION</p>
          <p className="stat-value">{totalInOrbit}</p>
        </div>
      </div>
      
      <div className="sector-tag-container" style={{ marginTop: "15px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "10px" }}>
        <p className="sector-tag" style={{ margin: 0, fontSize: "1.1rem" }}>
          {loading ? "INITIALIZING SGP4..." : `COORD: ${lat?.toFixed(2)}N / ${lon?.toFixed(2)}W`}
        </p>
        <p style={{ 
          fontSize: "0.8rem", 
          color: "var(--text-sub)", 
          textTransform: "uppercase", 
          letterSpacing: "1px", 
          marginTop: "4px" 
        }}>
          REGION: {cityName}
        </p>
      </div>
    </div>
  );
};

export default StarlinkGrid;