'use client';

import { useState } from 'react';
import Image from 'next/image';

import { FilterPanel, FilterValues } from '@/components/ui/FilterPanel';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onFiltersChange?: (filters: FilterValues) => void;
}

export function SearchBar({
  searchQuery,
  onSearchChange,
  onFiltersChange,
}: SearchBarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleFiltersChange = (filters: FilterValues) => {
    onFiltersChange?.(filters);
  };

  return (
    <div className="relative z-20 mb-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative">
          <div
            className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl"
            style={{ borderRadius: '16px' }}
          >
            <Image
              src="/images/search.svg"
              alt="search"
              width={24}
              height={24}
              className="text-white"
            />
            <input
              style={{ outline: 'none' }}
              type="text"
              placeholder="Введите запрос"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-gray-400 font-unbounded text-sm outline-none"
            />
            <div>
              <button
                type="button"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Открыть фильтры"
              >
                <Image
                  src="/images/settings.svg"
                  alt="фильтры"
                  width={24}
                  height={24}
                  className="text-white"
                />
              </button>
            </div>
          </div>

          <FilterPanel
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            onFiltersChange={handleFiltersChange}
          />
        </div>
      </div>
    </div>
  );
}
