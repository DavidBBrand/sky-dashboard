import React from 'react';

// 1. Define the interface for the sun data coming from your Python backend
interface SolarTelemetry {
  current_altitude: number; // Degrees
  phase: string;            // "Golden Hour", "Blue Hour", etc.
}

interface CompassProps {
  sunData: SolarTelemetry;
}

const SolarCompass: React.FC<CompassProps> = ({ sunData }) => {
  const { current_altitude, phase } = sunData;
  
  // 2. Logic: Map altitude to a visual "height" inside a 100px container
  // 90 deg (Zenith) = top, 0 deg (Horizon) = middle, -90 deg = bottom
  const verticalPosition = 50 - (current_altitude / 90) * 50;

  // 3. Determine sun color based on your backend 'phase' logic
  const getSunColor = () => {
    if (phase === "Golden Hour") return "#ff9d00";
    if (phase === "Blue Hour") return "#5b86e5";
    if (current_altitude < 0) return "#2c3e50"; // Dim for night
    return "#ffce00"; // Standard day
  };

  return (
    <div className="solar-compass">
      <div className="horizon-line" />
      <div 
        className="sun-indicator"
        style={{ 
          top: `${verticalPosition}%`,
          backgroundColor: getSunColor(),
          boxShadow: current_altitude > 0 ? `0 0 15px ${getSunColor()}` : 'none'
        }}
      />
      <div className="altitude-label">{current_altitude.toFixed(1)}°</div>
    </div>
  );
};

export default SolarCompass;