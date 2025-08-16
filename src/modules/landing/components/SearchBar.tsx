'use client';

import Image from 'next/image';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
  return (
    <div className="relative z-10 px-10 mb-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative">
          <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl">
            <Image
              src="/images/search.svg"
              alt="search"
              width={24}
              height={24}
              className="text-white"
            />
            <input
              type="text"
              placeholder="Введите запрос"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-gray-400 font-unbounded text-sm outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
