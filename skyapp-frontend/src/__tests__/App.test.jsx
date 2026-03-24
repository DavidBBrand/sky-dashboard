import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test } from 'vitest';
import App from '../App';
import { LocationProvider } from '../LocationContext';

test('renders Sky Watch title and toggles theme', () => {
  render(
    <LocationProvider>
      <App />
    </LocationProvider>
  );

  // 1. Check if the HUD title exists
  const titleElement = screen.getByText(/SKY WATCH/i);
  expect(titleElement).toBeInTheDocument();

  // 2. Check Theme Toggle
  const toggleBtn = screen.getByRole('button', { name: /Night Mode|Day Mode/i });
  fireEvent.click(toggleBtn);
  
  // Verify if data-theme attribute changes on the document
  expect(document.documentElement.getAttribute('data-theme')).toBe('day');
});