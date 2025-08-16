'use client';

import type { ProjectData } from '@/data/projects';

import { CategoryTags } from './CategoryTags';
import { ProjectsGrid } from './ProjectsGrid';
import { LoadMoreButton } from './LoadMoreButton';

interface ProjectsMainContentProps {
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  filteredProjects: ProjectData[];
  onResetFilters: () => void;
}

export function ProjectsMainContent({
  categories,
  selectedCategory,
  onCategorySelect,
  filteredProjects,
  onResetFilters,
}: ProjectsMainContentProps) {
  return (
    <main className="relative z-10 px-4 sm:px-6 lg:px-8 xl:px-10 pb-16 sm:pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <div className="mb-16">
          <h1 className="text-4xl font-unbounded font-normal bg-gradient-to-t from-gray-600 to-gray-200 bg-clip-text">
            Твои идеальные проекты
          </h1>
        </div>

        {/* Category Tags */}
        <div className="mb-8 sm:mb-12">
          <CategoryTags
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={onCategorySelect}
          />
        </div>

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
