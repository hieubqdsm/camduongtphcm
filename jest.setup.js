import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock leaflet
jest.mock('leaflet', () => ({
  map: jest.fn(),
  marker: jest.fn(),
  tileLayer: jest.fn(),
  icon: jest.fn(),
  DivIcon: jest.fn(),
  divIcon: jest.fn(),
  point: jest.fn(),
  latLng: jest.fn(),
  latLngBounds: jest.fn(),
  Icon: {
    Default: {
      prototype: {
        _getIconUrl: jest.fn(),
      },
      mergeOptions: jest.fn(),
    },
  },
}));
