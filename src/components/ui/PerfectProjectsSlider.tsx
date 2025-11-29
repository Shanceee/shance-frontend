'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import Image from 'next/image';

import { ProjectData, projectsData } from '@/data/projects';
import { projectsApi } from '@/modules/projects';

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
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPerfectProjects = async () => {
      try {
        const response = await projectsApi.list({ page_size: 10 });

        // If API returns empty, use mock data
        if (!response.results || response.results.length === 0) {
          setProjects(projectsData);
          return;
        }

        const mappedProjects = response.results.map(p => ({
          id: String(p.id),
          title: p.title || p.name,
          description: p.description,
          date: p.created_at
            ? new Date(p.created_at).toLocaleDateString('ru-RU')
            : '',
          imageSrc: p.photo || '/images/faq-image-b3a29d.png',
          imageAlt: p.title || p.name,
          tags: p.tags?.map(t => `#${t.name}`) || [],
        }));
        setProjects(mappedProjects as ProjectData[]);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Ошибка загрузки проектов:', error);
        }
        // Fallback to mock data on error
        setProjects(projectsData);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPerfectProjects();
  }, []);

  if (isLoading) {
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
          <div className="text-white">Загрузка...</div>
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
          spaceBetween={16}
          slidesPerView={1}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          pagination={{
            clickable: true,
            el: '.swiper-pagination-custom',
          }}
          loop={true}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 32,
            },
          }}
          className="perfect-projects-swiper"
        >
          {projects.map(project => (
            <SwiperSlide key={project.id}>
              <div className="w-full">
                <ProjectCard project={project} />
              </div>
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
