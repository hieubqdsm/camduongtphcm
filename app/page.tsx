'use client';

import { Suspense, useEffect, useState } from 'react';
import Loading from './components/common/Loading';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import ClientMapView from './components/map/ClientMapView';
import { LocalStorageService } from './services/localStorage';
import type { ClosureEvent } from './types/models';

export default function Home() {
  const [events, setEvents] = useState<ClosureEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
          <ClientMapView events={events} />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}
