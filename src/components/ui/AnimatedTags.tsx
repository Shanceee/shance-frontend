'use client';

import { useEffect, useState } from 'react';

export function AnimatedTags() {
  const [tags, setTags] = useState([
    { id: 1, text: '#команда', x: 10, y: 20, delay: 0 },
    { id: 2, text: '#стартап', x: 80, y: 60, delay: 1000 },
    { id: 3, text: '#проекты', x: 20, y: 80, delay: 2000 },
    { id: 4, text: '#инвесторы', x: 70, y: 30, delay: 3000 },
    { id: 5, text: '#Инновации', x: 30, y: 70, delay: 4000 },
    { id: 6, text: '#Платформа', x: 60, y: 50, delay: 5000 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTags(prevTags =>
        prevTags.map(tag => ({
          ...tag,
          x: Math.random() * 80 + 10, // Ограничиваем позиции от 10% до 90%
          y: Math.random() * 80 + 10,
        }))
      );
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {tags.map(tag => (
        <div
          key={tag.id}
          className="absolute text-white/20 text-sm font-medium animate-pulse font-miracode"
          style={{
            left: `${tag.x}%`,
            top: `${tag.y}%`,
            animationDelay: `${tag.delay}ms`,
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
          }}
        >
          {tag.text}
        </div>
      ))}
    </div>
  );
}
