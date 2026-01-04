import React, { useState, useEffect } from 'react';
import './MoonTracker.css'; // Ensure you have the CSS file we created!

const MoonTracker = () => {
  const [illumination, setIllumination] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/moon-illumination')
      .then(response => response.json())
      .then(data => {
        setIllumination(data.illumination);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching moon data:", err);
        setLoading(false);
      });
  }, []);

  // --- The Graphic Sub-Component ---
  const MoonGraphic = ({ percentage }) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', width: '100%' }}>
        <div style={{
          width: '120px', // Scaled down to fit in the dashboard row
          height: '120px',
          backgroundColor: '#1a1a1a', 
          borderRadius: '50%',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)'
        }}>
          {/* The lit portion */}
          <div style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: '#fefcd7', 
            boxShadow: 'inset -10px 0 20px rgba(0,0,0,0.3), 0 0 15px rgba(254, 252, 215, 0.4)',
            transition: 'width 1s ease-in-out'
          }} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h2 className="moon-percentage" style={{ margin: 0 }}>
            {percentage}%
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.7rem', margin: 0 }}>
            Illumination
          </p>
        </div>
      </div>
    );
  };

  // --- Main Render (Glassmorphic Container) ---
  return (
    <div className="moon-card">
      <p style={{ 
        fontSize: '0.7rem', 
        textTransform: 'uppercase', 
        letterSpacing: '2px', 
        opacity: 0.6, 
        marginBottom: '20px',
        alignSelf: 'flex-start' 
      }}>
        Lunar Phase
      </p>

      {loading ? (
        <p style={{ color: '#fff', fontSize: '0.8rem' }}>Querying Skyfield...</p>
      ) : illumination !== null ? (
        <MoonGraphic percentage={illumination} />
      ) : (
        <p style={{ color: '#ff4444', fontSize: '0.8rem' }}>API Error</p>
      )}
    </div>
  );
};

export default MoonTracker;