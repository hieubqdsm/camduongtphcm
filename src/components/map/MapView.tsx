'use client';

import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { MapViewProps } from '@/app/types/models';
import L from 'leaflet';

// Fix for default marker icons in Next.js
const DefaultIcon = L.icon({
  iconUrl: '/images/marker-icon.png',
  iconRetinaUrl: '/images/marker-icon-2x.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function MapView({ events, selectedEvent, onEventClick }: MapViewProps) {
  const center = useMemo(() => ({
    lat: parseFloat(process.env.NEXT_PUBLIC_DEFAULT_CENTER_LAT || '10.7769'),
    lng: parseFloat(process.env.NEXT_PUBLIC_DEFAULT_CENTER_LNG || '106.7009')
  }), []);

  const zoom = parseInt(process.env.NEXT_PUBLIC_DEFAULT_ZOOM || '13', 10);

  return (
    <div className="w-full h-[calc(100vh-4rem)]">
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
      >
        <TileLayer
          url={process.env.NEXT_PUBLIC_MAP_TILE_URL || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {events.map((event) => (
          <Marker
            key={event.id}
            position={event.coordinates}
            eventHandlers={{
              click: () => onEventClick(event)
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold">{event.street}</h3>
                <p className="text-sm text-gray-600">{event.area}</p>
                <p className="text-xs text-gray-500">
                  {new Date(event.startTime).toLocaleDateString('vi-VN')} - 
                  {new Date(event.endTime).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
