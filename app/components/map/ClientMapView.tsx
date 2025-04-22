'use client';

import 'leaflet/dist/leaflet.css';
import MapView from './MapView';
import type { ClosureEvent } from '@/app/types/models';

interface Props {
  events: ClosureEvent[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onEventClick?: (event: ClosureEvent) => void;
}

export default function ClientMapView(props: Props) {
  return <MapView {...props} />;
}
