'use client';

import { ProjectCard } from '@/components/ui/ProjectCard';
import type { ProjectData } from '@/data/projects';

interface ProjectsGridProps {
  projects: ProjectData[];
  onResetFilters: () => void;
}

export function ProjectsGrid({ projects, onResetFilters }: ProjectsGridProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-white/60 font-montserrat text-lg mb-6">
          Проекты не найдены по выбранным критериям
        </p>
        <button
          onClick={onResetFilters}
          className="px-8 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white font-unbounded hover:bg-white/30 transition-all duration-300 hover:scale-105"
        >
          Сбросить фильтры
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* 2-column grid layout matching Figma design - cards 663x368 with visible spacing */}
      <div className="flex justify-center px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[663px_663px] gap-8 lg:gap-8 w-full lg:w-auto">
          {projects.map((project: ProjectData) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      {/* Информация о количестве проектов */}
      <div className="mt-12 text-center">
        <p className="text-white/60 font-montserrat text-sm">
          Найдено проектов: {projects.length}
        </p>
      </div>
    </div>
  );
}
