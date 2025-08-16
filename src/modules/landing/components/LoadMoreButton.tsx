'use client';

interface LoadMoreButtonProps {
  hasProjects: boolean;
}

export function LoadMoreButton({ hasProjects }: LoadMoreButtonProps) {
  if (!hasProjects) return null;

  return (
    <div className="text-center mt-16">
      <button className="mt-4 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white font-unbounded hover:bg-white/30 transition-all">
        смотреть еще
      </button>
    </div>
  );
}
