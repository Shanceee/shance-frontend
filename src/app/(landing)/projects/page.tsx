'use client';

import { useState, useEffect } from 'react';

import {
  ProjectsMainContent,
  LoadingState,
  ErrorState,
  NoProjectsState,
} from '@/modules/landing/projects-page';
import { projectsData, ProjectData } from '@/data/projects';
import { FooterSection } from '@/modules/landing';
import { PerfectProjectsSlider } from '@/components/ui';

// const categories = [
//   'все',
//   'проекты',
//   'стартап',
//   'команда',
//   'идеи',
//   'ресурсы',
//   'Платформа',
//   'инвесторы',
// ];

const fallbackProjects: ProjectData[] = [
  {
    id: 'fallback-1',
    title: 'Тестовый проект',
    description: 'Это тестовый проект для проверки работы страницы',
    date: '01/01/2025',
    imageSrc: '/images/faq-image-b3a29d.png',
    imageAlt: 'Тестовый проект',
    tags: ['#тест', '#проект', '#проверка'],
  },
];

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState('все');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (
      projectsData &&
      Array.isArray(projectsData) &&
      projectsData.length > 0
    ) {
      setIsLoading(false);
    } else {
      setError('Данные проектов не загружены корректно');
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  const projectsToUse =
    projectsData && Array.isArray(projectsData) && projectsData.length > 0
      ? projectsData
      : fallbackProjects;

  if (!projectsToUse || projectsToUse.length === 0) {
    return <NoProjectsState />;
  }

  const filteredProjects = projectsToUse.filter((project: ProjectData) => {
    const matchesCategory =
      selectedCategory === 'все' ||
      project.tags.some(tag =>
        tag.toLowerCase().includes(selectedCategory.toLowerCase())
      ) ||
      project.title.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      project.description
        .toLowerCase()
        .includes(selectedCategory.toLowerCase());
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some(tag =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesCategory && matchesSearch;
  });

  const handleResetFilters = () => {
    setSelectedCategory('все');
    setSearchQuery('');
  };

  return (
    <main className="text-white relative">
      {/* Блок "Твои идеальные проекты" */}
      <PerfectProjectsSlider />

      <ProjectsMainContent
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filteredProjects={filteredProjects}
        onResetFilters={handleResetFilters}
      />
      <FooterSection />
    </main>
  );
}
