import { useEffect, useState } from 'react';
import type { ClosureEvent } from '@/app/types/models';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet components with no SSR
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);
const MarkerClusterGroup = dynamic(
  () => import('react-leaflet-cluster'),
  { ssr: false }
);

interface Props {
  events: ClosureEvent[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onEventClick?: (event: ClosureEvent) => void;
}

const defaultCenter = {
  lat: 10.7769,
  lng: 106.7009,
};

const MapView = ({ events = [], center, zoom = 13, onEventClick }: Props) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const L = require('leaflet');
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/marker-icon-2x.png',
        iconUrl: '/marker-icon.png',
        shadowUrl: '/marker-shadow.png',
      });
    }
  }, [isClient]);

  if (!isClient) {
    return <div className="h-full w-full bg-gray-100 animate-pulse" />;
  }

  // Calculate center from events if available
  let mapCenter = center || defaultCenter;
  if (!center && events.length > 0) {
    const sumLat = events.reduce((sum, event) => sum + event.latitude, 0);
    const sumLng = events.reduce((sum, event) => sum + event.longitude, 0);
    mapCenter = {
      lat: sumLat / events.length,
      lng: sumLng / events.length,
    };
  }

  // Ensure we have valid coordinates
  if (isNaN(mapCenter.lat) || isNaN(mapCenter.lng)) {
    mapCenter = defaultCenter;
  }

  return (
    <MapContainer
      center={[mapCenter.lat, mapCenter.lng]}
      zoom={zoom}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup>
        {events.map((event) => (
          <Marker
            key={event.id}
            position={[event.latitude, event.longitude]}
            eventHandlers={{
              click: () => onEventClick?.(event),
            }}
          >
            <Popup>
              <div className="text-sm">
                <h3 className="font-semibold">{event.street}</h3>
                <p>{event.area}</p>
                <p>
                  {new Date(event.startTime).toLocaleDateString('vi-VN')} -{' '}
                  {new Date(event.endTime).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default MapView;
