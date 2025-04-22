export interface Coordinates {
  lat: number;
  lng: number;
}

export interface ClosureEvent {
  id: string;
  street: string;
  area: string;
  startTime: string;
  endTime: string;
  description: string;
  coordinates: Coordinates;
  affectedAreas: string[];
  lastUpdated: string;
}

export interface SearchFilters {
  street?: string;
  area?: string;
  date?: string;
}

export interface MapViewProps {
  events: ClosureEvent[];
  selectedEvent?: string;
  onEventClick: (event: ClosureEvent) => void;
}

export interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  loading?: boolean;
  placeholder?: string;
}

export interface EventDetailProps {
  event: ClosureEvent;
  onClose: () => void;
  isOpen: boolean;
}

export interface LocalStorageSchema {
  closureEvents: ClosureEvent[];
  lastSync: string;
}
