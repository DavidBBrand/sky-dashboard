import React from "react";

const MapCard = ({ lat, lon }) => {
  // Replace this with your actual Mapbox Public Token
  const MAPBOX_TOKEN =
    "pk.eyJ1IjoiZGF2aWRiNTY3OCIsImEiOiJjbGxncHFqcWoweHV3M3JxaGxna2FqNHZmIn0.A4Yc2EE-9W2yKvn1C6S9TQ";

  // Settings for the map's look
  const zoom = 12;
  const width = 600;
  const height = 400;
  const style = "satellite-v9"; // Matches the dark dashboard vibe

  // The Static API URL format:
  // https://api.mapbox.com/styles/v1/mapbox/{style}/static/{lon},{lat},{zoom}/{width}x{height}?access_token={token}
  const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/${style}/static/pin-s+ff4444(${lon},${lat})/${lon},${lat},${zoom},0/600x400@2x?access_token=${MAPBOX_TOKEN}`;

  return (
    <div
      className="sky-details-card"
      style={{
        padding: 0,
        overflow: "hidden",
        position: "relative",
        width: "240px",
        height: "400px"
      }}
    >
      <img
        src={mapUrl}
        alt="Location Map"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "flexwrap"
        }}
      />
      {/* Small overlay to show coordinates */}
      
    </div>
  );
};

export default MapCard;
