import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, vi } from 'vitest'; // Removed beforeEach
import App from '../App';
import { LocationProvider } from '../LocationContext';
import '@testing-library/jest-dom';

// 1. Mock Leaflet
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="map">{children}</div>,
  TileLayer: () => null,
  Marker: () => null,
  Popup: () => null,
}));

// 2. Geolocation Mock (Global Scope)
const mockGeolocation = {
  getCurrentPosition: vi.fn().mockImplementation((success) =>
    success({
      coords: { latitude: 35.92, longitude: -86.86 },
    })
  ),
  watchPosition: vi.fn(),
};
vi.stubGlobal('navigator', { geolocation: mockGeolocation });

test('renders Sky Watch title and toggles theme', async () => {
  render(
    <LocationProvider>
      <App />
    </LocationProvider>
  );

  // 3. Use findByText to wait for the GPS mock to kick in
  const titleElement = await screen.findByText(/SKY WATCH/i);
  expect(titleElement).toBeInTheDocument();

  // 4. Verify initial theme (Night)
  expect(document.documentElement.getAttribute('data-theme')).toBe('night');

  // 5. Toggle Theme
  const toggleBtn = screen.getByRole('button', { name: /toggle day\/night mode/i });
  fireEvent.click(toggleBtn);
  
  // 6. Verify change to Day
  expect(document.documentElement.getAttribute('data-theme')).toBe('day');
});