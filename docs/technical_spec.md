# Technical Specification - Cẩm Dương TPHCM

## Kiến trúc ứng dụng

### 1. Cấu trúc thư mục
```
camduongtphcm/
├── src/
│   ├── components/        # React components
│   │   ├── common/       # Shared components
│   │   ├── map/         # Map related components
│   │   └── search/      # Search related components
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Helper functions
│   ├── types/           # TypeScript definitions
│   ├── services/        # Local storage service
│   ├── constants/       # App constants
│   └── styles/          # Global styles
├── public/             # Static assets
└── docs/              # Documentation
```

### 2. Tech Stack
- **Frontend Framework:** React 18 với Next.js 14
- **Type System:** TypeScript
- **Styling:** Tailwind CSS
- **Map Integration:** Leaflet.js
- **State Management:** React Context + localStorage
- **Package Manager:** pnpm
- **Development Tools:** ESLint, Prettier

## Chi tiết triển khai

### 1. Local Storage Schema
```typescript
// types/models.ts
interface ClosureEvent {
  id: string;
  street: string;
  area: string;
  startTime: string;
  endTime: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  affectedAreas: string[];
  lastUpdated: string;
}

interface LocalStorageSchema {
  closureEvents: ClosureEvent[];
  lastSync: string;
}
```

### 2. Core Components

#### Map Component
```typescript
// components/map/MapView.tsx
interface MapViewProps {
  events: ClosureEvent[];
  onEventClick: (event: ClosureEvent) => void;
}
```
- Hiển thị bản đồ toàn màn hình sử dụng Leaflet
- Render các marker cho mỗi sự kiện đóng đường
- Hỗ trợ zoom và pan
- Hiển thị popup khi click vào marker

#### Search Component
```typescript
// components/search/SearchBar.tsx
interface SearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}
```
- Thanh tìm kiếm với auto-complete
- Lọc theo tên đường và khu vực
- Debounce input để tối ưu hiệu suất

#### Event Detail Component
```typescript
// components/common/EventDetail.tsx
interface EventDetailProps {
  event: ClosureEvent;
  onClose: () => void;
}
```
- Modal/Sidebar hiển thị thông tin chi tiết
- Thời gian bắt đầu/kết thúc
- Mô tả và khu vực ảnh hưởng

### 3. Local Storage Service
```typescript
// services/localStorage.ts
interface StorageService {
  getEvents(): ClosureEvent[];
  saveEvent(event: ClosureEvent): void;
  updateEvent(event: ClosureEvent): void;
  deleteEvent(id: string): void;
  clearEvents(): void;
}
```

### 4. Hooks tùy chỉnh
```typescript
// hooks/useEvents.ts
const useEvents = () => {
  const [events, setEvents] = useState<ClosureEvent[]>([]);
  // Logic để quản lý events từ localStorage
};

// hooks/useSearch.ts
const useSearch = (events: ClosureEvent[]) => {
  const [results, setResults] = useState<ClosureEvent[]>([]);
  // Logic tìm kiếm và lọc events
};
```

## Responsive Design
- Mobile First approach
- Breakpoints:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
- Adaptive layout cho map controls
- Collapsible sidebar trên mobile

## Performance Optimization
1. **Code Splitting**
   - Lazy loading cho components không cần thiết ngay lập tức
   - Dynamic imports cho heavy components

2. **Caching**
   - localStorage versioning
   - Memoization cho expensive calculations

3. **Map Optimization**
   - Clustering markers khi zoom out
   - Lazy loading map tiles
   - Debounced map events

## Error Handling
```typescript
// types/errors.ts
enum ErrorType {
  STORAGE_FULL = 'STORAGE_FULL',
  INVALID_DATA = 'INVALID_DATA',
  MAP_LOAD_FAILED = 'MAP_LOAD_FAILED'
}

interface AppError {
  type: ErrorType;
  message: string;
  timestamp: string;
}
```

## Testing Strategy
1. **Unit Tests**
   - Components
   - Hooks
   - Utils
   - Storage service

2. **Integration Tests**
   - Map interactions
   - Search functionality
   - Event management flow

3. **E2E Tests**
   - User flows
   - Responsive design
   - Offline functionality

## Build & Deployment
- **Build Process:**
  ```bash
  pnpm install
  pnpm build
  pnpm start
  ```

- **Environment Variables:**
  ```env
  NEXT_PUBLIC_MAP_TILE_URL=
  NEXT_PUBLIC_DEFAULT_CENTER_LAT=
  NEXT_PUBLIC_DEFAULT_CENTER_LNG=
  NEXT_PUBLIC_DEFAULT_ZOOM=
  ```

## Browser Support
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome for Android)
