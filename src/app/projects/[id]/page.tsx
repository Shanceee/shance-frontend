'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { projectsData, type ProjectData } from '@/data/projects';
import { usePublicProject } from '@/modules/projects';
import { FooterSection } from '@/modules/landing';
import { BackgroundElements } from '@/components/ui/BackgroundElements';
import { StaticHeader } from '@/components/layout';
import { getImageUrl } from '@/lib/utils';
import type { Project } from '@/types/api';

// Union type for API and mock projects
type ProjectUnion = Project | ProjectData;

// Type guard to check if project is from API
function isApiProject(project: ProjectUnion): project is Project {
  return 'id' in project && typeof project.id === 'number';
}

interface Achievement {
  id: number;
  title: string;
  description: string;
}

const defaultAchievements: Achievement[] = [
  {
    id: 1,
    title: 'Исследование рынка',
    description:
      'Анализ целевой аудитории и конкурентов для определения уникального предложения',
  },
  {
    id: 2,
    title: 'Разработка MVP',
    description:
      'Создание минимально жизнеспособного продукта с основным функционалом',
  },
  {
    id: 3,
    title: 'Тестирование и запуск',
    description: 'Проверка гипотез и выход на рынок с первыми пользователями',
  },
  {
    id: 4,
    title: 'Масштабирование',
    description: 'Расширение функционала и привлечение новых пользователей',
  },
];

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const projectId = params.id as string;

  // Parse ID - try as number first for API
  const numericId = useMemo(() => {
    const parsed = parseInt(projectId, 10);
    return isNaN(parsed) ? null : parsed;
  }, [projectId]);

  // Try to fetch from public API if we have a numeric ID
  const {
    data: apiProject,
    isLoading: isLoadingApi,
    isError: isApiError,
  } = usePublicProject(numericId ?? 0, !!numericId);

  // Find mock project by ID
  const mockProject = useMemo(() => {
    return projectsData.find(p => p.id === projectId);
  }, [projectId]);

  // Determine which project to use: API first, then mock, then null
  const project: ProjectUnion | null = useMemo(() => {
    if (apiProject) {
      return apiProject;
    }
    if (!numericId || isApiError) {
      // If ID is not numeric or API failed, use mock data
      return mockProject ?? null;
    }
    return null;
  }, [apiProject, mockProject, numericId, isApiError]);

  // Create image gallery
  const images = useMemo(() => {
    if (!project) return [];

    if (isApiProject(project)) {
      // API project - use getImageUrl utility for proper URL formatting
      if (project.images && project.images.length > 0) {
        return project.images.map(img => getImageUrl(img.image));
      } else if (project.photo) {
        return [getImageUrl(project.photo)];
      }
      // Return placeholder if no images
      return ['/images/placeholder-project.jpg'];
    } else {
      // Mock project
      return [project.imageSrc, '/images/fon2.png', '/images/fon3.png'];
    }
  }, [project]);

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Handle image navigation
  const handlePrevImage = () => {
    setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Normalize project data for display
  const displayData = useMemo(() => {
    if (!project) return null;

    if (isApiProject(project)) {
      return {
        title: project.title,
        description: project.description,
        imageAlt: project.title,
        stage: project.stage,
        status: project.status,
        teamSize: project.team_capacity_label,
        tags: project.tags?.map(t => `#${t.name}`) || [],
      };
    } else {
      return {
        title: project.title,
        description: project.description,
        imageAlt: project.imageAlt,
        stage: project.stage,
        status: project.status,
        teamSize: project.teamSize,
        tags: project.tags || [],
      };
    }
  }, [project]);

  // Loading state
  if (isLoadingApi && numericId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <BackgroundElements />
        <StaticHeader />
        <div className="relative z-10 text-center px-5 pt-24">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/60 font-montserrat">Загрузка проекта...</p>
        </div>
      </div>
    );
  }

  // Handle not found
  if (!project || !displayData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <BackgroundElements />
        <StaticHeader />
        <div className="relative z-10 text-center px-5 pt-24">
          <h1 className="text-4xl md:text-6xl font-unbounded font-bold text-white mb-6">
            Проект не найден
          </h1>
          <p className="text-white/60 font-montserrat mb-8">
            К сожалению, мы не смогли найти проект с ID: {projectId}
          </p>
          <button
            onClick={() => router.push('/projects')}
            className="px-8 py-3 bg-[#00A851] hover:bg-[#00A851]/80 text-white rounded-lg font-montserrat font-semibold transition-all duration-300 hover:scale-105"
          >
            Вернуться к проектам
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white">
      <BackgroundElements />
      <StaticHeader />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="px-5 pt-28 pb-12 md:pt-32 md:pb-20 max-w-7xl mx-auto">
          {/* Title with gradient - Reduced size on mobile */}
          <h1
            className="text-2xl md:text-[34px] lg:text-5xl xl:text-6xl font-unbounded font-bold mb-8 md:mb-12 text-center leading-tight"
            style={{
              background:
                'linear-gradient(0deg, rgba(231, 231, 231, 0.3) 0%, rgba(210, 209, 209, 1) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {displayData.title}
          </h1>

          {/* Image Gallery */}
          {images.length > 0 && (
            <div className="relative mb-8 md:mb-12 max-w-5xl mx-auto">
              <div
                className="relative aspect-video overflow-hidden bg-white/5 backdrop-blur-sm"
                style={{ borderRadius: '40px' }}
              >
                <Image
                  src={images[currentImageIndex]}
                  alt={displayData.imageAlt || displayData.title}
                  fill
                  className="object-cover"
                  priority
                />

                {/* Navigation Arrows - Reduced size on mobile */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/20"
                      aria-label="Previous image"
                    >
                      <svg
                        className="w-5 h-5 md:w-6 md:h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/20"
                      aria-label="Next image"
                    >
                      <svg
                        className="w-5 h-5 md:w-6 md:h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </>
                )}

                {/* Counter Badge - Adjusted position for mobile */}
                {images.length > 1 && (
                  <div className="absolute bottom-3 left-3 md:bottom-6 md:left-6 px-4 py-2 md:px-5 md:py-2.5 bg-white/10 backdrop-blur-md font-miracode text-xs md:text-sm border border-white/20 rounded-[20px]">
                    {currentImageIndex + 1} из {images.length}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Status Badges - Reduced gap on mobile */}
          <div className="flex flex-wrap gap-4 md:gap-6 justify-center mb-12 md:mb-16">
            {displayData.stage && (
              <div className="flex flex-col items-center gap-2">
                <span className="text-[#A7A7A7] font-miracode text-xs md:text-sm">
                  Стадия
                </span>
                <div className="px-4 py-2 md:px-6 md:py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-full font-unbounded text-xs md:text-sm">
                  {displayData.stage}
                </div>
              </div>
            )}
            {displayData.status && (
              <div className="flex flex-col items-center gap-2">
                <span className="text-[#A7A7A7] font-miracode text-xs md:text-sm">
                  Статус
                </span>
                <div className="px-4 py-2 md:px-6 md:py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-full font-unbounded text-xs md:text-sm">
                  {displayData.status}
                </div>
              </div>
            )}
            {displayData.teamSize && (
              <div className="flex flex-col items-center gap-2">
                <span className="text-[#A7A7A7] font-miracode text-xs md:text-sm">
                  Команда
                </span>
                <div className="px-4 py-2 md:px-6 md:py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-full font-unbounded text-xs md:text-sm">
                  {displayData.teamSize}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Tags Marquee Section - Reduced padding and font size on mobile */}
        {displayData.tags.length > 0 && (
          <section className="py-6 md:py-8 overflow-hidden relative border-y border-white/10">
            {/* First row - scroll left */}
            <div className="flex animate-marquee whitespace-nowrap mb-4 md:mb-6">
              {[...displayData.tags, ...displayData.tags].map((tag, index) => (
                <span
                  key={`tag-1-${index}`}
                  className="inline-block px-4 py-2 md:px-8 md:py-3 font-miracode text-[#A7A7A7] text-sm md:text-base mx-2 md:mx-3"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Decorative line */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-4 md:mb-6" />

            {/* Second row - scroll right */}
            <div className="flex animate-marquee-reverse whitespace-nowrap">
              {[...displayData.tags, ...displayData.tags].map((tag, index) => (
                <span
                  key={`tag-2-${index}`}
                  className="inline-block px-4 py-2 md:px-8 md:py-3 font-miracode text-[#A7A7A7] text-sm md:text-base mx-2 md:mx-3"
                >
                  {tag}
                </span>
              ))}
            </div>

            <style jsx>{`
              @keyframes marquee {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(-50%);
                }
              }
              @keyframes marquee-reverse {
                0% {
                  transform: translateX(-50%);
                }
                100% {
                  transform: translateX(0);
                }
              }
              .animate-marquee {
                animation: marquee 30s linear infinite;
              }
              .animate-marquee-reverse {
                animation: marquee-reverse 30s linear infinite;
              }
            `}</style>
          </section>
        )}

        {/* About Project Section - Reduced padding and font sizes on mobile */}
        <section
          ref={sectionRef}
          className="px-5 py-12 md:py-16 lg:py-24 max-w-7xl mx-auto"
        >
          <h2
            className={`text-2xl md:text-3xl lg:text-5xl font-unbounded font-bold mb-8 md:mb-12 text-center transition-all duration-1000 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
            style={{
              background:
                'linear-gradient(0deg, rgba(231, 231, 231, 0.3) 0%, rgba(210, 209, 209, 1) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            О чем наш проект
          </h2>
          <div
            className={`max-w-3xl mx-auto backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 transition-all duration-1000 delay-200 border border-white/20 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
            style={{
              background:
                'linear-gradient(229deg, rgba(35, 35, 35, 1) 0%, rgba(80, 186, 140, 0.3) 100%)',
            }}
          >
            <p className="text-white font-montserrat text-base md:text-xl lg:text-2xl leading-relaxed">
              {displayData.description}
            </p>
          </div>
        </section>

        {/* Achievements Section - Reduced min-height and font sizes on mobile */}
        <section className="px-5 py-12 md:py-16 lg:py-24 max-w-7xl mx-auto">
          <h2
            className="text-2xl md:text-3xl lg:text-5xl font-unbounded font-bold mb-8 md:mb-12 text-center"
            style={{
              background:
                'linear-gradient(0deg, rgba(231, 231, 231, 0.3) 0%, rgba(210, 209, 209, 1) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Достижения и информация
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {defaultAchievements.map((achievement, index) => (
              <div
                key={achievement.id}
                className="backdrop-blur-md rounded-2xl md:rounded-3xl p-5 md:p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 group flex flex-col justify-between min-h-[180px] md:min-h-[220px] border border-white/20"
                style={{
                  transitionDelay: `${index * 100}ms`,
                  background:
                    'linear-gradient(229deg, rgba(35, 35, 35, 0.5) 0%, rgba(80, 186, 140, 0.1) 100%)',
                }}
              >
                <div>
                  <h3 className="text-lg md:text-xl font-unbounded font-bold text-white mb-2 md:mb-3 leading-tight">
                    {achievement.title}
                  </h3>
                  <p className="text-white/60 font-montserrat text-sm leading-relaxed">
                    {achievement.description}
                  </p>
                </div>
                {/* Checkmark icon at bottom */}
                <div className="mt-4 md:mt-6 flex items-center justify-start">
                  <div className="w-8 h-8 rounded-full bg-[#00A851]/20 flex items-center justify-center group-hover:bg-[#00A851]/30 transition-colors">
                    <svg
                      className="w-5 h-5 text-[#00A851]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Back to Projects Button */}
        <section className="px-5 py-12 max-w-7xl mx-auto text-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 bg-white/10 hover:bg-white/15 text-white rounded-xl md:rounded-2xl font-montserrat font-semibold transition-all duration-300 hover:scale-105 backdrop-blur-md border border-white/20 hover:border-white/30 text-sm md:text-base"
          >
            <span>Смотреть еще</span>
            <svg
              className="w-4 h-4 md:w-5 md:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <FooterSection />
    </div>
  );
}
