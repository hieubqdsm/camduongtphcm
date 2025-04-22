'use client';

import { useState, useCallback } from 'react';
import type { SearchBarProps, SearchFilters } from '@/app/types/models';
import { useDebounce } from '@/app/hooks/useDebounce';

export default function SearchBar({ onSearch, loading = false, placeholder = 'Tìm kiếm theo tên đường hoặc khu vực...' }: SearchBarProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    street: '',
    area: '',
  });

  const debouncedSearch = useDebounce((newFilters: SearchFilters) => {
    onSearch(newFilters);
  }, 300);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    debouncedSearch(newFilters);
  }, [filters, debouncedSearch]);

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            name="street"
            value={filters.street}
            onChange={handleInputChange}
            placeholder="Tên đường..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>
        <div className="flex-1">
          <input
            type="text"
            name="area"
            value={filters.area}
            onChange={handleInputChange}
            placeholder="Khu vực..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>
      </div>
      {loading && (
        <div className="mt-2 text-center text-sm text-gray-500">
          Đang tìm kiếm...
        </div>
      )}
    </div>
  );
}
