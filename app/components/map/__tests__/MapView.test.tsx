import { render, screen } from '@testing-library/react';
import MapView from '../MapView';
import type { ClosureEvent } from '@/app/types/models';

// Mock the leaflet modules
jest.mock('leaflet', () => ({
  map: jest.fn(),
  tileLayer: jest.fn(),
  marker: jest.fn(),
  icon: jest.fn(),
  Icon: {
    Default: {
      prototype: {
        _getIconUrl: jest.fn(),
      },
      mergeOptions: jest.fn(),
    },
  },
}));

jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="marker">{children}</div>
  ),
  Popup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="popup">{children}</div>
  ),
}));

jest.mock('react-leaflet-cluster', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="marker-cluster">{children}</div>
  ),
}));

describe('MapView', () => {
  const mockEvents: ClosureEvent[] = [
    {
      id: '1',
      street: 'Nguyen Hue',
      area: 'District 1',
      startTime: '2025-01-01T00:00:00Z',
      endTime: '2025-01-02T00:00:00Z',
      reason: 'Construction',
      latitude: 10.7769,
      longitude: 106.7009,
      lastUpdated: '2025-01-01T00:00:00Z',
    },
    {
      id: '2',
      street: 'Le Loi',
      area: 'District 1',
      startTime: '2025-01-01T00:00:00Z',
      endTime: '2025-01-02T00:00:00Z',
      reason: 'Maintenance',
      latitude: 10.7739,
      longitude: 106.7029,
      lastUpdated: '2025-01-01T00:00:00Z',
    },
  ];

  const defaultProps = {
    events: mockEvents,
    onEventClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders map container and tile layer', () => {
    render(<MapView {...defaultProps} />);
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
    expect(screen.getByTestId('tile-layer')).toBeInTheDocument();
  });

  it('renders markers for each event', () => {
    render(<MapView {...defaultProps} />);
    const markers = screen.getAllByTestId('marker');
    expect(markers).toHaveLength(mockEvents.length);
  });

  it('renders marker cluster', () => {
    render(<MapView {...defaultProps} />);
    expect(screen.getByTestId('marker-cluster')).toBeInTheDocument();
  });

  it('renders popups with event information', () => {
    render(<MapView {...defaultProps} />);
    const popups = screen.getAllByTestId('popup');
    expect(popups).toHaveLength(mockEvents.length);

    mockEvents.forEach((event) => {
      expect(screen.getByText(event.street)).toBeInTheDocument();
      expect(screen.getByText(event.area)).toBeInTheDocument();
    });
  });

  it('handles empty events array', () => {
    render(<MapView {...defaultProps} events={[]} />);
    expect(screen.queryAllByTestId('marker')).toHaveLength(0);
  });

  it('renders with default center and zoom if not provided', () => {
    render(<MapView {...defaultProps} />);
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });

  it('renders with custom center and zoom if provided', () => {
    const customProps = {
      ...defaultProps,
      center: { lat: 10.7769, lng: 106.7009 },
      zoom: 15,
    };
    render(<MapView {...customProps} />);
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });
});
