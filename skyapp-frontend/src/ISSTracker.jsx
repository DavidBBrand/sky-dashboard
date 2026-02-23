import React, { memo } from 'react';

const ISSTracker = memo(({ issUrl }) => {
  console.log("ISS Iframe rendered (should only happen once)");
  return (
    <div className="iss-container">
      <iframe
        title="ISS Tracker"
        src={issUrl}
        width="100%"
        height="300px"
        frameBorder="0"
        scrolling="no"
        /* Adding a unique loading strategy */
        loading="lazy"
      />
    </div>
  );
}, (prevProps, nextProps) => {
  // Only re-render if the URL actually changes
  return prevProps.issUrl === nextProps.issUrl;
});

export default ISSTracker;