import React, { useState, memo } from "react";

// Using memo so typing in the search box doesn't get interrupted
// by other dashboard updates
const LocationSearch = memo(({ onLocationChange }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Inside LocationSearch.jsx
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);

    // 1. Create a controller for this specific search
    const controller = new AbortController();

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
        {
          signal: controller.signal,
          headers: {
            // 2. Identify yourself (Essential for CORS/Rate-limiting)
            "User-Agent": `SkyWatch/1.0 (${import.meta.env.VITE_NOMINATIM_EMAIL || "anonymous"})`
          }
        }
      );

      if (response.status === 425 || response.status === 429) {
        alert("Search is temporarily throttled. Please wait a few seconds.");
        return;
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        // Success logic...
        onLocationChange({
          lat: parseFloat(lat),
          lon: parseFloat(lon),
          name: display_name.split(",")[0]
        });
        setQuery("");
      } else {
        alert("Location not found.");
      }
    } catch (err) {
      if (err.name === "AbortError") {
        console.log("Search request cancelled.");
      } else {
        console.error("Search error:", err);
      }
    } finally {
      setLoading(false);
    }
  };
  // Keep the GPS function ready in case you want to add a "Find Me" button later!
  const useGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      onLocationChange({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        name: "Current Location"
      });
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%"
      }}
    >
      <form onSubmit={handleSearch} style={{ display: "flex" }}>
        <input
          type="text"
          placeholder={loading ? "LOCATING..." : "SEARCH CITY..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="theme-toggle-btn"
          disabled={loading}
          style={{
            width: "250px",
            textAlign: "center",
            outline: "none",
            fontSize: "0.8rem",
            letterSpacing: "1px",
            cursor: loading ? "wait" : "text",
            opacity: loading ? 0.7 : 1
          }}
        />
      </form>
    </div>
  );
});

export default LocationSearch;
