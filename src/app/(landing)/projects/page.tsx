'use client';

import { useState, useMemo } from 'react';
import { Suspense } from 'react';

import { ProjectsMainContent } from '@/modules/landing/projects-page';
import { FooterSection } from '@/modules/landing';
import { PerfectProjectsSlider } from '@/components/ui';
import { useAllProjects } from '@/modules/projects';
import { getProjectImageUrl } from '@/lib/utils';
import type { FilterValues } from '@/components/ui/FilterPanel';
import type { Project } from '@/types/api';

// Interface for display project format
interface DisplayProject {
  id: string;
  title: string;
  description: string;
  date: string;
  imageSrc: string;
  imageAlt: string;
  tags: string[];
  stage?: string;
  status?: string;
}

// Category mapping for filtering
const categoryMapping: Record<string, string[]> = {
  'мобильное приложение': ['приложение', 'mobile', 'мобильн'],
  'веб-сервис': ['сервис', 'веб', 'web'],
  платформа: ['платформа', 'platform'],
  соцсеть: ['соцсеть', 'социальн', 'друзей', 'vibe'],
};

// Transform API project to display format
function transformProject(project: Project): DisplayProject {
  return {
    id: String(project.id),
    title: project.title,
    description: project.description,
    date: project.formatted_highlight_date || project.highlight_date || '',
    imageSrc: getProjectImageUrl(project),
    imageAlt: project.title,
    tags: project.tags?.map(tag => tag.name) || [],
    stage: project.stage,
    status: project.status,
  };
}

// Parse date from formatted string (DD/MM/YYYY or ISO format)
function parseDate(dateString: string): Date | null {
  if (!dateString) return null;

  // Try DD/MM/YYYY format first
  if (dateString.includes('/')) {
    const [day, month, year] = dateString.split('/').map(Number);
    if (day && month && year) {
      return new Date(year, month - 1, day);
    }
  }

  // Try ISO format
  const isoDate = new Date(dateString);
  if (!isNaN(isoDate.getTime())) {
    return isoDate;
  }

  return null;
}

function ProjectsContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterValues>({
    date: [],
    category: [],
    stage: [],
    tags: [],
  });

  // Fetch all projects from API
  const { data, isLoading, isError } = useAllProjects();

  // Transform API projects to display format
  // Handle both paginated response and direct array
  const allProjects = useMemo(() => {
    const resultsArray = data?.results ?? (Array.isArray(data) ? data : []);
    return resultsArray.map(transformProject);
  }, [data]);

  // Combined filtering - search + filters
  const filteredProjects = useMemo(() => {
    let result = [...allProjects];

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
          const dateA = parseDate(a.date);
          const dateB = parseDate(b.date);
          if (!dateA || !dateB) return 0;
          return dateB.getTime() - dateA.getTime();
        });
      } else if (filters.date.includes('самые старые')) {
        result = [...result].sort((a, b) => {
          const dateA = parseDate(a.date);
          const dateB = parseDate(b.date);
          if (!dateA || !dateB) return 0;
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
          project.tags.some(tag =>
            tag.toLowerCase().includes(filterTag.toLowerCase())
          )
        )
      );
    }

    return result;
  }, [allProjects, searchQuery, filters]);

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

  // Loading state
  if (isLoading) {
    return (
      <main className="text-white relative">
        <div className="h-96 bg-gray-800 animate-pulse rounded-lg mb-8" />
        <div className="container mx-auto px-4 py-8">
          <div className="h-64 bg-gray-800 animate-pulse rounded-lg" />
        </div>
      </main>
    );
  }

  // Error state
  if (isError) {
    return (
      <main className="text-white relative">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              Ошибка загрузки проектов
            </h2>
            <p className="text-gray-400">
              Пожалуйста, попробуйте обновить страницу
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Empty state
  if (!allProjects.length) {
    return (
      <main className="text-white relative">
        <Suspense
          fallback={
            <div className="h-96 bg-gray-800 animate-pulse rounded-lg" />
          }
        >
          <PerfectProjectsSliderWrapper />
        </Suspense>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Проектов пока нет</h2>
            <p className="text-gray-400">
              Проекты появятся здесь после их создания
            </p>
          </div>
        </div>
        <FooterSection />
      </main>
    );
  }

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
        filteredProjects={filteredProjects}
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
