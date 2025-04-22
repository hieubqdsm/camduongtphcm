import { renderHook, act } from '@testing-library/react';
import { useSearch } from '../useSearch';
import type { ClosureEvent } from '@/app/types/models';

describe('useSearch', () => {
  const mockEvents: ClosureEvent[] = [
    {
      id: '1',
      street: 'Nguyen Hue',
      area: 'District 1',
      startTime: '2025-01-01T00:00:00Z',
      endTime: '2025-01-02T00:00:00Z',
      reason: 'Construction',
      latitude: 10.7769,
      longitude: 106.7009,
      lastUpdated: '2025-01-01T00:00:00Z',
    },
    {
      id: '2',
      street: 'Le Loi',
      area: 'District 1',
      startTime: '2025-01-01T00:00:00Z',
      endTime: '2025-01-02T00:00:00Z',
      reason: 'Maintenance',
      latitude: 10.7739,
      longitude: 106.7029,
      lastUpdated: '2025-01-01T00:00:00Z',
    },
  ];

  it('should initialize with all events', () => {
    const { result } = renderHook(() => useSearch(mockEvents));
    expect(result.current.searchResults).toEqual(mockEvents);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should filter by street name', async () => {
    const { result } = renderHook(() => useSearch(mockEvents));

    await act(async () => {
      result.current.handleSearch({ street: 'Nguyen', area: '', date: '' });
    });

    expect(result.current.searchResults).toHaveLength(1);
    expect(result.current.searchResults[0].street).toBe('Nguyen Hue');
  });

  it('should filter by area', async () => {
    const { result } = renderHook(() => useSearch(mockEvents));

    await act(async () => {
      result.current.handleSearch({ area: 'District 1', street: '', date: '' });
    });

    expect(result.current.searchResults).toHaveLength(2);
  });

  it('should filter by date', async () => {
    const { result } = renderHook(() => useSearch(mockEvents));

    await act(async () => {
      result.current.handleSearch({ date: '2025-01-01T12:00:00Z', street: '', area: '' });
    });

    expect(result.current.searchResults).toHaveLength(2);
  });

  it('should handle multiple filters', async () => {
    const { result } = renderHook(() => useSearch(mockEvents));

    await act(async () => {
      result.current.handleSearch({
        street: 'Nguyen',
        area: 'District 1',
        date: '2025-01-01T12:00:00Z',
      });
    });

    expect(result.current.searchResults).toHaveLength(1);
    expect(result.current.searchResults[0].street).toBe('Nguyen Hue');
  });

  it('should handle case-insensitive search', async () => {
    const { result } = renderHook(() => useSearch(mockEvents));

    await act(async () => {
      result.current.handleSearch({ street: 'nguyen', area: '', date: '' });
    });

    expect(result.current.searchResults).toHaveLength(1);
    expect(result.current.searchResults[0].street).toBe('Nguyen Hue');
  });

  it('should return no results for non-matching filters', async () => {
    const { result } = renderHook(() => useSearch(mockEvents));

    await act(async () => {
      result.current.handleSearch({ street: 'Non-existent Street', area: '', date: '' });
    });

    expect(result.current.searchResults).toHaveLength(0);
  });

  it('should update results when events prop changes', () => {
    const { result, rerender } = renderHook(
      ({ events }) => useSearch(events),
      { initialProps: { events: mockEvents } }
    );

    expect(result.current.searchResults).toHaveLength(2);

    const newEvents = [mockEvents[0]];
    rerender({ events: newEvents });

    expect(result.current.searchResults).toHaveLength(1);
  });
});
