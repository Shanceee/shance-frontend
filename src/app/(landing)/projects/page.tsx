'use client';

import { useState } from 'react';
import { Suspense } from 'react';

import {
  ProjectsMainContent,
  LoadingState,
  NoProjectsState,
} from '@/modules/landing/projects-page';
import { FooterSection } from '@/modules/landing';
import { PerfectProjectsSlider } from '@/components/ui';
import type { Tag } from '@/types/api';
import { useProjects, useSearchProjects } from '@/modules/projects';
import { useCurrentUser } from '@/modules/auth';
import { projectsData as mockProjects } from '@/data/projects';

// Interface for API project data with proper typing
interface ApiProject {
  id: string | number;
  title?: string;
  name?: string;
  description: string;
  created_at?: string;
  date?: string;
  photo?: string;
  imageSrc?: string;
  imageAlt?: string;
  tags?: (Tag | string)[];
}

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

function ProjectsContent() {
  const { isLoading: isAuthLoading } = useCurrentUser();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: projectsData, isLoading: isLoadingProjects } = useProjects({
    page_size: 20,
  });

  const { data: searchData, isLoading: isSearching } = useSearchProjects(
    searchQuery,
    searchQuery.length >= 2
  );

  // Use search results if searching, otherwise use all projects
  const shouldUseSearch = searchQuery.length >= 2;
  const apiProjects = shouldUseSearch
    ? searchData?.results
    : projectsData?.results;
  const isLoading = shouldUseSearch ? isSearching : isLoadingProjects;

  // Show loading while checking authentication or loading projects
  if (isAuthLoading || isLoading) {
    return <LoadingState />;
  }

  // Fallback to mock data when API returns empty (for unauthenticated users or API failures)
  // But only for the main list, not for search results
  const projects =
    !shouldUseSearch && (!apiProjects || apiProjects.length === 0)
      ? mockProjects
      : apiProjects;

  // Only show NoProjectsState when searching and no results found
  if (!projects || projects.length === 0) {
    return <NoProjectsState />;
  }

  // Convert API projects to display format
  const displayProjects = projects.map(
    (project: ApiProject): DisplayProject => {
      return {
        id: project.id?.toString() || String(project.id),
        title: project.title || project.name || 'Untitled Project',
        description: project.description,
        date: project.created_at
          ? new Date(project.created_at).toLocaleDateString('ru-RU')
          : project.date || '',
        imageSrc:
          project.photo || project.imageSrc || '/images/faq-image-b3a29d.png',
        imageAlt: project.title || project.imageAlt || 'Project image',
        tags:
          project.tags?.map((tag: Tag | string) =>
            typeof tag === 'string'
              ? tag
              : `#${(tag as Tag).name || String(tag)}`
          ) || [],
      };
    }
  );

  const handleResetFilters = () => {
    setSearchQuery('');
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
    <Suspense fallback={<LoadingState />}>
      <ProjectsContent />
    </Suspense>
  );
}
