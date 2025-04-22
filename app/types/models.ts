export interface ClosureEvent {
  id: string;
  street: string;
  area: string;
  startTime: string;
  endTime: string;
  reason: string;
  latitude: number;
  longitude: number;
  lastUpdated: string;
}

export interface SearchFilters {
  street?: string;
  area?: string;
  date?: string;
}

export interface MapViewProps {
  events: ClosureEvent[];
  onEventClick?: (event: ClosureEvent) => void;
}

export interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  loading?: boolean;
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
