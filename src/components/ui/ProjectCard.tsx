'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { ProjectData } from '@/data/projects';

// Tooltip component for showing full text on hover
function Tooltip({
  children,
  text,
}: {
  children: React.ReactNode;
  text: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && text && (
        <div className="absolute z-[100] top-full left-0 mt-2 px-3 py-2 bg-[#1a1a1a] border border-white/20 rounded-lg shadow-xl max-w-[350px] pointer-events-none animate-fade-in">
          <p className="text-sm font-montserrat text-white whitespace-pre-wrap break-words">
            {text}
          </p>
        </div>
      )}
    </div>
  );
}

export interface ProjectCardProps {
  project: ProjectData;
  className?: string;
}

export function ProjectCard({ project, className = '' }: ProjectCardProps) {
  // Error handling for missing project
  if (!project) {
    return (
      <div
        className={`relative group transition-all duration-300 ${className} w-full`}
      >
        <div
          className="rounded-[20px] p-6 relative overflow-hidden"
          style={{
            background:
              'linear-gradient(135deg, rgba(35, 35, 35, 0.9) 0%, rgba(35, 45, 40, 0.9) 100%)',
            border: '1px solid rgba(0, 168, 81, 0.3)',
          }}
        >
          <div className="flex items-center justify-center h-full">
            <p className="text-white/60 font-montserrat">Проект не найден</p>
          </div>
        </div>
      </div>
    );
  }

  // Error handling for incomplete project data
  if (!project.title || !project.description || !project.tags) {
    return (
      <div
        className={`relative group transition-all duration-300 ${className} w-full`}
      >
        <div
          className="rounded-[20px] p-6 relative overflow-hidden"
          style={{
            background:
              'linear-gradient(135deg, rgba(35, 35, 35, 0.9) 0%, rgba(35, 45, 40, 0.9) 100%)',
            border: '1px solid rgba(0, 168, 81, 0.3)',
          }}
        >
          <div className="flex items-center justify-center h-full">
            <p className="text-white/60 font-montserrat">
              Неверная структура проекта
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link href={`/projects/${project.id}`}>
      <div
        className={`relative group transition-all duration-300 ${className} w-full`}
      >
        <div
          className="rounded-[20px] p-4 sm:p-6 relative overflow-hidden flex flex-col lg:flex-row gap-4 lg:gap-6 min-h-[350px] lg:h-[420px]"
          style={{
            background:
              'linear-gradient(135deg, rgba(35, 35, 35, 0.9) 0%, rgba(35, 45, 40, 0.9) 100%)',
            border: '1px solid rgba(0, 168, 81, 0.3)',
          }}
        >
          {/* Left Section - main content */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Title and Date */}
            <Tooltip text={project.title}>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-unbounded font-semibold text-white leading-tight mb-1 line-clamp-1 cursor-default">
                {project.title}
              </h3>
            </Tooltip>
            <p className="text-xs sm:text-sm font-miracode text-white/60 mb-3 lg:mb-4 flex-shrink-0">
              {project.date}
            </p>

            {/* Image with description overlay */}
            <div className="relative w-full h-[140px] sm:h-[160px] lg:h-[200px] rounded-[12px] lg:rounded-[16px] overflow-hidden mb-3 lg:mb-4 flex-shrink-0">
              <Image
                src={project.imageSrc}
                alt={project.imageAlt}
                fill
                className="object-cover"
                onError={e => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              {/* Description overlay at bottom */}
              <Tooltip text={project.description}>
                <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-xs sm:text-sm font-montserrat text-white/90 line-clamp-2 cursor-default">
                    {project.description}
                  </p>
                </div>
              </Tooltip>
            </div>

            {/* Tags and Arrow button row */}
            <div className="flex items-center justify-between mt-auto flex-shrink-0">
              <div className="flex items-center gap-2 sm:gap-4 overflow-hidden flex-1 min-w-0">
                {project.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs sm:text-sm font-miracode text-white/50 whitespace-nowrap"
                  >
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </span>
                ))}
                <span className="hidden sm:inline-flex gap-4">
                  {project.tags.slice(3, 5).map((tag, index) => (
                    <span
                      key={index + 3}
                      className="text-sm font-miracode text-white/50 whitespace-nowrap"
                    >
                      {tag.startsWith('#') ? tag : `#${tag}`}
                    </span>
                  ))}
                </span>
              </div>
              <button className="w-10 h-10 sm:w-12 sm:h-12 bg-[#00A851] rounded-full flex items-center justify-center hover:bg-[#008f45] transition-colors flex-shrink-0 ml-2">
                <Image
                  src="/images/arrow.svg"
                  width={20}
                  height={20}
                  alt="Arrow"
                  className="w-5 h-5 sm:w-6 sm:h-6"
                />
              </button>
            </div>
          </div>

          {/* Right Section - Info Panel (hidden on small screens, visible on lg+) */}
          <div className="hidden lg:flex w-[180px] flex-shrink-0 flex-col gap-4">
            {/* Stage */}
            <div className="flex flex-col gap-2">
              <span className="text-base font-unbounded text-white">
                Стадия:
              </span>
              <Tooltip text={project.stage || 'прототип'}>
                <div className="px-4 py-2 rounded-full bg-[#2a2a2a] border border-white/20 text-center overflow-hidden cursor-default">
                  <span className="text-sm font-unbounded text-white truncate block">
                    {project.stage || 'прототип'}
                  </span>
                </div>
              </Tooltip>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-2">
              <span className="text-base font-unbounded text-white">
                Статус:
              </span>
              <Tooltip text={project.status || 'прототип'}>
                <div className="px-4 py-2 rounded-full bg-[#2a2a2a] border border-white/20 text-center overflow-hidden cursor-default">
                  <span className="text-sm font-unbounded text-white truncate block">
                    {project.status || 'прототип'}
                  </span>
                </div>
              </Tooltip>
            </div>

            {/* Team */}
            <div className="flex flex-col gap-2">
              <span className="text-base font-unbounded text-white">
                Команда:
              </span>
              <Tooltip text={project.teamSize || 'до 20 чел'}>
                <div className="px-4 py-2 rounded-full bg-[#2a2a2a] border border-white/20 text-center overflow-hidden cursor-default">
                  <span className="text-sm font-unbounded text-white truncate block">
                    {project.teamSize || 'до 20 чел'}
                  </span>
                </div>
              </Tooltip>
            </div>
          </div>

          {/* Mobile Info Panel - horizontal layout on small screens */}
          <div className="flex lg:hidden gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-unbounded text-white/70">Стадия:</span>
              <span className="text-xs font-unbounded text-white px-2 py-1 rounded-full bg-[#2a2a2a] border border-white/20">
                {project.stage || 'прототип'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-unbounded text-white/70">Статус:</span>
              <span className="text-xs font-unbounded text-white px-2 py-1 rounded-full bg-[#2a2a2a] border border-white/20">
                {project.status || 'прототип'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-unbounded text-white/70">Команда:</span>
              <span className="text-xs font-unbounded text-white px-2 py-1 rounded-full bg-[#2a2a2a] border border-white/20">
                {project.teamSize || 'до 20 чел'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
