'use client';

import { useState, useRef, useEffect, useMemo } from 'react';

import { cn } from '@/lib/utils';
import type { Tag } from '@/types/api';

interface TagSearchDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTags: Tag[];
  availableTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  className?: string;
  title?: string;
}

export function TagSearchDropdown({
  isOpen,
  onClose,
  selectedTags,
  availableTags,
  onTagsChange,
  searchQuery,
  onSearchChange,
  className,
  title = 'Тэги',
}: TagSearchDropdownProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [localSelectedTags, setLocalSelectedTags] = useState<Tag[]>(selectedTags);

  // Sync local state with props
  useEffect(() => {
    setLocalSelectedTags(selectedTags);
  }, [selectedTags]);

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

  // Filter out already selected tags
  const filteredTags = useMemo(() => {
    return availableTags.filter(
      tag => !localSelectedTags.some(st => st.id === tag.id)
    );
  }, [availableTags, localSelectedTags]);

  const handleAddTag = (tag: Tag) => {
    setLocalSelectedTags(prev => [...prev, tag]);
    onSearchChange('');
  };

  const handleRemoveTag = (tagId: number) => {
    setLocalSelectedTags(prev => prev.filter(t => t.id !== tagId));
  };

  const handleSave = () => {
    onTagsChange(localSelectedTags);
    onClose();
  };

  const hasChanges = localSelectedTags.length !== selectedTags.length ||
    localSelectedTags.some(t => !selectedTags.find(st => st.id === t.id));

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className={cn(
        'absolute top-full left-0 mt-2 z-50 animate-slide-up',
        'w-full max-w-[488px]',
        className
      )}
    >
      <div
        className="relative p-5 rounded-[20px] bg-[#1A1A1A]"
        style={{
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          border: '3px solid transparent',
          backgroundImage: `linear-gradient(#1A1A1A, #1A1A1A), linear-gradient(89deg, rgba(179, 179, 179, 0.5) 0%, rgba(33, 33, 33, 0.2) 21%, rgba(52, 52, 52, 0.2) 50%, rgba(179, 179, 179, 0.5) 79%)`,
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        }}
      >
        {/* Tags section */}
        <div className="space-y-4">
          {/* Search input */}
          <div
            className="flex items-center gap-3 px-4 h-[52px] rounded-xl"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <svg
              width="28"
              height="29"
              viewBox="0 0 28 29"
              fill="none"
              className="flex-shrink-0 opacity-30"
            >
              <path
                d="M12.8333 22.1667C17.8039 22.1667 21.8333 18.1373 21.8333 13.1667C21.8333 8.19607 17.8039 4.16669 12.8333 4.16669C7.86274 4.16669 3.83334 8.19607 3.83334 13.1667C3.83334 18.1373 7.86274 22.1667 12.8333 22.1667Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M24.1667 24.5L19.25 19.5833"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              placeholder="введите тег"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className="flex-1 bg-transparent text-white font-unbounded text-sm placeholder:text-white/30 outline-none"
            />
          </div>

          {/* Search results dropdown */}
          {searchQuery.length > 0 && filteredTags.length > 0 && (
            <div className="max-h-[150px] overflow-y-auto space-y-1">
              {filteredTags.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleAddTag(tag)}
                  className="w-full px-4 py-2 text-left text-white/60 font-miracode text-sm hover:bg-white/5 rounded-lg transition-colors"
                >
                  {tag.name}
                </button>
              ))}
            </div>
          )}

          {/* Selected tags */}
          {localSelectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {localSelectedTags.map(tag => (
                <div
                  key={tag.id}
                  className="flex items-center gap-2 px-3.5 py-2.5 h-[34px] rounded-[14px]"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid transparent',
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), linear-gradient(89deg, rgba(179, 179, 179, 0.5) 0%, rgba(33, 33, 33, 0.2) 21%, rgba(52, 52, 52, 0.2) 50%, rgba(179, 179, 179, 0.5) 79%)`,
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box',
                  }}
                >
                  <span className="font-miracode text-xs text-white">
                    {tag.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag.id)}
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    <svg
                      width="8"
                      height="8"
                      viewBox="0 0 8 8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M7 1L1 7M1 1l6 6" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Save button */}
        <button
          type="button"
          onClick={handleSave}
          className={cn(
            'w-full mt-6 py-4 rounded-[20px] text-white font-unbounded text-base transition-all',
            hasChanges
              ? 'hover:opacity-90'
              : 'bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.15)]'
          )}
          style={hasChanges ? {
            background: 'linear-gradient(229deg, rgba(35, 35, 35, 1) 0%, rgba(47, 131, 94, 1) 100%)',
          } : undefined}
        >
          сохранить изменения
        </button>
      </div>
    </div>
  );
}

export default TagSearchDropdown;
