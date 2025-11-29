'use client';

import Image from 'next/image';
import Link from 'next/link';

import { ProjectData } from '@/data/projects';

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
          className="rounded-[20px] p-6 relative overflow-hidden flex gap-6"
          style={{
            background:
              'linear-gradient(135deg, rgba(35, 35, 35, 0.9) 0%, rgba(35, 45, 40, 0.9) 100%)',
            border: '1px solid rgba(0, 168, 81, 0.3)',
          }}
        >
          {/* Left Section - ~70% width */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Title and Date */}
            <h3 className="text-2xl font-unbounded font-semibold text-white leading-tight mb-1">
              {project.title}
            </h3>
            <p className="text-sm font-miracode text-white/60 mb-4">
              {project.date}
            </p>

            {/* Image with description overlay */}
            <div className="relative w-full h-[200px] rounded-[16px] overflow-hidden mb-4">
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
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-sm font-montserrat text-white/90 line-clamp-2">
                  {project.description}
                </p>
              </div>
            </div>

            {/* Tags and Arrow button row */}
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-4 flex-wrap">
                {project.tags.slice(0, 5).map((tag, index) => (
                  <span
                    key={index}
                    className="text-sm font-miracode text-white/50"
                  >
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
              <button className="w-[48px] h-[48px] bg-[#00A851] rounded-full flex items-center justify-center hover:bg-[#008f45] transition-colors flex-shrink-0">
                <Image
                  src="/images/arrow.svg"
                  width={24}
                  height={24}
                  alt="Arrow"
                />
              </button>
            </div>
          </div>

          {/* Right Section - Info Panel */}
          <div className="w-[180px] flex-shrink-0 flex flex-col gap-4">
            {/* Stage */}
            <div className="flex flex-col gap-2">
              <span className="text-base font-unbounded text-white">
                Стадия:
              </span>
              <div className="px-4 py-2 rounded-full bg-[#2a2a2a] border border-white/20 text-center">
                <span className="text-sm font-unbounded text-white">
                  {project.stage || 'прототип'}
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-2">
              <span className="text-base font-unbounded text-white">
                Статус:
              </span>
              <div className="px-4 py-2 rounded-full bg-[#2a2a2a] border border-white/20 text-center">
                <span className="text-sm font-unbounded text-white">
                  {project.status || 'прототип'}
                </span>
              </div>
            </div>

            {/* Team */}
            <div className="flex flex-col gap-2">
              <span className="text-base font-unbounded text-white">
                Команда:
              </span>
              <div className="px-4 py-2 rounded-full bg-[#2a2a2a] border border-white/20 text-center">
                <span className="text-sm font-unbounded text-white">
                  {project.teamSize || 'до 20 чел'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
