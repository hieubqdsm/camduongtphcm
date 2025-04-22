import type { ClosureEvent, LocalStorageSchema } from '../types/models';

const STORAGE_KEY = 'camduongtphcm_data';
const STORAGE_VERSION = '1.0.0';
const MAX_EVENTS = 1000; // Maximum number of events to store

export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageError';
  }
}

export class LocalStorageService {
  private static instance: LocalStorageService;

  private constructor() {
    this.initializeStorage();
  }

  static getInstance(): LocalStorageService {
    if (!LocalStorageService.instance) {
      LocalStorageService.instance = new LocalStorageService();
    }
    return LocalStorageService.instance;
  }

  private initializeStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        this.saveData({
          closureEvents: [],
          lastSync: new Date().toISOString(),
          version: STORAGE_VERSION
        });
      }
    } catch (error) {
      console.error('Failed to initialize storage:', error);
      throw new StorageError('Failed to initialize storage');
    }
  }

  private saveData(data: LocalStorageSchema & { version: string }): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save data:', error);
      throw new StorageError('Failed to save data to localStorage');
    }
  }

  private getData(): LocalStorageSchema & { version: string } {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        throw new StorageError('No data found in storage');
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to get data:', error);
      throw new StorageError('Failed to retrieve data from localStorage');
    }
  }

  getEvents(): ClosureEvent[] {
    try {
      const { closureEvents } = this.getData();
      return closureEvents;
    } catch (error) {
      console.error('Failed to get events:', error);
      return [];
    }
  }

  saveEvent(event: Omit<ClosureEvent, 'id'>): ClosureEvent {
    try {
      const data = this.getData();
      if (data.closureEvents.length >= MAX_EVENTS) {
        throw new StorageError('Maximum storage limit reached');
      }

      const newEvent: ClosureEvent = {
        ...event,
        id: crypto.randomUUID(),
        lastUpdated: new Date().toISOString()
      };

      data.closureEvents.push(newEvent);
      data.lastSync = new Date().toISOString();
      this.saveData(data);

      return newEvent;
    } catch (error) {
      console.error('Failed to save event:', error);
      throw error instanceof StorageError ? error : new StorageError('Failed to save event');
    }
  }

  updateEvent(event: ClosureEvent): ClosureEvent {
    try {
      const data = this.getData();
      const index = data.closureEvents.findIndex(e => e.id === event.id);
      
      if (index === -1) {
        throw new StorageError('Event not found');
      }

      const updatedEvent = {
        ...event,
        lastUpdated: new Date().toISOString()
      };

      data.closureEvents[index] = updatedEvent;
      data.lastSync = new Date().toISOString();
      this.saveData(data);

      return updatedEvent;
    } catch (error) {
      console.error('Failed to update event:', error);
      throw error instanceof StorageError ? error : new StorageError('Failed to update event');
    }
  }

  deleteEvent(id: string): void {
    try {
      const data = this.getData();
      const index = data.closureEvents.findIndex(e => e.id === id);
      
      if (index === -1) {
        throw new StorageError('Event not found');
      }

      data.closureEvents.splice(index, 1);
      data.lastSync = new Date().toISOString();
      this.saveData(data);
    } catch (error) {
      console.error('Failed to delete event:', error);
      throw error instanceof StorageError ? error : new StorageError('Failed to delete event');
    }
  }

  clearEvents(): void {
    try {
      const data = this.getData();
      data.closureEvents = [];
      data.lastSync = new Date().toISOString();
      this.saveData(data);
    } catch (error) {
      console.error('Failed to clear events:', error);
      throw error instanceof StorageError ? error : new StorageError('Failed to clear events');
    }
  }

  getStorageInfo(): { used: number; total: number; version: string } {
    try {
      const data = this.getData();
      return {
        used: data.closureEvents.length,
        total: MAX_EVENTS,
        version: data.version
      };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return {
        used: 0,
        total: MAX_EVENTS,
        version: STORAGE_VERSION
      };
    }
  }
}
