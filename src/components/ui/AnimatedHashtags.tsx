'use client';

import { useState, useEffect } from 'react';

interface AnimatedHashtagsProps {
  tags: string[];
  activeTagIndex?: number;
  className?: string;
}

export function AnimatedHashtags({
  tags,
  activeTagIndex = 0,
  className = '',
}: AnimatedHashtagsProps) {
  const [currentActiveIndex, setCurrentActiveIndex] = useState(activeTagIndex);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActiveIndex(prev => (prev + 1) % tags.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [tags.length]);

  return (
    <div className={`flex flex-wrap justify-center gap-4 ${className}`}>
      {tags.map((tag, index) => (
        <span
          key={tag}
          className={`px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/70 text-sm font-medium transition-all duration-500 font-miracode ${
            index === currentActiveIndex
              ? 'bg-white/30 text-white scale-110'
              : 'hover:bg-white/20 hover:text-white'
          }`}
        >
          #{tag}
        </span>
      ))}
    </div>
  );
}
