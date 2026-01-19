import React, { useState, useEffect } from "react";
import "./MoonTracker.css";

const MoonTracker = ({ lat, lon }) => {
  const [illumination, setIllumination] = useState(null);
  const [loading, setLoading] = useState(true);

  // Corrected single useEffect block
  useEffect(() => {
    setLoading(true);
    let isMounted = true; // to prevent state updates if unmounted
    // Fetching from the details endpoint in main.py
    fetch(`http://127.0.0.1:8000/moon-details?lat=${lat}&lon=${lon}`)
      .then((response) => response.json())
      .then((data) => {
        if (isMounted) {
          setIllumination(data.illumination);
          setLoading(false);
        }
        // reference data.illumination from main.py
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Error fetching moon data:", err);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    }; // cleanup function
  }, [lat, lon]);

  // --- The Graphic Sub-Component ---
  // const MoonGraphic = ({ percentage }) => {
  //   return (
  //     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', width: '100%' }}>
  //       <div style={{
  //         width: '120px',
  //         height: '120px',
  //         backgroundColor: '#1a1a1a',
  //         borderRadius: '50%',
  //         position: 'relative',
  //         overflow: 'hidden',
  //         border: '1px solid var(--card-border)',
  //         boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)'
  //       }}>
  //         {/* The lit portion */}
  //         <div style={{
  //           width: `${percentage}%`,
  //           height: '100%',
  //           backgroundColor: '#fefcd7',
  //           boxShadow: 'inset -10px 0 20px rgba(0,0,0,0.3), 0 0 15px rgba(254, 252, 215, 0.4)',
  //           transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
  //         }} />
  //       </div>
  //       <div style={{ textAlign: 'center' }}>
  //         <h2 className="moon-percentage" style={{ margin: 0, color: 'var(--text-main)' }}>
  //           {percentage}%
  //         </h2>
  //         <p style={{ color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.7rem', margin: 0 }}>
  //           Illumination
  //         </p>
  //       </div>
  //     </div>
  //   );
  // };
const MoonGraphic = ({ percentage }) => {
  // Logic: 
  // If percentage is 1%, we want the shadow to cover 99% of the surface.
  // If percentage is 100%, we want the shadow to move entirely off-screen (100%).
  
  // We'll move the shadow from 0% (New Moon) to 100% (Full Moon)
  const shadowMovement = percentage; 

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
      <div style={{
        width: '140px',
        height: '140px',
        backgroundColor: '#fefcd7', // THE LIT SIDE (Background)
        borderRadius: '50%',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 0 30px rgba(254, 252, 215, 0.2)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        {/* THE SHADOW 
            This moves across the light background to hide/reveal it.
        */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#1a1a1a', // THE DARK SIDE
          borderRadius: '50%',
          // At 1%, it only moves 1%, leaving 99% covered in dark.
          // At 99%, it moves 99% away, leaving almost all light.
          transform: `translateX(${shadowMovement}%)`, 
          transition: 'transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }} />
      </div>

      <div style={{ textAlign: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--text-main)' }}>
          {percentage}%
        </h2>
        <p style={{ color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.7rem', margin: 0 }}>
          Current Illumination
        </p>
      </div>
    </div>
  );
};

  return (
    <div className="moon-card">
      <p
        style={{
          fontSize: "0.8rem",
          textTransform: "uppercase",
          letterSpacing: "3px",
          color: "var(--text-sub)",
          marginBottom: "20px",
          alignSelf: "flex-start",
          fontWeight: "500"
        }}
      >
        Lunar Phase
      </p>

      {loading ? (
        <p
          style={{
            color: "var(--text-main)",
            fontSize: "0.8rem",
            opacity: 0.6
          }}
        >
          Updating Phase...
        </p>
      ) : illumination !== null ? (
        <MoonGraphic percentage={illumination} />
      ) : (
        <p style={{ color: "#ff4444", fontSize: "0.8rem" }}>Data Unavailable</p>
      )}
    </div>
  );
};

export default MoonTracker;
