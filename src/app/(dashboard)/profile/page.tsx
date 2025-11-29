'use client';

import { useState } from 'react';
import Image from 'next/image';

import { useCurrentUser } from '@/modules/auth';
import { useProjects } from '@/modules/projects';

export default function ProfilePage() {
  const { data: user, isLoading: isLoadingUser } = useCurrentUser();
  const [activeTab, setActiveTab] = useState<'info' | 'projects'>('info');

  const { data: projectsData } = useProjects({
    enabled: activeTab === 'projects',
  });

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/60 font-montserrat">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-white/60 font-montserrat">Пользователь не найден</p>
      </div>
    );
  }

  const userProjects = projectsData?.results || [];

  return (
    <div className="relative">
      {/* Decorative blurred ellipses */}
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

      <div className="max-w-[1360px] mx-auto px-10 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[543px_1fr] gap-10">
          {/* Left Card - User Profile */}
          <aside className="bg-black/30 backdrop-blur-[40px] rounded-[32px] p-8">
            <div className="flex flex-col gap-9">
              {/* Profile Image */}
              <div className="flex justify-center">
                <div className="relative w-[200px] h-[200px] rounded-full overflow-hidden">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={`${user.first_name || user.username || 'User'} avatar`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#00A851] to-[#008f45] flex items-center justify-center">
                      <span className="text-6xl font-unbounded font-bold text-white">
                        {user.first_name?.charAt(0) ||
                          user.username?.charAt(0)?.toUpperCase() ||
                          user.email?.charAt(0)?.toUpperCase() ||
                          'U'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Name Section (Frame 59) */}
              <div className="flex flex-col gap-2 text-center">
                <h1 className="text-2xl font-unbounded text-white">
                  {user.first_name && user.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : user.username || 'Имя Фамилия'}
                </h1>
                {user.specialization && (
                  <p className="text-base font-montserrat font-medium text-white">
                    {user.specialization}
                  </p>
                )}
              </div>

              {/* Menu Section (Frame 60) */}
              <nav className="flex flex-col">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`text-left px-6 py-6 transition-all ${
                    activeTab === 'info'
                      ? 'text-[28px] font-unbounded text-white border-b border-[#B3B3B3]'
                      : 'text-2xl font-unbounded text-white/60 hover:text-white'
                  }`}
                >
                  Личная информация
                </button>

                <button
                  onClick={() => setActiveTab('projects')}
                  className={`text-left px-6 py-6 transition-all ${
                    activeTab === 'projects'
                      ? 'text-[28px] font-unbounded text-white border-b border-[#B3B3B3]'
                      : 'text-2xl font-unbounded text-white/60 hover:text-white'
                  }`}
                >
                  Мои проекты
                </button>
              </nav>
            </div>
          </aside>

          {/* Right Card - Content */}
          <main className="bg-black/30 backdrop-blur-[40px] rounded-[32px] p-8">
            {activeTab === 'info' ? (
              <div className="flex flex-col gap-9">
                {/* Two-column grid of fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-9">
                  {/* Row 1: Имя, Фамилия */}
                  <div className="flex flex-col gap-2">
                    <label className="text-base font-montserrat text-[#929292]">
                      Имя
                    </label>
                    <div className="border-b border-white pb-2">
                      <p className="text-xl font-unbounded text-white">
                        {user.first_name || '-'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-base font-montserrat text-[#929292]">
                      Фамилия
                    </label>
                    <div className="border-b border-white pb-2">
                      <p className="text-xl font-unbounded text-white">
                        {user.last_name || '-'}
                      </p>
                    </div>
                  </div>

                  {/* Row 2: Сфера деятельности (full width in design, using 2 cols) */}
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-base font-montserrat text-[#929292]">
                      Сфера деятельности
                    </label>
                    <div className="border-b border-white pb-2">
                      <p className="text-xl font-unbounded text-white">
                        {user.specialization || '-'}
                      </p>
                    </div>
                  </div>

                  {/* Row 3: Теги */}
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-base font-montserrat text-[#929292]">
                      Теги
                    </label>
                    <div className="border-b border-white pb-2">
                      {user.tags && user.tags.length > 0 ? (
                        <p className="text-xl font-unbounded text-white">
                          {user.tags.map(tag => `#${tag.name}`).join(' ')}
                        </p>
                      ) : (
                        <p className="text-xl font-unbounded text-white">-</p>
                      )}
                    </div>
                  </div>

                  {/* Row 4: Страна, Город */}
                  <div className="flex flex-col gap-2">
                    <label className="text-base font-montserrat text-[#929292]">
                      Страна
                    </label>
                    <div className="border-b border-white pb-2">
                      <p className="text-xl font-unbounded text-white">
                        {user.country || '-'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-base font-montserrat text-[#929292]">
                      Город
                    </label>
                    <div className="border-b border-white pb-2">
                      <p className="text-xl font-unbounded text-white">
                        {user.city || '-'}
                      </p>
                    </div>
                  </div>

                  {/* Row 5: Телефон, Почта */}
                  <div className="flex flex-col gap-2">
                    <label className="text-base font-montserrat text-[#929292]">
                      Телефон
                    </label>
                    <div className="border-b border-white pb-2">
                      <p className="text-xl font-unbounded text-white">
                        {user.phone || '-'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-base font-montserrat text-[#929292]">
                      Почта
                    </label>
                    <div className="border-b border-white pb-2">
                      <p className="text-xl font-unbounded text-white">
                        {user.email || '-'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Links Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-9">
                  {/* GitHub Link */}
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-[50px] h-[50px] bg-white/10 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </div>

                    {/* Input field */}
                    {user.github_url ? (
                      <a
                        href={user.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-between h-[58px] px-5 bg-[rgba(217,217,217,0.05)] rounded-xl border border-transparent hover:border-white/20 transition-all group"
                      >
                        <span className="text-white/80 font-montserrat text-sm">
                          {user.github_url}
                        </span>
                        <svg
                          className="w-5 h-5 text-white/60 group-hover:text-white transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    ) : (
                      <div className="flex-1 flex items-center h-[58px] px-5 bg-[rgba(217,217,217,0.05)] rounded-xl border border-transparent">
                        <span className="text-white/40 font-montserrat text-sm">
                          Ссылка на гитхаб
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Behance Link */}
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-[50px] h-[50px] bg-white/10 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.988h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
                      </svg>
                    </div>

                    {/* Input field */}
                    {user.behance_url ? (
                      <a
                        href={user.behance_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-between h-[58px] px-5 bg-[rgba(217,217,217,0.05)] rounded-xl border border-transparent hover:border-white/20 transition-all group"
                      >
                        <span className="text-white/80 font-montserrat text-sm">
                          {user.behance_url}
                        </span>
                        <svg
                          className="w-5 h-5 text-white/60 group-hover:text-white transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    ) : (
                      <div className="flex-1 flex items-center h-[58px] px-5 bg-[rgba(217,217,217,0.05)] rounded-xl border border-transparent">
                        <span className="text-white/40 font-montserrat text-sm">
                          Ссылка на беханс
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              // Projects Tab
              <div className="space-y-6">
                <h2 className="text-2xl font-unbounded text-white mb-6">
                  Мои проекты ({userProjects.length})
                </h2>

                {userProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userProjects.map(project => (
                      <div
                        key={project.id}
                        className="bg-white/5 backdrop-blur-sm rounded-[20px] p-6 hover:bg-white/10 transition-all"
                      >
                        {project.photo && (
                          <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                            <Image
                              src={project.photo}
                              alt={project.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <h3 className="text-xl font-unbounded text-white mb-2">
                          {project.title}
                        </h3>
                        {project.subtitle && (
                          <p className="text-sm font-montserrat text-white/60 mb-3">
                            {project.subtitle}
                          </p>
                        )}
                        {project.description && (
                          <p className="text-sm font-montserrat text-white/80 line-clamp-3">
                            {project.description}
                          </p>
                        )}
                        {project.tags && project.tags.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {project.tags.map(tag => (
                              <span
                                key={tag.id}
                                className="px-3 py-1 bg-white/10 rounded-full text-xs font-montserrat text-white/80"
                              >
                                #{tag.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white/5 backdrop-blur-sm rounded-[32px]">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-white/60"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                    </div>
                    <p className="text-white/60 font-montserrat mb-4">
                      У вас пока нет проектов
                    </p>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
