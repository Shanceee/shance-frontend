'use client';

import Image from 'next/image';

import { ProjectData } from '@/data/projects';

export interface ProjectCardProps {
  project: ProjectData;
  className?: string;
}

export function ProjectCard({ project, className = '' }: ProjectCardProps) {
  // Проверка на существование проекта
  if (!project) {
    return (
      <div
        className={`relative group transition-all duration-300 ${className} rounded-5xl w-full`}
      >
        <div className="bg-gradient-to-br from-[#232323] to-[#2f835e] backdrop-blur-sm border border-white/30 rounded-5xl p-4 h-full relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-center h-full">
            <p className="text-white/60 font-montserrat">Проект не найден</p>
          </div>
        </div>
      </div>
    );
  }

  // Проверка на корректность структуры проекта
  if (!project.title || !project.description || !project.tags) {
    return (
      <div
        className={`relative group transition-all duration-300 ${className} w-full`}
      >
        <div className="bg-gradient-to-br from-[#232323] to-[#2f835e] backdrop-blur-sm border border-white/30 rounded-5xl p-4 h-full relative overflow-hidden shadow-lg">
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
    <div
      className={`relative group transition-all duration-300 hover:scale-105 ${className} w-full`}
    >
      <div
        className="bg-gradient-to-br from-[#232323] to-[#2f835e] backdrop-blur-[14px] border rounded-[20px] p-3 sm:p-4 relative overflow-hidden shadow-lg h-full flex flex-col"
        style={{
          borderImage:
            'linear-gradient(109deg, rgba(179, 179, 179, 0.3) 0%, rgba(33, 33, 33, 0.1) 31%, rgba(52, 52, 52, 0.1) 69%, rgba(179, 179, 179, 0.3) 100%)',
          boxShadow:
            '0px 2.87px 7.17px 0px rgba(0, 0, 0, 0.25), inset 0px 2.65px 5.31px 0px rgba(255, 255, 255, 0.05)',
        }}
      >
        {/* Header with title and date */}
        <div className="flex flex-col gap-1 mb-3 sm:mb-4 flex-shrink-0">
          <h3 className="text-sm sm:text-base font-unbounded font-medium text-white leading-tight line-clamp-2">
            {project.title}
          </h3>
          <p className="text-xs font-miracode text-white/80 leading-tight">
            {project.date}
          </p>
        </div>

        {/* Image container */}
        <div className="relative w-full h-32 sm:h-40 lg:h-48 rounded-xl sm:rounded-2xl overflow-hidden mb-3 sm:mb-4 flex-shrink-0">
          <Image
            src={project.imageSrc}
            alt={project.imageAlt}
            fill
            className="object-cover"
            onError={e => {
              // Fallback для изображения
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />

          {/* Prototype badge if applicable */}
          {project.isPrototype && (
            <div
              className="absolute top-2 sm:top-3 left-2 sm:left-3 px-3 sm:px-4 py-2 bg-transparent backdrop-blur-sm rounded-lg flex items-center justify-center"
              style={{
                border: '2px solid',
                borderImage:
                  'linear-gradient(89deg, rgba(179, 179, 179, 0.5) 0%, rgba(33, 33, 33, 0.2) 21%, rgba(52, 52, 52, 0.2) 50%, rgba(179, 179, 179, 0.5) 79%) 1',
              }}
            >
              <span className="text-xs font-unbounded text-white leading-tight">
                прототип
              </span>
            </div>
          )}

          {/* Description overlay */}
          <div className="absolute bottom-2 left-2 right-2 p-2">
            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-2">
              <p className="text-xs sm:text-sm font-montserrat text-white leading-tight line-clamp-3">
                {project.description}
              </p>
            </div>
          </div>
        </div>

        {/* Footer with tags and like button */}
        <div className="flex items-center justify-between mt-auto flex-shrink-0">
          {/* Tags */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap flex-1 min-w-0">
            {project.tags &&
              project.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs font-miracode text-white/70 leading-tight whitespace-nowrap"
                >
                  #{tag}
                </span>
              ))}
            {project.tags && project.tags.length > 3 && (
              <span className="text-xs font-miracode text-white/50 leading-tight">
                +{project.tags.length - 3}
              </span>
            )}
          </div>

          {/* Like button */}
          <button className="w-8 h-8 sm:w-10 sm:h-10 bg-[#00A851] backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-[#008f45] transition-colors flex-shrink-0 ml-2">
            <Image
              src="/images/arrow.svg"
              width="16"
              height="16"
              alt="Arrow icon"
              className="w-4 h-4 sm:w-5 sm:h-5"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
