'use client';

import type { ProjectData } from '@/data/projects';

import { SearchBar } from './SearchBar';
import { ProjectsGrid } from './ProjectsGrid';
import { LoadMoreButton } from './LoadMoreButton';

interface ProjectsMainContentProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filteredProjects: ProjectData[];
  onResetFilters: () => void;
}

export function ProjectsMainContent({
  searchQuery,
  onSearchChange,
  filteredProjects,
  onResetFilters,
}: ProjectsMainContentProps) {
  return (
    <main className="relative z-10 px-4 sm:px-6 lg:px-8 xl:px-10 pb-16 sm:pb-20">
      <div className="max-w-7xl mx-auto mb-20">
        {/* Page Title */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-unbounded font-normal leading-tight">
            <span className="bg-gradient-to-t from-gray-400/30 to-white bg-clip-text text-transparent">
              Новинки
            </span>
          </h2>
        </div>

        {/* Search Bar */}
        <SearchBar searchQuery={searchQuery} onSearchChange={onSearchChange} />

        {/* Projects Grid */}
        <div className="mb-8 sm:mb-12">
          <ProjectsGrid
            projects={filteredProjects}
            onResetFilters={onResetFilters}
          />
        </div>

        {/* Load More Button */}
        <div className="text-center">
          <LoadMoreButton hasProjects={filteredProjects.length > 0} />
        </div>
      </div>
    </main>
  );
}
