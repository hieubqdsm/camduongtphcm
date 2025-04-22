# Cẩm Dương TPHCM

Ứng dụng web hiển thị thông tin đóng đường tại TPHCM.

## Cài đặt

```bash
# Cài đặt dependencies
pnpm install

# Tạo file môi trường
cp docs/env.example .env.local

# Chạy môi trường development
pnpm dev

# Build cho production
pnpm build
pnpm start
```

## Cấu trúc thư mục

```
src/
├── components/     # React components
│   ├── common/    # Shared components
│   ├── map/       # Map related components
│   └── search/    # Search related components
├── hooks/         # Custom React hooks
├── utils/         # Helper functions
├── services/      # Local storage service
├── constants/     # App constants
└── styles/        # Global styles
```

## Công nghệ sử dụng

- Next.js 14
- React 19
- TypeScript
- Tailwind CSS
- Leaflet.js
- React Leaflet

## Môi trường

Tạo file `.env.local` với các biến môi trường sau:

```env
NEXT_PUBLIC_MAP_TILE_URL=
NEXT_PUBLIC_DEFAULT_CENTER_LAT=
NEXT_PUBLIC_DEFAULT_CENTER_LNG=
NEXT_PUBLIC_DEFAULT_ZOOM=
```

## License

MIT