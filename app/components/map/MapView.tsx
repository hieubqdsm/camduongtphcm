'use client';

import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import type { ClosureEvent } from '@/app/types/models';

interface Props {
  events: ClosureEvent[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onEventClick?: (event: ClosureEvent) => void;
}

const MapView = ({ events, center, zoom = 13, onEventClick }: Props) => {
  const defaultCenter = { lat: 10.7769, lng: 106.7009 }; // Ho Chi Minh City
  const mapCenter = useMemo(() => {
    if (center) return center;
    if (events.length === 0) return defaultCenter;

    // Calculate center from all event coordinates
    const validEvents = events.filter(
      event => !isNaN(event.latitude) && !isNaN(event.longitude)
    );
    if (validEvents.length === 0) return defaultCenter;

    const sumLat = validEvents.reduce((sum, event) => sum + event.latitude, 0);
    const sumLng = validEvents.reduce((sum, event) => sum + event.longitude, 0);
    return {
      lat: sumLat / validEvents.length,
      lng: sumLng / validEvents.length,
    };
  }, [center, events]);

  return (
    <MapContainer
      center={[mapCenter.lat, mapCenter.lng]}
      zoom={zoom}
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup>
        {events.map((event) => {
          if (isNaN(event.latitude) || isNaN(event.longitude)) return null;
          return (
            <Marker
              key={event.id}
              position={[event.latitude, event.longitude]}
              eventHandlers={{
                click: () => onEventClick?.(event),
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold">{event.street}</h3>
                  <p className="text-sm text-gray-600">{event.area}</p>
                  <p className="text-sm">
                    <span className="font-medium">Bắt đầu:</span>{' '}
                    {new Date(event.startTime).toLocaleString('vi-VN')}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Kết thúc:</span>{' '}
                    {new Date(event.endTime).toLocaleString('vi-VN')}
                  </p>
                  <p className="text-sm mt-2">{event.reason}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default MapView;
