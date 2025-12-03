'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils';

export interface FilterValues {
  date: string[];
  category: string[];
  stage: string[];
  tags: string[];
}

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onFiltersChange: (filters: FilterValues) => void;
  className?: string;
}

const dateOptions = ['самые новые', 'самые старые'];
const categoryOptions = [
  'технологии',
  'финансы',
  'медицина и биотех',
  'сервисы и образование',
  'промышленность',
  'экология и социум',
];
const stageOptions = ['идея', 'прототип', 'разработка', 'MVP', 'бета'];

export function FilterPanel({
  isOpen,
  onClose,
  onFiltersChange,
  className,
}: FilterPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<FilterValues>({
    date: [],
    category: [],
    stage: [],
    tags: [],
  });

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');

  // Close panel when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const toggleFilter = (key: 'date' | 'category' | 'stage', value: string) => {
    setFilters(prev => {
      const current = prev[key];
      const newValues = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [key]: newValues };
    });
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !filters.tags.includes(trimmedTag)) {
      setFilters(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag],
      }));
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  const handleSave = () => {
    onFiltersChange(filters);
    onClose();
  };

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const hasChanges =
    filters.date.length > 0 ||
    filters.category.length > 0 ||
    filters.stage.length > 0 ||
    filters.tags.length > 0;

  const getDisplayValue = (key: 'date' | 'category' | 'stage') => {
    const values = filters[key];
    if (values.length === 0) return 'выбрать';
    if (values.length === 1) return values[0];
    return `${values.length} выбрано`;
  };

  // Close dropdown when clicking on empty area in panel
  const handlePanelClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    // Don't close if clicking on a button (dropdown toggle buttons)
    if (target.closest('button')) {
      return;
    }

    // Don't close if clicking inside a dropdown content area
    // (dropdown content has stopPropagation, but being extra safe)
    if (target.closest('.absolute.right-0')) {
      return;
    }

    // Close dropdown only if clicking on the panel background or empty space
    setOpenDropdown(null);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className={cn(
        'absolute top-full left-0 sm:left-auto sm:right-0 mt-2 z-50 animate-slide-up',
        'w-full sm:w-[420px] max-w-[calc(100vw-2rem)]',
        className
      )}
    >
      <div
        className="relative p-4 sm:p-6 rounded-[16px] bg-[#1A1A1A] filter-panel-content"
        onClick={handlePanelClick}
        style={{
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Title */}
        <h2 className="font-unbounded text-lg sm:text-xl font-normal mb-6 sm:mb-8 text-white">
          Фильтры
        </h2>

        {/* Filters */}
        <div className="space-y-6">
          {/* Date Filter */}
          <FilterRow
            label="по дате"
            displayValue={getDisplayValue('date')}
            isOpen={openDropdown === 'date'}
            onToggle={() => toggleDropdown('date')}
          >
            <CheckboxDropdown
              options={dateOptions}
              selected={filters.date}
              onToggle={value => toggleFilter('date', value)}
            />
          </FilterRow>

          {/* Category Filter */}
          <FilterRow
            label="категория"
            displayValue={getDisplayValue('category')}
            isOpen={openDropdown === 'category'}
            onToggle={() => toggleDropdown('category')}
          >
            <CheckboxDropdown
              options={categoryOptions}
              selected={filters.category}
              onToggle={value => toggleFilter('category', value)}
            />
          </FilterRow>

          {/* Stage Filter */}
          <FilterRow
            label="этап разработки"
            displayValue={getDisplayValue('stage')}
            isOpen={openDropdown === 'stage'}
            onToggle={() => toggleDropdown('stage')}
          >
            <CheckboxDropdown
              options={stageOptions}
              selected={filters.stage}
              onToggle={value => toggleFilter('stage', value)}
            />
          </FilterRow>

          {/* Tags Filter */}
          <FilterRow
            label="по тегам"
            displayValue="введите тег"
            isOpen={openDropdown === 'tags'}
            onToggle={() => toggleDropdown('tags')}
          >
            <div
              className="p-3 bg-[#2A2A2A] rounded-xl border border-gray-700"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative mb-3">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Image
                    src="/images/search.svg"
                    alt="search"
                    width={16}
                    height={16}
                    className="opacity-50"
                  />
                </div>
                <input
                  type="text"
                  placeholder="введите тег"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      addTag(tagInput);
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2 bg-[#3A3A3A] rounded-lg text-white placeholder-gray-500 font-unbounded text-sm outline-none"
                />
              </div>
              {filters.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {filters.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#3A3A3A] rounded-full text-white font-unbounded text-xs"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-400 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </FilterRow>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className={cn(
            'w-full mt-6 sm:mt-8 px-6 py-3 sm:py-4 rounded-[12px] text-white font-unbounded text-sm sm:text-base transition-all min-h-[44px]',
            hasChanges
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
              : 'bg-[#2A2A2A] hover:bg-[#333]'
          )}
        >
          сохранить изменения
        </button>
      </div>
    </div>
  );
}

interface FilterRowProps {
  label: string;
  displayValue: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function FilterRow({
  label,
  displayValue,
  isOpen,
  onToggle,
  children,
}: FilterRowProps) {
  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <span className="font-unbounded text-sm sm:text-base text-gray-400">
          {label}
        </span>
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center gap-2 text-white font-unbounded text-xs sm:text-sm hover:text-gray-300 transition-colors min-h-[44px]"
        >
          <span className="truncate max-w-[120px] sm:max-w-none">
            {displayValue}
          </span>
          <svg
            className={cn(
              'w-4 h-4 transition-transform flex-shrink-0',
              isOpen && 'rotate-180'
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
      {isOpen && (
        <div
          className="absolute right-0 top-8 z-50 w-full sm:min-w-[280px] rounded-xl overflow-hidden"
          onClick={e => e.stopPropagation()}
          style={{
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

interface CheckboxDropdownProps {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}

function CheckboxDropdown({
  options,
  selected,
  onToggle,
}: CheckboxDropdownProps) {
  return (
    <div className="bg-[#2A2A2A] rounded-xl overflow-hidden border border-gray-700 max-h-[300px] overflow-y-auto">
      {options.map(option => (
        <button
          type="button"
          key={option}
          onClick={() => onToggle(option)}
          className="w-full flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-[#3A3A3A] transition-colors min-h-[44px]"
        >
          <span className="font-unbounded text-xs sm:text-sm text-white text-left pr-2">
            {option}
          </span>
          <div
            className={cn(
              'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0',
              selected.includes(option)
                ? 'bg-white border-white'
                : 'border-gray-500 bg-transparent'
            )}
          >
            {selected.includes(option) && (
              <svg
                className="w-3 h-3 text-[#2A2A2A]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
