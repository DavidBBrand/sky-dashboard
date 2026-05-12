import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import App from '../App';
import '@testing-library/jest-dom';
import React from 'react';

// 1. Mock the system time to 12:00 PM
vi.setSystemTime(new Date('2026-04-09T12:00:00Z'));

// 2. Mock react-leaflet
// We type the props as 'any' here because we are strictly replacing the component 
// for the test environment to avoid rendering heavy canvas/map logic.
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => null,
  Marker: () => null,
  Popup: () => null,
  useMap: () => ({
    setView: vi.fn(),
  }),
}));

// 3. FIX: Updated Mock for LocationContext
// This now matches the 'lat' and 'lon' naming convention used in your components.
vi.mock('../LocationContext', () => ({
  LocationProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useLocation: () => ({
    location: { 
      lat: 35.92, 
      lon: -86.86,
      name: 'Franklin, TN',
      timezone: 'America/Chicago'
    },
    loading: false,
    error: null,
  }),
}));

// 4. Mock Global Fetch
vi.stubGlobal('fetch', vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ 
      sun: { 
        sunrise: "2026-04-09T06:22:00Z", 
        sunset: "2026-04-09T19:15:00Z",
        phase: "Full Moon" 
      },
      planets: {
        Mars: { altitude: 15.5, azimuth: 120.2 },
        Venus: { altitude: -5.0, azimuth: 250.1 }
      },
      // Added moon-details mock to satisfy Moon.tsx
      altitude: 10.5,
      azimuth: 180.0,
      illumination: 95.5,
      milestones: []
    }),
  })
));

test('renders Sky Watch title and toggles theme', async () => {
  render(<App />); 

  // 1. Wait for render - Title is usually transformed to uppercase in CSS, 
  // but findByText with a Regex 'i' flag handles it.
  const titleElement = await screen.findByText(/SKY WATCH/i);
  expect(titleElement).toBeInTheDocument();

  // 2. Verify initial theme is DAY (Mocked to Noon)
  expect(document.documentElement.getAttribute('data-theme')).toBe('day');

  // 3. Find button by its ARIA LABEL
  const toggleBtn = screen.getByLabelText(/toggle day\/night mode/i);
  
  // 4. Toggle to NIGHT
  fireEvent.click(toggleBtn);
  
  // 5. Verify change to NIGHT
  expect(document.documentElement.getAttribute('data-theme')).toBe('night');
});