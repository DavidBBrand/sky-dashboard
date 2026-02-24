import React, { useState, memo } from "react";

// Using memo so typing in the search box doesn't get interrupted
// by other dashboard updates
const LocationSearch = memo(({ onLocationChange }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Inside LocationSearch.jsx
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim() || loading) return;

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

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Default fallback
        let finalName = "Current Location";

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                "User-Agent": `SkyWatch/1.0 (${import.meta.env.VITE_NOMINATIM_EMAIL || "anonymous"})`
              }
            }
          );

          if (response.ok) {
            const data = await response.json();
            const a = data.address;

            // This order ensures we get the most relevant "Place Name"
            finalName =
              a.city ||
              a.town ||
              a.village ||
              a.suburb ||
              a.city_district ||
              a.county ||
              "Detected Location";

            // Optional: If you want "City, State", do this:
            // if (a.state) finalName += `, ${a.state}`;
          }
        } catch (err) {
          console.error("Reverse Geocoding failed:", err);
        } finally {
          // This sends the full object to updateLocation in Context
          onLocationChange({
            lat: latitude,
            lon: longitude,
            name: finalName
          });
          setLoading(false);
        }
      },
      (error) => {
        setLoading(false);
        alert("Location access denied.");
      }
    );
  };
  return (
    <div className="search-wrapper">
      <form
        onSubmit={handleSearch}
        style={{ display: "flex", alignItems: "center", gap: "10px" }}
      >
        <input
          type="text"
          placeholder={loading ? "LOCATING..." : "SEARCH LOCATION..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input-field" // Updated class
          disabled={loading}
          style={{
            cursor: loading ? "wait" : "text",
            opacity: loading ? 0.7 : 1
          }}
        />

        <button
          type="button"
          onClick={useGPS}
          className="gps-action-btn" // Updated class
          disabled={loading}
          title="Use My Location"
        >
          <span style={{ fontSize: "1.1rem" }}>📍</span>
        </button>
      </form>
    </div>
  );
});

export default LocationSearch;
