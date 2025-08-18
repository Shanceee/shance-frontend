'use client';

import Image from 'next/image';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
  return (
    <div className="relative z-10 mb-8">
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
            <button
              type="button"
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
      </div>
    </div>
  );
}
