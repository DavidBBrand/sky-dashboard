import React, { createContext, useState, useContext, useEffect } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState({
    lat: 35.9251,
    lon: -86.8689,
    name: "Franklin, TN",
    timezone: "America/Chicago" 
  });

  // Helper to fetch timezone from coordinates
  const fetchTimezone = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://timeapi.io/api/Timezone/coordinate?latitude=${lat}&longitude=${lon}`
      );
      const data = await response.json();
      return data.timeZone; 
    } catch (error) {
      console.error("Timezone fetch failed:", error);
      return Intl.DateTimeFormat().resolvedOptions().timeZone; 
    }
  };

  const updateLocation = async (newLoc) => {
    const tz = await fetchTimezone(newLoc.lat, newLoc.lon);
    setLocation({ ...newLoc, timezone: tz });
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            const geoRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const geoData = await geoRes.json();
            
            const tz = await fetchTimezone(latitude, longitude);

            const cityName = geoData.address.city || geoData.address.town || geoData.address.village || "Unknown Location";
            const stateName = geoData.address.state || geoData.address.country || "";

            setLocation({
              lat: latitude,
              lon: longitude,
              name: `${cityName}${stateName ? ', ' + stateName : ''}`,
              timezone: tz
            });
          } catch (error) {
            console.error("Location initialization failed:", error);
          }
        },
        // --- FIX: Added the mandatory error callback function here ---
        (error) => {
          console.warn("Geolocation access denied or failed:", error.message);
        },
        // --- The options object is now correctly the 3rd parameter ---
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);

  return (
    <LocationContext.Provider value={{ location, updateLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);