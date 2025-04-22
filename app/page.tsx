'use client';

import { Suspense, useEffect, useState } from 'react';
import Loading from './components/common/Loading';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import ClientMapView from './components/map/ClientMapView';
import EventFormModal from './components/events/EventFormModal';
import { LocalStorageService } from './services/localStorage';
import type { ClosureEvent } from './types/models';

export default function Home() {
  const [events, setEvents] = useState<ClosureEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ClosureEvent | undefined>();

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

  if (isLoading) {
    return (
      <main className="h-screen">
        <Loading>Đang tải dữ liệu...</Loading>
      </main>
    );
  }

  return (
    <main className="h-screen relative">
      <ErrorBoundary>
        <Suspense fallback={<Loading>Đang tải bản đồ...</Loading>}>
          <ClientMapView events={events} onEventClick={handleEventClick} />
        </Suspense>
      </ErrorBoundary>

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
