import React, { memo } from "react";
import "./SolarCycle.css";
import SolarCompass from "./SolarCompass";

const SolarCycle = memo(({ sun, timezone }) => {
  const formatTime = (isoString) => {
    if (!isoString || !sun) return "--:--";

    try {
      return new Date(isoString).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        // Fallback to UTC if timezone is missing to prevent crashing
        timeZone: timezone || "UTC"
      });
    } catch (error) {
      console.warn("Invalid timezone provided to SolarCycle:", timezone);
      // Final fallback to system time so the app doesn't die
      return new Date(isoString).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
    }
  };

  if (!sun) return null;

  return (
    <div className="solar-cycle-container">
      <div className="solar-flex">
        <div className="solar-item" style={{ flex: 1 }}>
          <div className=" card-title ">Sunrise</div>
          <span style={{ fontSize: "3.0rem" }} role="img" aria-label="sunrise">
            🌅
          </span>
          <div className="solar-time">{formatTime(sun.sunrise)}</div>
        </div>
        {/* MIDDLE: Live Altitude & Zenith Time */}
        {/* MIDDLE: Live Altitude & Zenith Telemetry */}
        <div className="solar-item" style={{ flex: 1 }}>
          <div className="glow-sub">Solar Altitude</div>
          <SolarCompass sunData={sun} />

          <div className="zenith-container" style={{ marginTop: "10px" }}>
            <div
              className="zenith-label sub-title"
            >
              Zenith
            </div>

            <div
              className="zenith-time"
              style={{
                fontSize: "1.4rem",
                color: "var(--accent-color2)",
                fontWeight: "bold"
              }}
            >
              {formatTime(sun.zenith)}
            </div>

            <div
              className="zenith-coords"
              style={{ fontSize: "1.0rem", marginTop: "8px" }}
            >
              <span style={{ color: "var(--accent-color2)" }}>
                <div className="zenith-label sub-title">Peak</div> {sun.zenith_alt}°
              </span>
              <span style={{ margin: "0 10px", opacity: 0.3 }}></span>
              <span style={{ color: "var(--accent-color2)" }}>
                <div className="zenith-label sub-title">Az</div> {sun.zenith_az}°
              </span>
            </div>
          </div>
        </div>
        <div className="solar-item" style={{ flex: 1 }}>
          <div className="card-title">Sunset</div>
          <span style={{ fontSize: "3.0rem" }} role="img" aria-label="sunset">
            🌇
          </span>
          <div className="solar-time">{formatTime(sun.sunset)}</div>
        </div>
      </div>
    </div>
  );
});

export default SolarCycle;
