import React, { useState, memo } from 'react';

// Using memo so typing in the search box doesn't get interrupted 
// by other dashboard updates
const LocationSearch = memo(({ onLocationChange }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

const handleSearch = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation(); // Stop the event from bubbling up
    }
    
    if (!query || loading) return; // Prevent double-clicks or empty searches

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
        { headers: { 'User-Agent': 'SkyDashboard/1.0' } }
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const parts = display_name.split(',');
        const shortName = parts.length > 2 
          ? `${parts[0].trim()}, ${parts[parts.length - 3].trim()}, ${parts[parts.length - 1].trim()}`
          : display_name;

        // CRITICAL: Call this before clearing the query to ensure the update hits
        onLocationChange({
          lat: parseFloat(lat),
          lon: parseFloat(lon),
          name: shortName
        });
        
        setQuery(''); 
        // Blur the input to "reset" the focus state
        if (e && e.target) e.target.blur(); 
      } else {
        alert("Location not found.");
      }
    } catch (err) {
      console.error("Search error:", err);
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
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      width: '100%' 
    }}>
      <form onSubmit={handleSearch} style={{ display: 'flex' }}>
        <input
          type="text"
          placeholder={loading ? "LOCATING..." : "SEARCH CITY..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="theme-toggle-btn"
          disabled={loading}
          style={{
            width: '250px',
            textAlign: 'center',
            outline: 'none',
            fontSize: '0.8rem',
            letterSpacing: '1px',
            cursor: loading ? 'wait' : 'text',
            opacity: loading ? 0.7 : 1
          }}
        />
      </form>
    </div>
  );
});

export default LocationSearch;