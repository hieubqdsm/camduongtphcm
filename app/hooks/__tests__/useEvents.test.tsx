import { renderHook, act } from '@testing-library/react';
import { useEvents } from '../useEvents';
import { LocalStorageService } from '@/app/services/localStorage';
import type { ClosureEvent } from '@/app/types/models';

jest.mock('@/app/services/localStorage', () => ({
  LocalStorageService: {
    getInstance: jest.fn(),
  },
}));

describe('useEvents', () => {
  const mockEvent: ClosureEvent = {
    id: '1',
    street: 'Test Street',
    area: 'Test Area',
    startTime: '2025-01-01T00:00:00Z',
    endTime: '2025-01-02T00:00:00Z',
    reason: 'Test Reason',
    latitude: 10.7769,
    longitude: 106.7009,
    lastUpdated: '2025-01-01T00:00:00Z',
  };

  const mockStorage = {
    getEvents: jest.fn(),
    saveEvent: jest.fn(),
    updateEvent: jest.fn(),
    deleteEvent: jest.fn(),
    clearEvents: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (LocalStorageService.getInstance as jest.Mock).mockReturnValue(mockStorage);
    mockStorage.getEvents.mockReturnValue([mockEvent]);
  });

  it('should load events on mount', () => {
    const { result } = renderHook(() => useEvents());
    expect(result.current.events).toEqual([mockEvent]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should add new event', async () => {
    const newEvent = { ...mockEvent, id: '2' };
    mockStorage.saveEvent.mockReturnValue(newEvent);

    const { result } = renderHook(() => useEvents());

    await act(async () => {
      const addedEvent = await result.current.addEvent({
        street: mockEvent.street,
        area: mockEvent.area,
        startTime: mockEvent.startTime,
        endTime: mockEvent.endTime,
        reason: mockEvent.reason,
        latitude: mockEvent.latitude,
        longitude: mockEvent.longitude,
        lastUpdated: mockEvent.lastUpdated,
      });
      expect(addedEvent).toEqual(newEvent);
    });

    expect(mockStorage.saveEvent).toHaveBeenCalledWith({
      street: mockEvent.street,
      area: mockEvent.area,
      startTime: mockEvent.startTime,
      endTime: mockEvent.endTime,
      reason: mockEvent.reason,
      latitude: mockEvent.latitude,
      longitude: mockEvent.longitude,
      lastUpdated: mockEvent.lastUpdated,
    });
    expect(result.current.events).toContainEqual(newEvent);
  });

  it('should update existing event', async () => {
    const updatedEvent = { ...mockEvent, street: 'Updated Street' };
    mockStorage.updateEvent.mockReturnValue(updatedEvent);

    const { result } = renderHook(() => useEvents());

    await act(async () => {
      const resultEvent = await result.current.updateEvent(updatedEvent);
      expect(resultEvent).toEqual(updatedEvent);
    });

    expect(mockStorage.updateEvent).toHaveBeenCalledWith(updatedEvent);
    expect(result.current.events[0].street).toBe('Updated Street');
  });

  it('should delete event', async () => {
    const { result } = renderHook(() => useEvents());

    await act(async () => {
      await result.current.deleteEvent(mockEvent.id);
    });

    expect(mockStorage.deleteEvent).toHaveBeenCalledWith(mockEvent.id);
    expect(result.current.events).not.toContainEqual(mockEvent);
  });

  it('should handle errors', async () => {
    mockStorage.saveEvent.mockRejectedValue(new Error('Failed to save'));

    const { result } = renderHook(() => useEvents());

    await act(async () => {
      try {
        await result.current.addEvent({
          street: mockEvent.street,
          area: mockEvent.area,
          startTime: mockEvent.startTime,
          endTime: mockEvent.endTime,
          reason: mockEvent.reason,
          latitude: mockEvent.latitude,
          longitude: mockEvent.longitude,
          lastUpdated: mockEvent.lastUpdated,
        });
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toBe('Failed to save event');
        }
      }
    });

    expect(result.current.error).toBe('Failed to save event');
  });

  it('should clear events', async () => {
    const { result } = renderHook(() => useEvents());

    await act(async () => {
      await result.current.clearEvents();
    });

    expect(mockStorage.clearEvents).toHaveBeenCalled();
    expect(result.current.events).toHaveLength(0);
  });
});
