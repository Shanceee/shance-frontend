'use client';

import { useState, useMemo } from 'react';
import { Suspense } from 'react';

import { ProjectsMainContent } from '@/modules/landing/projects-page';
import { FooterSection } from '@/modules/landing';
import { PerfectProjectsSlider } from '@/components/ui';
import { projectsData as mockProjects } from '@/data/projects';
import type { FilterValues } from '@/components/ui/FilterPanel';

// Interface for display project format
interface DisplayProject {
  id: string;
  title: string;
  description: string;
  date: string;
  imageSrc: string;
  imageAlt: string;
  tags: string[];
}

// Category mapping from mock data titles to filter options
const categoryMapping: Record<string, string[]> = {
  'мобильное приложение': ['приложение', 'mobile', 'мобильн'],
  'веб-сервис': ['сервис', 'веб', 'web'],
  платформа: ['платформа', 'platform'],
  соцсеть: ['соцсеть', 'социальн', 'друзей', 'vibe'],
};

function ProjectsContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterValues>({
    date: [],
    category: [],
    stage: [],
    tags: [],
  });

  // Combined filtering - search + filters
  const filteredProjects = useMemo(() => {
    let result = [...mockProjects];

    // Apply search query filter
    if (searchQuery.length >= 2) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(project => {
        const titleMatch = project.title.toLowerCase().includes(query);
        const descriptionMatch = project.description
          .toLowerCase()
          .includes(query);
        const tagsMatch = project.tags.some(tag =>
          tag.toLowerCase().includes(query)
        );
        return titleMatch || descriptionMatch || tagsMatch;
      });
    }

    // Apply date filter (sorting)
    if (filters.date.length > 0) {
      if (filters.date.includes('самые новые')) {
        result = [...result].sort((a, b) => {
          const [dayA, monthA, yearA] = a.date.split('/');
          const [dayB, monthB, yearB] = b.date.split('/');
          const dateA = new Date(
            parseInt(yearA),
            parseInt(monthA) - 1,
            parseInt(dayA)
          );
          const dateB = new Date(
            parseInt(yearB),
            parseInt(monthB) - 1,
            parseInt(dayB)
          );
          return dateB.getTime() - dateA.getTime();
        });
      } else if (filters.date.includes('самые старые')) {
        result = [...result].sort((a, b) => {
          const [dayA, monthA, yearA] = a.date.split('/');
          const [dayB, monthB, yearB] = b.date.split('/');
          const dateA = new Date(
            parseInt(yearA),
            parseInt(monthA) - 1,
            parseInt(dayA)
          );
          const dateB = new Date(
            parseInt(yearB),
            parseInt(monthB) - 1,
            parseInt(dayB)
          );
          return dateA.getTime() - dateB.getTime();
        });
      }
    }

    // Apply category filter (multi-select)
    if (filters.category.length > 0) {
      result = result.filter(project => {
        const titleLower = project.title.toLowerCase();
        const descLower = project.description.toLowerCase();
        return filters.category.some(category => {
          const keywords = categoryMapping[category] || [
            category.toLowerCase(),
          ];
          return keywords.some(
            keyword =>
              titleLower.includes(keyword) || descLower.includes(keyword)
          );
        });
      });
    }

    // Apply stage filter (multi-select)
    if (filters.stage.length > 0) {
      result = result.filter(project =>
        filters.stage.some(
          stage =>
            project.stage?.toLowerCase() === stage.toLowerCase() ||
            project.status?.toLowerCase() === stage.toLowerCase()
        )
      );
    }

    // Apply tags filter from filters panel (multi-select)
    if (filters.tags.length > 0) {
      result = result.filter(project =>
        filters.tags.some(filterTag =>
          project.tags.some(tag => tag.toLowerCase().includes(filterTag))
        )
      );
    }

    return result;
  }, [searchQuery, filters]);

  // Convert mock projects to display format
  const displayProjects: DisplayProject[] = useMemo(() => {
    return filteredProjects.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      date: project.date,
      imageSrc: project.imageSrc,
      imageAlt: project.imageAlt,
      tags: project.tags,
    }));
  }, [filteredProjects]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilters({
      date: [],
      category: [],
      stage: [],
      tags: [],
    });
  };

  const handleFiltersChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };

  return (
    <main className="text-white relative">
      {/* Perfect Projects Slider */}
      <Suspense
        fallback={<div className="h-96 bg-gray-800 animate-pulse rounded-lg" />}
      >
        <PerfectProjectsSliderWrapper />
      </Suspense>

      <ProjectsMainContent
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filteredProjects={displayProjects}
        onResetFilters={handleResetFilters}
        onFiltersChange={handleFiltersChange}
      />
      <FooterSection />
    </main>
  );
}

function PerfectProjectsSliderWrapper() {
  return <PerfectProjectsSlider />;
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900" />}>
      <ProjectsContent />
    </Suspense>
  );
}
