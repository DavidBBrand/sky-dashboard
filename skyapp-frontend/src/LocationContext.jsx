import React, { createContext, useState, useContext } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState({
    lat: 35.9251,
    lon: -86.8689,
    name: "Franklin, TN"
  });

  const updateLocation = (newLoc) => setLocation(newLoc);

  return (
    <LocationContext.Provider value={{ location, updateLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);