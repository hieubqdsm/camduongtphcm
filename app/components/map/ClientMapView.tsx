'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import type { ClosureEvent } from '@/app/types/models';

// Dynamically import MapView with no SSR
const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 animate-pulse" />,
});

interface Props {
  events: ClosureEvent[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onEventClick?: (event: ClosureEvent) => void;
}

export default function ClientMapView(props: Props) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Initialize Leaflet icons
    const L = require('leaflet');
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/marker-icon-2x.png',
      iconUrl: '/marker-icon.png',
      shadowUrl: '/marker-shadow.png',
    });
  }, []);

  if (!isClient) {
    return <div className="h-full w-full bg-gray-100 animate-pulse" />;
  }

  return <MapView {...props} />;
}
