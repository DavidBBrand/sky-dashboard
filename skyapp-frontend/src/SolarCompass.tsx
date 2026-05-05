import React from 'react';
import "./SolarCompass.css";

interface SolarTelemetry {
  current_altitude: number;
  phase: string;
}

interface CompassProps {
  sunData: SolarTelemetry;
}

const SolarCompass: React.FC<CompassProps> = ({ sunData }) => {
  const { current_altitude, phase } = sunData;
  
  // Constrain the visual to the container (5% to 95%) so the sun doesn't clip at peak/nadir
  const verticalPosition = 50 - (current_altitude / 90) * 45;

  const getSunColor = () => {
    if (phase === "Golden Hour") return "#ff9d00";
    if (phase === "Blue Hour") return "#5b86e5";
    if (current_altitude < 0) return "#2c3e50";
    return "#ffce00";
  };

  return (
    <div className="solar-compass-wrapper">
      {/* Visual Gauge Area */}
      <div className="solar-gauge-track">
        <div className="horizon-line" />
        <div 
          className="sun-indicator"
          style={{ 
            top: `${verticalPosition}%`,
            backgroundColor: getSunColor(),
            boxShadow: current_altitude > 0 ? `0 0 15px ${getSunColor()}` : 'none'
          }}
        />
      </div>

      {/* Dedicated Label Area - Now safely separated */}
      <div className="altitude-readout">
        <span className="altitude-value">{current_altitude.toFixed(1)}°</span>
      </div>
    </div>
  );
};

export default SolarCompass;