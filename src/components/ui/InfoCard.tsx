'use client';

interface InfoCardProps {
  title: string;
  description?: string;
  className?: string;
}

export function InfoCard({
  title,
  description,
  className = '',
}: InfoCardProps) {
  return (
    <div
      className={`bg-gradient-to-br from-gray-500/50 to-gray-200/100 backdrop-blur-sm border border-white/30 rounded-[40px] p-8 hover:scale-105 transition-transform duration-300 ${className}`}
    >
      <h3 className="text-xl font-bold text-white mb-4 font-unbounded">
        {title}
      </h3>
      {description && (
        <p className="text-white/80 font-montserrat">{description}</p>
      )}
    </div>
  );
}
