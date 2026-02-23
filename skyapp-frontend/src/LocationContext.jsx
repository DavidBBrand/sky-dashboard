import React, { createContext, useState, useContext } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [coords, setCoords] = useState({ lat: 35.0456, lon: -85.3097 }); // Default: Chattanooga
  const [city, setCity] = useState("Chattanooga, TN");

  const updateLocation = (newLat, newLon, newCity) => {
    setCoords({ lat: newLat, lon: newLon });
    setCity(newCity);
  };

  return (
    <LocationContext.Provider value={{ coords, city, updateLocation }}>
      {children}
    </LocationContext.Provider>
  );
};


export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};