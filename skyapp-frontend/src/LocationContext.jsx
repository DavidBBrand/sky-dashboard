import React, { createContext, useState, useContext, useEffect } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState({
    lat: 35.9251,
    lon: -86.8689,
    name: "Franklin, TN" // Default Fallback
  });

  const updateLocation = (newLoc) => setLocation(newLoc);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Reverse Geocode to get the City Name
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            
            // Extract city/town and state/country
            const cityName = data.address.city || data.address.town || data.address.village || "Unknown Location";
            const stateName = data.address.state || data.address.country || "";

            setLocation({
              lat: latitude,
              lon: longitude,
              name: `${cityName}${stateName ? ', ' + stateName : ''}`
            });
          } catch (error) {
            console.error("Reverse Geocoding failed:", error);
            // Fallback to coordinates as name if API fails
            setLocation({
              lat: latitude,
              lon: longitude,
              name: "My Location"
            });
          }
        },
        (error) => {
          console.warn("Location access denied. Using default (Franklin, TN).");
        },
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