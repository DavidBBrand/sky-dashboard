import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";

// 1. Define the strict shape of your location data
export interface LocationState {
  lat: number | null;
  lon: number | null;
  name: string;
  timezone: string | null;
  isInitial: boolean;
}

// 2. Define what the context exposes to the rest of the app
interface LocationContextType {
  location: LocationState;
  updateLocation: (newLoc: Pick<LocationState, "lat" | "lon" | "name">) => Promise<void>;
}

// 3. Initialize with undefined (Standard TS pattern for Context)
const LocationContext = createContext<LocationContextType | undefined>(undefined);

// 4. Type the Provider props
interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [location, setLocation] = useState<LocationState>({
    lat: null,
    lon: null,
    name: "Locating...",
    timezone: null,
    isInitial: true,
  });

  // Helper to fetch timezone from coordinates
  const fetchTimezone = async (lat: number, lon: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://timeapi.io/api/Timezone/coordinate?latitude=${lat}&longitude=${lon}`
      );
      
      const data = await response.json();
      return data.timeZone || "UTC";
    } catch (error) {
      console.error("Timezone fetch failed:", error);
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
  };

  // Enforce that updates must at least provide lat, lon, and name
  const updateLocation = async (newLoc: Pick<LocationState, "lat" | "lon" | "name">) => {
    if (newLoc.lat === null || newLoc.lon === null) return;

    const tz = await fetchTimezone(newLoc.lat, newLoc.lon);
    
    setLocation({
      ...newLoc,
      timezone: tz,
      isInitial: false,
    });
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const [geoRes, tz] = await Promise.all([
              fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              ),
              fetchTimezone(latitude, longitude),
            ]);

            const geoData = await geoRes.json();
            
            const cityName =
              geoData.address.city ||
              geoData.address.town ||
              geoData.address.village ||
              "Current Location";
              
            const stateName = geoData.address.state || geoData.address.country || "";

            setLocation({
              lat: latitude,
              lon: longitude,
              name: `${cityName}${stateName ? ", " + stateName : ""}`,
              timezone: tz,
              isInitial: true, 
            });
          } catch (error) {
            console.error("Location initialization failed:", error);
            setLocation((prev) => ({ ...prev, isInitial: false })); 
          }
        },
        (error) => {
          console.warn("Geolocation denied. Reverting to Default Telemetry.");
          setLocation({
            lat: 35.9251,
            lon: -86.8689,
            name: "Franklin, TN",
            timezone: "America/Chicago",
            isInitial: true, 
          });
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setLocation((prev) => ({ ...prev, isInitial: false }));
    }
  }, []);

  return (
    <LocationContext.Provider value={{ location, updateLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

// 5. Add a safety guard to the custom hook
export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  
  return context;
};


// legacy jsx logic:

// import React, { createContext, useState, useContext, useEffect } from "react";

// const LocationContext = createContext();

// export const LocationProvider = ({ children }) => {
//   const [location, setLocation] = useState({
//     lat: null,
//     lon: null,
//     name: "Locating...",
//     timezone: null,
//     isInitial: true
//   });
//   // Helper to fetch timezone from coordinates
//   const fetchTimezone = async (lat, lon) => {
//     try {
//       const response = await fetch(
//         `https://timeapi.io/api/Timezone/coordinate?latitude=${lat}&longitude=${lon}`
//       );
      
//       const data = await response.json();
//       // console.log("Timezone API Response:", data); // Debug log to inspect the structure
//       return data.timeZone || "UTC";
//     } catch (error) {
//       console.error("Timezone fetch failed:", error);
//       return Intl.DateTimeFormat().resolvedOptions().timeZone;
//     }
//   };

//   // Restored the missing updateLocation function
//   const updateLocation = async (newLoc) => {
//     // If the new location doesn't have a timezone, fetch it
//     const tz = await fetchTimezone(newLoc.lat, newLoc.lon);
//     setLocation({
//       ...newLoc,
//       timezone: tz,
//       isInitial: false // User manually searched, so we aren't "initial" anymore
//     });
//   };

//   useEffect(() => {
//     if ("geolocation" in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           const { latitude, longitude } = position.coords;

//           try {
//             // Fetch both Name and Timezone in parallel for speed
//             const [geoRes, tz] = await Promise.all([
//               fetch(
//                 `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
//               ),
//               fetchTimezone(latitude, longitude)
//             ]);

//             const geoData = await geoRes.json();
//             // console.log("Full GeoData Object:", geoData); 
//             // console.log({ geoData })// Debug log to inspect the structure
//             const cityName =
//               geoData.address.city ||
//               geoData.address.town ||
//               geoData.address.village ||
//               "Current Location";
//             const stateName =
//               geoData.address.state || geoData.address.country || "";

//             setLocation({
//               lat: latitude,
//               lon: longitude,
//               name: `${cityName}${stateName ? ", " + stateName : ""}`,
//               timezone: tz,
//               isInitial: true  // Keep it TRUE so App.jsx can fetch the skyData
//             });
//           } catch (error) {
//             console.error("Location initialization failed:", error);
//             setLocation((prev) => ({ ...prev, isInitial: false })); // failsafe
//           }
//         },
//         (error) => {
//           console.warn("Geolocation denied. Reverting to Default Telemetry.");
//           setLocation({
//             lat: 35.9251,
//             lon: -86.8689,
//             name: "Franklin, TN", // Or call it "Base Station"
//             timezone: "America/Chicago",
//             isInitial: true // Keep it True so App.jsx can fetch default location
//           });
//         },
//         { enableHighAccuracy: true, timeout: 10000 }
//       );
//     } else {
//       // Geolocation not supported by browser
//       setLocation((prev) => ({ ...prev, isInitial: false }));
//     }
//   }, []);

//   return (
//     // This value object MUST contain the functions defined above
//     <LocationContext.Provider value={{ location, updateLocation }}>
//       {children}
//     </LocationContext.Provider>
//   );
// };

// export const useLocation = () => useContext(LocationContext);
