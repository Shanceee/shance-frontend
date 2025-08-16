'use client';

import { useState, useEffect } from 'react';

import { BackgroundElements } from '@/components/ui/BackgroundElements';
import {
  SearchBar,
  ProjectsMainContent,
  ProjectsFooter,
  LoadingState,
  ErrorState,
  NoProjectsState,
  ProjectsHeader,
} from '@/modules/landing';
import { projectsData, ProjectData } from '@/data/projects';
import { HeroSection } from '@/components';

const categories = [
  'все',
  'проекты',
  'стартап',
  'команда',
  'идеи',
  'ресурсы',
  'Платформа',
  'инвесторы',
];

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

  // Простая проверка данных
  useEffect(() => {
    try {
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
    } catch (err) {
      console.error('Error loading projects data:', err);
      setError('Ошибка загрузки данных проектов');
      setIsLoading(false);
    }
  }, []);

  // Fallback данные для тестирования

  // Показываем загрузку
  if (isLoading) {
    return <LoadingState />;
  }

  // Показываем ошибку
  if (error) {
    return <ErrorState error={error} />;
  }

  // Используем fallback данные если основные не загрузились
  const projectsToUse =
    projectsData && Array.isArray(projectsData) && projectsData.length > 0
      ? projectsData
      : fallbackProjects;

  // Проверка на существование данных
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
    <div className="min-h-screen bg-[#232323] relative overflow-hidden">
      <BackgroundElements />

      <ProjectsHeader />
      <HeroSection />

      <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <ProjectsMainContent
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        filteredProjects={filteredProjects}
        onResetFilters={handleResetFilters}
      />

      <ProjectsFooter />
    </div>
  );
}
