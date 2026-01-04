import React from 'react';
import './SkyDetails.css';

const SkyDetails = ({ skyData }) => {
  if (!skyData) return null;

  const { sun, planets } = skyData;

  const formatTime = (isoString) => {
    if (!isoString) return "--:--";
    return new Date(isoString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="sky-details-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.6, margin: 0 }}>
            Celestial Observations
          </p>
          <h2 style={{ fontSize: '1.2rem', margin: '5px 0 0 0', fontWeight: '600' }}>Franklin, TN</h2>
        </div>
        <span style={{ fontSize: '0.6rem', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '10px', opacity: 0.8 }}>
          35.92° N
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Solar Section */}
        <div>
          <h3 style={{ color: '#60a5fa', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Solar Cycle</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '15px', flex: 1, textAlign: 'center' }}>
              <span style={{ fontSize: '1.2rem' }}>🌅</span>
              <p style={{ fontSize: '0.8rem', margin: '5px 0 0 0', fontWeight: '500' }}>{formatTime(sun.sunrise)}</p>
              <p style={{ fontSize: '0.6rem', opacity: 0.5, margin: 0 }}>SUNRISE</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '15px', flex: 1, textAlign: 'center' }}>
              <span style={{ fontSize: '1.2rem' }}>🌇</span>
              <p style={{ fontSize: '0.8rem', margin: '5px 0 0 0', fontWeight: '500' }}>{formatTime(sun.sunset)}</p>
              <p style={{ fontSize: '0.6rem', opacity: 0.5, margin: 0 }}>SUNSET</p>
            </div>
          </div>
        </div>

        {/* Planets Section */}
        <div>
          <h3 style={{ color: '#c084fc', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Planets</h3>
          <div className="planet-grid">
            {Object.entries(planets).map(([name, info]) => (
              <div key={name} className="planet-item">
                <div style={{ fontSize: '0.8rem', fontWeight: '600', marginBottom: '4px' }}>{name}</div>
                <span className={`status-tag ${info.is_visible ? 'status-visible' : 'status-set'}`}>
                  {info.is_visible ? 'Visible' : 'Set'}
                </span>
                <div style={{ fontSize: '0.65rem', opacity: 0.4, marginTop: '4px' }}>{info.altitude}°</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkyDetails;