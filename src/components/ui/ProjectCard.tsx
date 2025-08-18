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
        className={`relative group transition-all duration-300 ${className} w-full`}
      >
        <div
          className="backdrop-blur-[14.34px] rounded-[20px] p-[14.34px] h-full relative overflow-hidden flex flex-col"
          style={{
            background:
              'linear-gradient(229deg, rgba(35, 35, 35, 1) 0%, rgba(47, 131, 94, 1) 100%)',
            boxShadow:
              '0px 2.87px 7.17px 0px rgba(0, 0, 0, 0.25), inset 0px 2.65px 5.31px 0px rgba(255, 255, 255, 0.05), 0 0 0 0.66px rgba(179, 179, 179, 0.3)',
          }}
        >
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
        <div
          className="backdrop-blur-[14.34px] rounded-[20px] p-[14.34px] h-full relative overflow-hidden flex flex-col"
          style={{
            background:
              'linear-gradient(229deg, rgba(35, 35, 35, 1) 0%, rgba(47, 131, 94, 1) 100%)',
            boxShadow:
              '0px 2.87px 7.17px 0px rgba(0, 0, 0, 0.25), inset 0px 2.65px 5.31px 0px rgba(255, 255, 255, 0.05), 0 0 0 0.66px rgba(179, 179, 179, 0.3)',
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
    <div
      className={`relative group transition-all duration-300 hover:scale-105 ${className} w-full`}
    >
      <div
        className="backdrop-blur-[14.34px] rounded-[20px] p-[14.34px] relative overflow-hidden flex flex-col h-full"
        style={{
          background:
            'linear-gradient(229deg, rgba(35, 35, 35, 1) 0%, rgba(47, 131, 94, 1) 100%)',
          boxShadow:
            '0px 2.87px 7.17px 0px rgba(0, 0, 0, 0.25), inset 0px 2.65px 5.31px 0px rgba(255, 255, 255, 0.05), 0 0 0 0.66px rgba(179, 179, 179, 0.3)',
        }}
      >
        {/* Header with title and date */}
        <div className="flex flex-col gap-[4.3px] mb-[14.34px] flex-shrink-0">
          <h3
            className="text-base font-unbounded font-medium text-white leading-[1.24] cursor-pointer truncate"
            title={project.title}
          >
            {project.title}
          </h3>
          <p className="text-[8.6px] font-miracode text-white/80 leading-[1.51]">
            {project.date}
          </p>
        </div>

        {/* Image container */}
        <div className="relative w-full h-[195px] rounded-[21.5px] overflow-hidden mb-[14.34px] flex-shrink-0">
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
              className="absolute top-[7.17px] left-[7.17px] px-[7.17px] py-[7.17px] bg-transparent backdrop-blur-sm rounded-lg flex items-center justify-center"
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
          <div className="absolute bottom-[7.17px] left-[5.74px] right-[5.74px] p-[7.17px]">
            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-[7.17px]">
              <p className="text-[12.44px] font-montserrat text-white leading-[1.22] line-clamp-3">
                {project.description}
              </p>
            </div>
          </div>
        </div>

        {/* Footer with tags and like button */}
        <div className="flex items-center justify-between mt-auto flex-shrink-0 gap-[35.85px]">
          {/* Tags */}
          <div className="flex items-center gap-[18.64px] flex-wrap flex-1 min-w-0">
            {project.tags &&
              project.tags.slice(0, 5).map((tag, index) => (
                <span
                  key={index}
                  className="text-[8.6px] font-miracode text-white/70 leading-[1.51] whitespace-nowrap"
                >
                  #{tag}
                </span>
              ))}
            {project.tags && project.tags.length > 5 && (
              <span className="text-[8.6px] font-miracode text-white/50 leading-[1.51]">
                +{project.tags.length - 5}
              </span>
            )}
          </div>

          {/* Like button */}
          <button
            className="w-[38px] h-[38px] bg-[#00A851] backdrop-blur-[14.34px] rounded-[19px] flex items-center justify-center hover:bg-[#008f45] transition-colors flex-shrink-0"
            style={{
              boxShadow:
                '0px 2.87px 7.17px 0px rgba(0, 0, 0, 0.25), inset 0px 2.65px 5.31px 0px rgba(255, 255, 255, 0.05)',
            }}
          >
            <Image
              src="/images/arrow.svg"
              width="18"
              height="18"
              alt="Arrow icon"
              className="w-[18px] h-[18px]"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
