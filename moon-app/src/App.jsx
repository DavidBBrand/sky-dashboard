import { useState, useEffect } from "react"; // Added useEffect
import "./App.css";
import MoonTracker from "./MoonTracker.jsx";
import Weather from "./Weather.jsx";
import SkyDetails from "./SkyDetails.jsx";

function App() {
  const [skyData, setSkyData] = useState(null);

  useEffect(() => {
    console.log("Attempting to fetch sky data..."); // DEBUG
    fetch("http://127.0.0.1:8000/sky-summary")
      .then((response) => {
        console.log("Response received:", response.status); // DEBUG
        return response.json();
      })
      .then((data) => {
        console.log("Sky Data state being set to:", data); // DEBUG
        setSkyData(data);
      })
      .catch((err) => console.error("FETCH ERROR:", err));
  }, []);

  return (
    <div
      style={{
        display: "flexbox",
        flexDirection: "row",
        alignItems: "stretch", // Makes all cards the same height
        justifyContent: "center",
        gap: "20px",
        flexWrap: "nowrap", // CRITICAL: Prevents stacking on mobile
        width: "100%", // Takes up full width
        maxWidth: "1200px", // Keeps it from getting TOO wide on giant monitors
        overflowX: "auto", // Adds a scrollbar ONLY if the screen is tiny
        paddingBottom: "10px" // Space for the scrollbar if it appears
      }}
    >
      <h1
        style={{
          color: "#5a5242ff",
          marginBottom: "10px",
          fontWeight: "200",
          letterSpacing: "3px",
          textAlign: "center",
          width: "80%",
          fontSize: "2.5rem",
          fontFamily: "sans-serif",
          textShadow: "0 0 10px rgba(255, 255, 255, 0.2)",
          marginTop: "20px",
          userSelect: "none", // prevent text selection
          textTransform: "uppercase",
          textShadow: "0 0 10px rgba(255, 255, 255, 0.3)"
        }}
      >
        SKY DASHBOARD
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "start", // Changed to start so they align at the top
          justifyContent: "center",
          gap: "50px",
          flexWrap: "wrap",
          fontStyle: "italic",
          padding: "20px",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          borderRadius: "20px",
          boxShadow: "0 0 20px rgba(169, 107, 66, 0.36)"
        }}
      >
        <MoonTracker />
        <Weather />

        {/* 3. Only show SkyDetails once the data has loaded */}
        {/* {skyData && <SkyDetails skyData={skyData} />} */}
        {/* Replace the SkyDetails line with this temporarily */}
        {skyData ? (
          <SkyDetails skyData={skyData} />
        ) : (
          <div
            style={{
              color: "white",
              padding: "10px",
              background: "#333",
              borderRadius: "10px"
            }}
          >
            Connecting to Sky Station...
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
