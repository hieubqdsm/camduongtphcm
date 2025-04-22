'use client';

import { Suspense, useEffect, useState, useMemo } from 'react';
import Loading from './components/common/Loading';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import ClientMapView from './components/map/ClientMapView';
import EventFormModal from './components/events/EventFormModal';
import SearchBar from './components/search/SearchBar';
import { LocalStorageService } from './services/localStorage';
import type { ClosureEvent, SearchFilters } from './types/models';

export default function Home() {
  const [events, setEvents] = useState<ClosureEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ClosureEvent | undefined>();
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});

  useEffect(() => {
    try {
      const data = LocalStorageService.getInstance().getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleEventSubmit = async (data: Omit<ClosureEvent, 'id' | 'lastUpdated'>) => {
    try {
      if (selectedEvent) {
        const updatedEvent = LocalStorageService.getInstance().updateEvent({
          ...data,
          id: selectedEvent.id,
          lastUpdated: new Date().toISOString(),
        });
        setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
      } else {
        const newEvent = LocalStorageService.getInstance().saveEvent({
          ...data,
          lastUpdated: new Date().toISOString(),
        });
        setEvents([...events, newEvent]);
      }
      setIsEventModalOpen(false);
      setSelectedEvent(undefined);
    } catch (error) {
      console.error('Failed to save event:', error);
      // TODO: Add error notification
    }
  };

  const handleEventClick = (event: ClosureEvent) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const filteredEvents = useMemo(() => {
    if (!searchFilters.street && !searchFilters.area) return events;

    return events.filter(event => {
      const matchStreet = !searchFilters.street || 
        event.street.toLowerCase().includes(searchFilters.street.toLowerCase());
      const matchArea = !searchFilters.area || 
        event.area.toLowerCase().includes(searchFilters.area.toLowerCase());
      return matchStreet && matchArea;
    });
  }, [events, searchFilters]);

  if (isLoading) {
    return (
      <main className="h-screen">
        <Loading>Đang tải dữ liệu...</Loading>
      </main>
    );
  }

  return (
    <main className="h-screen relative">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-4xl px-4">
        <SearchBar onSearch={setSearchFilters} />
      </div>

      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => {
            setSelectedEvent(undefined);
            setIsEventModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 shadow-lg"
        >
          Thêm sự kiện
        </button>
      </div>

      <ErrorBoundary>
        <Suspense fallback={<Loading>Đang tải bản đồ...</Loading>}>
          <ClientMapView 
            events={filteredEvents} 
            onEventClick={handleEventClick}
          />
        </Suspense>
      </ErrorBoundary>

      <EventFormModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setSelectedEvent(undefined);
        }}
        onSubmit={handleEventSubmit}
        event={selectedEvent}
      />
    </main>
  );
}
