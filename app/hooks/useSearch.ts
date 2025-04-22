import { useState, useCallback, useMemo } from 'react';
import type { ClosureEvent, SearchFilters } from '../types/models';
import { useDebounce } from './useDebounce';

interface UseSearchReturn {
  searchResults: ClosureEvent[];
  loading: boolean;
  error: string | null;
  handleSearch: (filters: SearchFilters) => void;
}

export function useSearch(events: ClosureEvent[]): UseSearchReturn {
  const [searchResults, setSearchResults] = useState<ClosureEvent[]>(events);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filterEvents = useCallback((filters: SearchFilters): ClosureEvent[] => {
    return events.filter(event => {
      const matchesStreet = !filters.street || 
        event.street.toLowerCase().includes(filters.street.toLowerCase());
      
      const matchesArea = !filters.area || 
        event.area.toLowerCase().includes(filters.area.toLowerCase());
      
      const matchesDate = !filters.date || 
        (new Date(event.startTime) <= new Date(filters.date) && 
         new Date(event.endTime) >= new Date(filters.date));

      return matchesStreet && matchesArea && matchesDate;
    });
  }, [events]);

  const debouncedSearch = useDebounce((filters: SearchFilters) => {
    try {
      setLoading(true);
      setError(null);
      const results = filterEvents(filters);
      setSearchResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, 300);

  const handleSearch = useCallback((filters: SearchFilters) => {
    debouncedSearch(filters);
  }, [debouncedSearch]);

  // Update search results when events change
  useMemo(() => {
    setSearchResults(events);
  }, [events]);

  return {
    searchResults,
    loading,
    error,
    handleSearch
  };
}
