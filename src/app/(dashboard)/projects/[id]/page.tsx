'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { useProject, useProjectImages } from '@/modules/projects';
import type { ProjectStage, ProjectStatus } from '@/types/api';

// Stage labels mapping
const stageLabels: Record<ProjectStage, string> = {
  idea: 'идея',
  concept: 'концепция',
  development: 'разработка',
  testing: 'тестирование',
  launch: 'запуск',
  growth: 'рост',
};

// Status labels mapping
const statusLabels: Record<ProjectStatus, string> = {
  prototype: 'прототип',
  mvp: 'MVP',
  beta: 'бета',
  release: 'релиз',
  archived: 'архив',
};

// Mock achievements data (since API doesn't provide this yet)
const mockAchievements = [
  {
    id: 1,
    title: 'Исследование рынка',
    problem:
      'Необходимо понять потребности целевой аудитории и конкурентную среду',
    solution:
      'Проведён анализ рынка, опросы потенциальных пользователей, изучены конкуренты',
    hasUser: true,
  },
  {
    id: 2,
    title: 'Разработка MVP',
    problem:
      'Создание минимально жизнеспособного продукта для тестирования гипотез',
    solution: 'Разработан прототип с основными функциями для валидации идеи',
    hasUser: false,
  },
  {
    id: 3,
    title: 'Тестирование и запуск',
    problem: 'Проверка работоспособности продукта и получение обратной связи',
    solution: 'Проведено бета-тестирование с фокус-группой, собраны отзывы',
    hasUser: true,
  },
  {
    id: 4,
    title: 'Привлечение инвестиций',
    problem: 'Необходимы ресурсы для масштабирования проекта',
    solution: 'Презентация проекта инвесторам, подготовка бизнес-плана',
    hasUser: false,
  },
];

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = Number(params.id);

  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [showMoreAchievements, setShowMoreAchievements] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const projectQuery = useProject(projectId);
  const imagesQuery = useProjectImages(projectId);

  const project = useMemo(
    () => projectQuery?.data ?? null,
    [projectQuery?.data]
  );
  const images = useMemo(() => imagesQuery?.data ?? [], [imagesQuery?.data]);

  // Loading state
  if (projectQuery.isLoading) {
    return (
      <div className="min-h-screen bg-[#161419] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00A851] mx-auto mb-4"></div>
          <p className="text-white/80 font-montserrat">Загрузка проекта...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (projectQuery.isError || !project) {
    return (
      <div className="min-h-screen bg-[#161419] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-unbounded text-white mb-4">
            Проект не найден
          </h1>
          <p className="text-white/60 font-montserrat mb-6">
            Проект с ID {projectId} не существует или был удалён
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-[#00A851] hover:bg-[#00A851]/80 text-white font-montserrat rounded-lg transition-colors"
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  const totalSlides = images.length || 1;
  const displayedAchievements = showMoreAchievements
    ? mockAchievements
    : mockAchievements.slice(0, 4);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: project.title,
        text: project.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Ссылка скопирована в буфер обмена');
    }
  };

  const handleDownload = () => {
    // Placeholder for download functionality
    alert('Функция загрузки будет доступна позже');
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="min-h-screen bg-[#161419] relative pb-20">
      {/* Decorative gradient blurs */}
      <div
        className="fixed w-[488px] h-[488px] rounded-full opacity-40 pointer-events-none"
        style={{
          background: '#00A851',
          filter: 'blur(244px)',
          right: '5%',
          top: '-150px',
        }}
      />
      <div
        className="fixed w-[488px] h-[488px] rounded-full opacity-40 pointer-events-none"
        style={{
          background: '#12FF78',
          filter: 'blur(244px)',
          left: '-100px',
          bottom: '-100px',
        }}
      />

      {/* Content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Title Section */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-unbounded text-white leading-tight">
              {project.title}
            </h1>

            {/* Action Icons */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={handleShare}
                className="p-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg transition-all duration-300"
                aria-label="Share"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </button>

              <button
                onClick={handleDownload}
                className="p-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg transition-all duration-300"
                aria-label="Download"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </button>

              <button
                onClick={toggleFavorite}
                className={`p-3 border rounded-lg transition-all duration-300 ${
                  isFavorite
                    ? 'bg-red-500/20 border-red-500/50 text-red-500'
                    : 'bg-white/5 hover:bg-white/10 border-white/20 text-white'
                }`}
                aria-label="Favorite"
              >
                <svg
                  className="w-5 h-5"
                  fill={isFavorite ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {project.subtitle && (
            <p className="text-lg text-white/60 font-montserrat">
              {project.subtitle}
            </p>
          )}
        </div>

        {/* Image Gallery/Slider */}
        <div className="mb-12 relative">
          {images.length > 0 ? (
            <div className="relative">
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={0}
                slidesPerView={1}
                onSwiper={setSwiper}
                onSlideChange={swiper =>
                  setCurrentSlide(swiper.activeIndex + 1)
                }
                className="rounded-2xl overflow-hidden"
                style={{ height: '400px' }}
              >
                {images.map((image, index) => (
                  <SwiperSlide key={image.id || index}>
                    <div className="relative w-full h-full bg-gradient-to-br from-[#00A851]/20 to-[#12FF78]/20">
                      <Image
                        src={image.image}
                        alt={image.caption || `Slide ${index + 1}`}
                        fill
                        className="object-cover"
                        priority={index === 0}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => swiper?.slidePrev()}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300"
                    aria-label="Previous slide"
                  >
                    <svg
                      className="w-6 h-6 text-white"
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
                    onClick={() => swiper?.slideNext()}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300"
                    aria-label="Next slide"
                  >
                    <svg
                      className="w-6 h-6 text-white"
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

                  {/* Slide Counter */}
                  <div className="absolute bottom-4 right-4 z-10 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-lg">
                    <span className="text-white font-montserrat text-sm">
                      {currentSlide} из {totalSlides}
                    </span>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="relative w-full h-[400px] bg-gradient-to-br from-[#00A851]/20 to-[#12FF78]/20 rounded-2xl flex items-center justify-center">
              <svg
                className="w-24 h-24 text-white/20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Project Info Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-unbounded text-white mb-6">
            О чем наш проект
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Description */}
            <div className="lg:col-span-2">
              <p className="text-white/80 font-montserrat leading-relaxed whitespace-pre-wrap">
                {project.description}
              </p>
            </div>

            {/* Info Blocks */}
            <div className="space-y-4">
              {project.stage && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="text-white/60 text-sm font-montserrat mb-2">
                    Стадия:
                  </div>
                  <div className="inline-block px-4 py-2 bg-[#00A851]/20 border border-[#00A851]/50 rounded-lg text-[#00A851] font-montserrat text-sm">
                    {stageLabels[project.stage]}
                  </div>
                </div>
              )}

              {project.status && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="text-white/60 text-sm font-montserrat mb-2">
                    Статус:
                  </div>
                  <div className="inline-block px-4 py-2 bg-[#00A851]/20 border border-[#00A851]/50 rounded-lg text-[#00A851] font-montserrat text-sm">
                    {statusLabels[project.status]}
                  </div>
                </div>
              )}

              {project.team_capacity_label && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="text-white/60 text-sm font-montserrat mb-2">
                    Команда:
                  </div>
                  <div className="inline-block px-4 py-2 bg-[#00A851]/20 border border-[#00A851]/50 rounded-lg text-[#00A851] font-montserrat text-sm">
                    {project.team_capacity_label}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tags Row */}
        {project.tags && project.tags.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
              {project.tags.map(tag => (
                <div
                  key={tag.id}
                  className="flex-shrink-0 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white/80 font-montserrat text-sm hover:bg-white/10 transition-colors cursor-pointer"
                >
                  #{tag.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-unbounded text-white mb-6">
            Достижения и информация
          </h2>

          {/* Achievement Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {displayedAchievements.map(achievement => (
              <div
                key={achievement.id}
                className="relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(217,217,217,0.05), rgba(217,217,217,0.02))',
                }}
              >
                {/* Gradient border effect */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-50 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
                    WebkitMask:
                      'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    padding: '1px',
                  }}
                />

                <div className="relative z-10">
                  <h3 className="text-lg font-unbounded text-white mb-4">
                    {achievement.title}
                  </h3>

                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="text-white/60 text-sm font-montserrat mb-1">
                        Проблема:
                      </div>
                      <p className="text-white/80 text-sm font-montserrat line-clamp-3">
                        {achievement.problem}
                      </p>
                    </div>

                    <div>
                      <div className="text-white/60 text-sm font-montserrat mb-1">
                        Решение:
                      </div>
                      <p className="text-white/80 text-sm font-montserrat line-clamp-3">
                        {achievement.solution}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      className="text-white/60 hover:text-red-500 transition-colors"
                      aria-label="Like achievement"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>

                    {achievement.hasUser && (
                      <div className="w-8 h-8 rounded-full bg-[#00A851]/30 border-2 border-[#00A851] flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show More Button */}
          {mockAchievements.length > 4 && (
            <div className="flex justify-center">
              <button
                onClick={() => setShowMoreAchievements(!showMoreAchievements)}
                className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-white font-montserrat transition-all duration-300 flex items-center gap-2"
              >
                <span>{showMoreAchievements ? 'Скрыть' : 'Смотреть еще'}</span>
                <svg
                  className={`w-5 h-5 transition-transform duration-300 ${
                    showMoreAchievements ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Bottom Tags Row */}
        {project.tags && project.tags.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
              {project.tags.map(tag => (
                <div
                  key={`bottom-${tag.id}`}
                  className="flex-shrink-0 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white/80 font-montserrat text-sm hover:bg-white/10 transition-colors cursor-pointer"
                >
                  #{tag.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-8 h-8">
                <Image
                  src="/images/logo.svg"
                  alt="Shance Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-white text-xl font-bold font-unbounded">
                shance
              </span>
            </div>
            <div className="text-center">
              <a
                href="mailto:shance@gmail.com"
                className="text-[#00A851] hover:text-[#00A851]/80 font-montserrat transition-colors"
              >
                shance@gmail.com
              </a>
              <p className="text-white/40 text-sm font-montserrat mt-1">
                Платформа для поиска команды и проектов
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Hide horizontal scrollbar */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
