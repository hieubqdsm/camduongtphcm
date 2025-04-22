import { useState, useEffect, useCallback } from 'react';
import type { ClosureEvent } from '../types/models';
import { LocalStorageService } from '../services/localStorage';

interface UseEventsReturn {
  events: ClosureEvent[];
  loading: boolean;
  error: string | null;
  addEvent: (event: Omit<ClosureEvent, 'id'>) => Promise<ClosureEvent>;
  updateEvent: (event: ClosureEvent) => Promise<ClosureEvent>;
  deleteEvent: (id: string) => Promise<void>;
  clearEvents: () => Promise<void>;
  refreshEvents: () => Promise<void>;
}

export function useEvents(): UseEventsReturn {
  const [events, setEvents] = useState<ClosureEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const storage = LocalStorageService.getInstance();

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedEvents = storage.getEvents();
      setEvents(loadedEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const addEvent = useCallback(async (event: Omit<ClosureEvent, 'id'>): Promise<ClosureEvent> => {
    try {
      setError(null);
      const newEvent = storage.saveEvent(event);
      setEvents(prev => [...prev, newEvent]);
      return newEvent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add event';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const updateEvent = useCallback(async (event: ClosureEvent): Promise<ClosureEvent> => {
    try {
      setError(null);
      const updatedEvent = storage.updateEvent(event);
      setEvents(prev => prev.map(e => e.id === event.id ? updatedEvent : e));
      return updatedEvent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update event';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const deleteEvent = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      storage.deleteEvent(id);
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete event';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const clearEvents = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      storage.clearEvents();
      setEvents([]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear events';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const refreshEvents = useCallback(async (): Promise<void> => {
    await loadEvents();
  }, [loadEvents]);

  return {
    events,
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    clearEvents,
    refreshEvents
  };
}
