import { LocalStorageService, StorageError } from '../localStorage';
import type { ClosureEvent } from '@/app/types/models';

describe('LocalStorageService', () => {
  let service: LocalStorageService;
  let mockStorage: { [key: string]: string } = {};

  // Mock localStorage
  beforeAll(() => {
    global.Storage.prototype.setItem = jest.fn((key, value) => {
      mockStorage[key] = value;
    });
    global.Storage.prototype.getItem = jest.fn((key) => mockStorage[key] || null);
    global.Storage.prototype.removeItem = jest.fn((key) => {
      delete mockStorage[key];
    });
    global.Storage.prototype.clear = jest.fn(() => {
      mockStorage = {};
    });
  });

  const mockEventData = {
    street: 'Test Street',
    area: 'Test Area',
    startTime: '2025-01-01T00:00:00Z',
    endTime: '2025-01-02T00:00:00Z',
    reason: 'Test Reason',
    latitude: 10.7769,
    longitude: 106.7009,
    lastUpdated: new Date().toISOString(),
  };

  beforeEach(() => {
    mockStorage = {};
    localStorage.clear();
    service = LocalStorageService.getInstance();
    // Initialize storage with empty events array
    localStorage.setItem('events', JSON.stringify([]));
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should be a singleton', () => {
    const instance1 = LocalStorageService.getInstance();
    const instance2 = LocalStorageService.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('should initialize storage with empty events array', () => {
    const events = service.getEvents();
    expect(events).toEqual([]);
  });

  it('should save and retrieve events', () => {
    const savedEvent = service.saveEvent(mockEventData);
    expect(savedEvent.id).toBeDefined();
    expect(savedEvent.lastUpdated).toBeDefined();

    const events = service.getEvents();
    expect(events).toHaveLength(1);
    expect(events[0]).toEqual(savedEvent);
  });

  it('should update existing events', () => {
    const savedEvent = service.saveEvent(mockEventData);
    const updatedEvent = {
      ...savedEvent,
      street: 'Updated Street',
    };

    const result = service.updateEvent(updatedEvent);
    expect(result.street).toBe('Updated Street');
    expect(result.lastUpdated).not.toBe(savedEvent.lastUpdated);

    const events = service.getEvents();
    expect(events).toHaveLength(1);
    expect(events[0].street).toBe('Updated Street');
  });

  it('should delete events', () => {
    const savedEvent = service.saveEvent(mockEventData);
    service.deleteEvent(savedEvent.id);
    const events = service.getEvents();
    expect(events).toHaveLength(0);
  });

  it('should enforce storage limits', () => {
    // Add maximum number of events
    const MAX_EVENTS = 1000;
    for (let i = 0; i < MAX_EVENTS; i++) {
      service.saveEvent(mockEventData);
    }

    // Attempt to add one more event
    expect(() => service.saveEvent(mockEventData)).toThrow(StorageError);
  });

  it('should handle storage errors gracefully', () => {
    // Mock localStorage.setItem to throw an error
    const mockSetItem = jest.spyOn(Storage.prototype, 'setItem');
    mockSetItem.mockImplementation(() => {
      throw new Error('Storage full');
    });

    expect(() => service.saveEvent(mockEventData)).toThrow(StorageError);
    mockSetItem.mockRestore();
  });
});
