import React, { useState, memo, useId, FormEvent } from "react";

// 1. Define the props expected by the component
interface LocationSearchProps {
  onLocationChange: (newLoc: { lat: number; lon: number; name: string }) => void;
}

// 2. Define the expected shape of the Nominatim API responses
interface NominatimSearchResult {
  lat: string;
  lon: string;
  display_name: string;
}

interface NominatimReverseResult {
  address: {
    city?: string;
    town?: string;
    village?: string;
    suburb?: string;
  };
}

// 3. Apply the Props interface to the memoized component
const LocationSearch = memo<LocationSearchProps>(({ onLocationChange }) => {
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const inputId = useId();

  // 4. Type the FormEvent
  const handleSearch = async (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    const controller = new AbortController();

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
        {
          signal: controller.signal,
          headers: {
            "User-Agent": `SkyWatch/1.0 (${import.meta.env.VITE_NOMINATIM_EMAIL || "anonymous"})`
          }
        }
      );

      if (response.status === 425 || response.status === 429) {
        alert("Search is temporarily throttled. Please wait a few seconds.");
        return;
      }

      // Tell TypeScript what shape we expect the JSON to be
      const data: NominatimSearchResult[] = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        
        onLocationChange({
          lat: parseFloat(lat),
          lon: parseFloat(lon),
          name: display_name.split(",")[0]
        });
        setQuery("");
      } else {
        alert("Location not found.");
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        console.log("Search request cancelled.");
      } else {
        console.error("Search error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const useGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        let detectedName = "Current Location";

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
            // Tell TypeScript what shape the reverse geocode JSON is
            const data: NominatimReverseResult = await response.json();
            const a = data.address;
            
            detectedName =
              a.city || a.town || a.village || a.suburb || "Current Location";
          }
        } catch (err) {
          console.error("Geocoding failed, using fallback.", err);
        } finally {
          onLocationChange({
            lat: latitude,
            lon: longitude,
            name: detectedName
          });
          setLoading(false);
        }
      },
      (error) => {
        setLoading(false);
        console.error(error);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  return (
    <div className="search-wrapper">
      <form
        onSubmit={handleSearch}
        style={{ display: "flex", alignItems: "center", gap: "10px" }}
      >
        <label htmlFor={inputId} className="sr-only" style={{ display: 'none' }}>
          Search Location
        </label>
        <input
          id={inputId}
          name="location-search"
          type="text"
          placeholder={loading ? "LOCATING..." : "Search location..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input-field"
          disabled={loading}
          autoComplete="off"
          spellCheck="false"
          inputMode="search"
          style={{
            cursor: loading ? "wait" : "text",
            opacity: loading ? 0.7 : 1,
            fontFamily: 'Roboto Condensed',
          }}
        />
      </form>
    </div>
  );
});

export default LocationSearch;

