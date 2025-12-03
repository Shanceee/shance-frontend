'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import Image from 'next/image';

import { useAllProjects } from '@/modules/projects';
import { getProjectImageUrl } from '@/lib/utils';

import { ProjectCard } from './ProjectCard';

// Импортируем стили Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface PerfectProjectsSliderProps {
  className?: string;
}

export function PerfectProjectsSlider({
  className = '',
}: PerfectProjectsSliderProps) {
  // Use new public API endpoint /projects/all/
  const { data, isLoading, isError } = useAllProjects();

  // Safely extract results array - handle both paginated and array responses
  const resultsArray = data?.results ?? (Array.isArray(data) ? data : []);

  // Transform API projects to display format
  const projects = resultsArray.map(project => ({
    id: String(project.id),
    title: project.title,
    description: project.description,
    date: project.formatted_highlight_date || project.highlight_date || '',
    imageSrc: getProjectImageUrl(project),
    imageAlt: project.title,
    tags: project.tags?.map((tag: { name: string }) => tag.name) || [],
    stage: project.stage || 'prototype',
    status: project.status || 'in_progress',
    teamSize: project.team_capacity_label || 'до 20 чел',
  }));

  if (isLoading || (!data && !isError)) {
    return (
      <section className={`relative py-16 ${className}`}>
        <div className="mb-16 px-4 sm:px-6 lg:px-8 xl:px-10 text-center">
          <h2 className="text-4xl md:text-5xl font-unbounded font-normal leading-tight">
            <span className="bg-gradient-to-t from-gray-400/30 to-white bg-clip-text text-transparent">
              Твои идеальные проекты
            </span>
          </h2>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return (
      <section className={`relative py-16 ${className}`}>
        <div className="mb-16 px-4 sm:px-6 lg:px-8 xl:px-10 text-center">
          <h2 className="text-4xl md:text-5xl font-unbounded font-normal leading-tight">
            <span className="bg-gradient-to-t from-gray-400/30 to-white bg-clip-text text-transparent">
              Твои идеальные проекты
            </span>
          </h2>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-white/60 font-montserrat">
            Проекты не найдены
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`relative py-24 ${className}`}
      aria-label="Слайдер идеальных проектов"
    >
      {/* Заголовок */}
      <div className="mb-16 px-4 sm:px-6 lg:px-8 xl:px-10 text-center">
        <h2 className="text-4xl md:text-5xl font-unbounded font-normal leading-tight">
          <span className="bg-gradient-to-t from-gray-400/30 to-white bg-clip-text text-transparent">
            Твои идеальные проекты
          </span>
        </h2>
      </div>

      {/* Слайдер */}
      <div className="relative max-w-none mx-auto px-4">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          pagination={{
            clickable: true,
            el: '.swiper-pagination-custom',
          }}
          loop={projects.length > 3}
          breakpoints={{
            768: {
              slidesPerView: 'auto',
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 'auto',
              spaceBetween: 32,
            },
          }}
          className="perfect-projects-swiper"
        >
          {projects.map(project => (
            <SwiperSlide key={project.id} className="!w-full lg:!w-[663px]">
              <ProjectCard project={project} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Кастомные кнопки навигации */}
        <button
          className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Предыдущий проект"
        >
          <Image
            src="/images/left-chevron.svg"
            alt="Предыдущий"
            width={24}
            height={24}
            className="w-6 h-6"
          />
        </button>

        <button
          className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Следующий проект"
        >
          <Image
            src="/images/right.chevron.svg"
            alt="Следующий"
            width={24}
            height={24}
            className="w-6 h-6"
          />
        </button>

        {/* Кастомная пагинация */}
        <div className="swiper-pagination-custom" />
      </div>
    </section>
  );
}
