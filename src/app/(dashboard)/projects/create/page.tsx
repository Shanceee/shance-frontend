'use client';

import { useState, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { useCreateProjectWithImage } from '@/modules/projects';
import { useTags, useSearchTags } from '@/modules/tags';
import { useTechnologies, useSearchTechnologies } from '@/modules/technologies';
import { useSearchUsers } from '@/modules/users';
import { useDebounce } from '@/hooks/useDebounce';
import { notify } from '@/stores/uiStore';
import type { ProjectCreate, Tag, Technology, User } from '@/types/api';

interface TeamMember {
  user: User;
  role: string;
}

interface LinkInput {
  id: string;
  type: 'external' | 'behance' | 'github';
  url: string;
}

export default function CreateProjectPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null
  );
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState<
    Technology[]
  >([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [links, setLinks] = useState<LinkInput[]>([]);
  const [vacancies, setVacancies] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);

  // Search state
  const [tagSearchQuery, setTagSearchQuery] = useState('');
  const [techSearchQuery, setTechSearchQuery] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [vacancyInput, setVacancyInput] = useState('');
  const [skillInput, setSkillInput] = useState('');

  // UI state
  const [isDragging, setIsDragging] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [showTechDropdown, setShowTechDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Debounced search queries
  const debouncedTagSearch = useDebounce(tagSearchQuery, 300);
  const debouncedTechSearch = useDebounce(techSearchQuery, 300);
  const debouncedUserSearch = useDebounce(userSearchQuery, 300);

  // API hooks
  const { data: tagsData } = useTags({ page_size: 50 });
  const { data: searchTagsData } = useSearchTags(
    debouncedTagSearch,
    debouncedTagSearch.length > 0
  );
  const { data: technologiesData } = useTechnologies({ page_size: 50 });
  const { data: searchTechData } = useSearchTechnologies(
    debouncedTechSearch,
    debouncedTechSearch.length > 0
  );
  const { data: searchUsersData } = useSearchUsers(
    debouncedUserSearch,
    debouncedUserSearch.length > 2
  );

  const createProjectMutation = useCreateProjectWithImage({
    onSuccess: project => {
      notify.success('Успех', 'Проект успешно создан');
      router.push(`/projects/${project.id}`);
    },
    onError: error => {
      notify.error('Ошибка', error.message || 'Не удалось создать проект');
    },
  });

  // Memoized data
  const availableTags = useMemo(() => {
    const tags =
      debouncedTagSearch.length > 0
        ? searchTagsData?.results
        : tagsData?.results;
    return (
      tags?.filter(tag => !selectedTags.some(st => st.id === tag.id)) || []
    );
  }, [debouncedTagSearch, searchTagsData, tagsData, selectedTags]);

  const availableTechnologies = useMemo(() => {
    const techs =
      debouncedTechSearch.length > 0
        ? searchTechData?.results
        : technologiesData?.results;
    return (
      techs?.filter(
        tech => !selectedTechnologies.some(st => st.id === tech.id)
      ) || []
    );
  }, [
    debouncedTechSearch,
    searchTechData,
    technologiesData,
    selectedTechnologies,
  ]);

  const availableUsers = useMemo(() => {
    return searchUsersData?.results || [];
  }, [searchUsersData]);

  // Image upload handlers
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          notify.error('Ошибка', 'Размер файла не должен превышать 5MB');
          return;
        }
        setCoverImage(file);
        const reader = new FileReader();
        reader.onload = () => setCoverImagePreview(reader.result as string);
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) {
        notify.error('Ошибка', 'Размер файла не должен превышать 5MB');
        return;
      }
      setCoverImage(file);
      const reader = new FileReader();
      reader.onload = () => setCoverImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  // Tag handlers
  const handleAddTag = useCallback((tag: Tag) => {
    setSelectedTags(prev => [...prev, tag]);
    setTagSearchQuery('');
    setShowTagDropdown(false);
  }, []);

  const handleRemoveTag = useCallback((tagId: number) => {
    setSelectedTags(prev => prev.filter(t => t.id !== tagId));
  }, []);

  // Technology handlers
  const handleAddTechnology = useCallback((tech: Technology) => {
    setSelectedTechnologies(prev => [...prev, tech]);
    setTechSearchQuery('');
    setShowTechDropdown(false);
  }, []);

  const handleRemoveTechnology = useCallback((techId: number) => {
    setSelectedTechnologies(prev => prev.filter(t => t.id !== techId));
  }, []);

  // Team member handlers
  const handleAddTeamMember = useCallback(
    (user: User) => {
      if (!teamMembers.some(m => m.user.id === user.id)) {
        setTeamMembers(prev => [...prev, { user, role: 'member' }]);
        setUserSearchQuery('');
        setShowUserDropdown(false);
      }
    },
    [teamMembers]
  );

  const handleRemoveTeamMember = useCallback((userId: number) => {
    setTeamMembers(prev => prev.filter(m => m.user.id !== userId));
  }, []);

  const handleMemberRoleChange = useCallback((userId: number, role: string) => {
    setTeamMembers(prev =>
      prev.map(m => (m.user.id === userId ? { ...m, role } : m))
    );
  }, []);

  // Link handlers
  const handleAddLink = useCallback(
    (type: 'external' | 'behance' | 'github') => {
      setLinks(prev => [
        ...prev,
        { id: Math.random().toString(36).substr(2, 9), type, url: '' },
      ]);
    },
    []
  );

  const handleUpdateLink = useCallback((id: string, url: string) => {
    setLinks(prev =>
      prev.map(link => (link.id === id ? { ...link, url } : link))
    );
  }, []);

  const handleRemoveLink = useCallback((id: string) => {
    setLinks(prev => prev.filter(link => link.id !== id));
  }, []);

  // Vacancy and skill handlers
  const handleAddVacancy = useCallback(() => {
    if (vacancyInput.trim()) {
      setVacancies(prev => [...prev, vacancyInput.trim()]);
      setVacancyInput('');
    }
  }, [vacancyInput]);

  const handleRemoveVacancy = useCallback((index: number) => {
    setVacancies(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleAddSkill = useCallback(() => {
    if (skillInput.trim()) {
      setSkills(prev => [...prev, skillInput.trim()]);
      setSkillInput('');
    }
  }, [skillInput]);

  const handleRemoveSkill = useCallback((index: number) => {
    setSkills(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!name.trim()) {
        notify.error('Ошибка', 'Название проекта обязательно');
        return;
      }

      if (!description.trim()) {
        notify.error('Ошибка', 'Описание проекта обязательно');
        return;
      }

      const projectData: ProjectCreate = {
        name: name.trim(),
        title: name.trim(),
        description: description.trim(),
        // Note: Tags will be managed separately after project creation
        // The API doesn't accept tag_ids in the create request
      };

      createProjectMutation.mutate({
        projectData,
        imageFile: coverImage || undefined,
      });
    },
    [name, description, selectedTags, coverImage, createProjectMutation]
  );

  return (
    <div className="min-h-screen bg-[#232323] text-white relative overflow-hidden pb-20">
      {/* Background decorative elements */}
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

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-16 py-6 md:py-12">
        {/* Back navigation */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8 text-white/60 hover:text-white transition-colors font-unbounded text-base md:text-[20px] min-h-[44px]"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Вернуться к выбору</span>
          <span className="sm:hidden">Назад</span>
        </button>

        {/* Title */}
        <h1
          className="font-unbounded text-base md:text-[18px] font-medium mb-6 md:mb-10"
          style={{
            background:
              'linear-gradient(0deg, rgba(88,88,88,0.3) 0%, rgba(194,194,194,1) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Редактирование проекта
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-10">
          {/* Cover image upload */}
          <div
            className={`w-full h-[250px] sm:h-[350px] md:h-[463px] rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
              isDragging ? 'scale-[0.98]' : ''
            }`}
            style={{
              background: coverImagePreview
                ? 'transparent'
                : 'linear-gradient(229deg, rgba(35,35,35,1) 0%, rgba(47,131,94,1) 100%)',
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {coverImagePreview ? (
              <div className="relative w-full h-full rounded-xl overflow-hidden group">
                <Image
                  src={coverImagePreview}
                  alt="Cover preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="font-miracode text-sm md:text-[16px] text-white px-4 text-center">
                    Нажмите для изменения
                  </span>
                </div>
              </div>
            ) : (
              <>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth="4"
                  className="w-6 h-6 sm:w-8 sm:h-8"
                >
                  <path d="M16 8v16M8 16h16" />
                </svg>
                <p className="font-miracode text-sm md:text-[16px] text-white mt-4 px-4 text-center">
                  Перетащите, чтобы добавить...
                </p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Two column layout - becomes single column on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Left column */}
            <div className="space-y-6 md:space-y-8">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block font-unbounded text-lg md:text-[24px] mb-2 md:mb-3"
                >
                  Название
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Введите"
                  className="w-full bg-white/5 rounded-xl px-4 py-3 md:py-3 font-miracode text-base md:text-[18px] text-white placeholder:text-[#929292] focus:outline-none focus:ring-2 focus:ring-white/20 min-h-[44px]"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block font-unbounded text-lg md:text-[24px] mb-2 md:mb-3"
                >
                  Описание
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Расскажите о функционале"
                  rows={6}
                  className="w-full bg-white/5 rounded-xl px-4 py-3 font-miracode text-base md:text-[18px] text-white placeholder:text-[#929292] focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
                  required
                />
              </div>

              {/* Team members */}
              <div>
                <label className="block font-unbounded text-lg md:text-[24px] mb-2 md:mb-3">
                  Добавить людей в проект
                </label>

                {/* Search input */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={e => {
                      setUserSearchQuery(e.target.value);
                      setShowUserDropdown(true);
                    }}
                    onFocus={() => setShowUserDropdown(true)}
                    placeholder="Поиск..."
                    className="w-full bg-white/[0.02] border border-white/10 rounded-[10px] h-[52px] px-4 pl-12 font-miracode text-sm md:text-[16px] text-white placeholder:text-[#929292] focus:outline-none focus:border-white/20"
                  />
                  <svg
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>

                  {/* Dropdown */}
                  {showUserDropdown &&
                    userSearchQuery.length > 2 &&
                    availableUsers.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-[#2a2a2a] border border-white/10 rounded-xl max-h-[200px] overflow-y-auto z-20">
                        {availableUsers.map(user => (
                          <button
                            key={user.id}
                            type="button"
                            onClick={() => handleAddTeamMember(user)}
                            className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors font-miracode text-sm md:text-[14px] min-h-[44px]"
                          >
                            {user.first_name} {user.last_name} ({user.email})
                          </button>
                        ))}
                      </div>
                    )}
                </div>

                {/* Member list */}
                <div className="space-y-3">
                  {teamMembers.map(member => (
                    <div
                      key={member.user.id}
                      className="bg-white/5 border border-white/10 rounded-xl px-3 md:px-4 py-3 flex items-center gap-2 md:gap-4"
                    >
                      {/* Avatar */}
                      <div className="w-[34px] h-[34px] rounded-full bg-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {member.user.avatar ? (
                          <Image
                            src={member.user.avatar}
                            alt={member.user.first_name || ''}
                            width={34}
                            height={34}
                          />
                        ) : (
                          <span className="font-unbounded text-[12px]">
                            {member.user.first_name?.[0]}
                            {member.user.last_name?.[0]}
                          </span>
                        )}
                      </div>

                      {/* Name */}
                      <span className="flex-1 font-miracode text-sm md:text-[16px] truncate">
                        {member.user.first_name} {member.user.last_name}
                      </span>

                      {/* Role dropdown */}
                      <select
                        value={member.role}
                        onChange={e =>
                          handleMemberRoleChange(member.user.id, e.target.value)
                        }
                        className="bg-white/5 border border-white/10 rounded-lg px-2 md:px-3 py-1 font-miracode text-xs md:text-[14px] focus:outline-none focus:border-white/20 min-h-[44px]"
                      >
                        <option value="member">Участник</option>
                        <option value="lead">Лидер</option>
                        <option value="developer">Разработчик</option>
                        <option value="designer">Дизайнер</option>
                      </select>

                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveTeamMember(member.user.id)}
                        className="text-white/40 hover:text-red-400 transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M15 5L5 15M5 5l10 10" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6 md:space-y-8">
              {/* Tags */}
              <div>
                <label className="block font-unbounded text-lg md:text-[24px] mb-2 md:mb-3">
                  Тэги
                </label>

                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedTags.map(tag => (
                    <div
                      key={tag.id}
                      className="bg-[#666666]/30 border-2 border-transparent rounded-xl px-4 md:px-5 py-2.5 md:py-3 flex items-center gap-2"
                      style={{
                        borderImage:
                          'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05)) 1',
                      }}
                    >
                      <span className="font-miracode text-sm md:text-[16px] text-[#929292]">
                        {tag.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag.id)}
                        className="text-white/40 hover:text-red-400 transition-colors p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M12 4L4 12M4 4l8 8" />
                        </svg>
                      </button>
                    </div>
                  ))}

                  {/* Add tag button */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowTagDropdown(!showTagDropdown)}
                      className="bg-[#666666]/30 border-2 border-transparent rounded-xl px-4 md:px-5 py-2.5 md:py-3 hover:bg-[#666666]/40 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M8 2v12M2 8h12" />
                      </svg>
                    </button>

                    {showTagDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-[calc(100vw-2rem)] sm:w-[300px] bg-[#2a2a2a] border border-white/10 rounded-xl p-2 z-20">
                        <input
                          type="text"
                          value={tagSearchQuery}
                          onChange={e => setTagSearchQuery(e.target.value)}
                          placeholder="Поиск тэгов..."
                          className="w-full bg-white/5 rounded-lg px-3 py-2 mb-2 font-miracode text-sm md:text-[14px] focus:outline-none min-h-[44px]"
                        />
                        <div className="max-h-[200px] overflow-y-auto">
                          {availableTags.map(tag => (
                            <button
                              key={tag.id}
                              type="button"
                              onClick={() => handleAddTag(tag)}
                              className="w-full px-3 py-2 text-left hover:bg-white/5 rounded font-miracode text-sm md:text-[14px] min-h-[44px]"
                            >
                              {tag.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Technologies (Resources) */}
              <div>
                <label className="block font-unbounded text-lg md:text-[24px] mb-2 md:mb-3">
                  Ресурсы
                </label>

                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedTechnologies.map(tech => (
                    <div
                      key={tech.id}
                      className="bg-[#666666]/30 border-2 border-transparent rounded-xl px-4 md:px-5 py-2.5 md:py-3 flex items-center gap-2"
                    >
                      <span className="font-miracode text-sm md:text-[16px] text-[#929292]">
                        {tech.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTechnology(tech.id)}
                        className="text-white/40 hover:text-red-400 transition-colors p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M12 4L4 12M4 4l8 8" />
                        </svg>
                      </button>
                    </div>
                  ))}

                  {/* Add technology button */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowTechDropdown(!showTechDropdown)}
                      className="bg-[#666666]/30 border-2 border-transparent rounded-xl px-4 md:px-5 py-2.5 md:py-3 hover:bg-[#666666]/40 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M8 2v12M2 8h12" />
                      </svg>
                    </button>

                    {showTechDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-[calc(100vw-2rem)] sm:w-[300px] bg-[#2a2a2a] border border-white/10 rounded-xl p-2 z-20">
                        <input
                          type="text"
                          value={techSearchQuery}
                          onChange={e => setTechSearchQuery(e.target.value)}
                          placeholder="Поиск технологий..."
                          className="w-full bg-white/5 rounded-lg px-3 py-2 mb-2 font-miracode text-sm md:text-[14px] focus:outline-none min-h-[44px]"
                        />
                        <div className="max-h-[200px] overflow-y-auto">
                          {availableTechnologies.map(tech => (
                            <button
                              key={tech.id}
                              type="button"
                              onClick={() => handleAddTechnology(tech)}
                              className="w-full px-3 py-2 text-left hover:bg-white/5 rounded font-miracode text-sm md:text-[14px] min-h-[44px]"
                            >
                              {tech.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Links */}
              <div>
                <label className="block font-unbounded text-lg md:text-[24px] mb-2 md:mb-3">
                  Ссылки
                </label>

                <div className="space-y-3">
                  {links.map(link => (
                    <div
                      key={link.id}
                      className="flex items-center gap-2 md:gap-3"
                    >
                      {/* Icon */}
                      <div className="w-[44px] sm:w-[52px] h-[44px] sm:h-[52px] bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0">
                        {link.type === 'github' && (
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-5 h-5 sm:w-6 sm:h-6"
                          >
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                        )}
                        {link.type === 'behance' && (
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-5 h-5 sm:w-6 sm:h-6"
                          >
                            <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.988h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
                          </svg>
                        )}
                        {link.type === 'external' && (
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="w-5 h-5 sm:w-6 sm:h-6"
                          >
                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                          </svg>
                        )}
                      </div>

                      {/* Input */}
                      <input
                        type="url"
                        value={link.url}
                        onChange={e =>
                          handleUpdateLink(link.id, e.target.value)
                        }
                        placeholder={
                          link.type === 'github'
                            ? 'https://github.com/...'
                            : link.type === 'behance'
                              ? 'https://behance.net/...'
                              : 'https://...'
                        }
                        className="flex-1 bg-white/5 rounded-xl px-3 md:px-4 py-3 font-miracode text-sm md:text-[16px] text-white placeholder:text-[#929292] focus:outline-none focus:ring-2 focus:ring-white/20 min-h-[44px]"
                      />

                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveLink(link.id)}
                        className="text-white/40 hover:text-red-400 transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M15 5L5 15M5 5l10 10" />
                        </svg>
                      </button>
                    </div>
                  ))}

                  {/* Add link buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddLink('external')}
                      className="px-3 md:px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors font-miracode text-xs md:text-[14px] min-h-[44px]"
                    >
                      + Внешняя ссылка
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddLink('behance')}
                      className="px-3 md:px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors font-miracode text-xs md:text-[14px] min-h-[44px]"
                    >
                      + Behance
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddLink('github')}
                      className="px-3 md:px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors font-miracode text-xs md:text-[14px] min-h-[44px]"
                    >
                      + GitHub
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 pt-6 md:pt-8">
            {/* Vacancies */}
            <div>
              <label className="block font-unbounded text-lg md:text-[24px] mb-2 md:mb-3">
                Кого вы ищете в команду?
              </label>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={vacancyInput}
                    onChange={e => setVacancyInput(e.target.value)}
                    onKeyPress={e =>
                      e.key === 'Enter' &&
                      (e.preventDefault(), handleAddVacancy())
                    }
                    placeholder="Введите вакансию..."
                    className="flex-1 bg-white/5 rounded-xl px-4 py-3 font-miracode text-sm md:text-[16px] text-white placeholder:text-[#929292] focus:outline-none focus:ring-2 focus:ring-white/20 min-h-[44px]"
                  />
                  <button
                    type="button"
                    onClick={handleAddVacancy}
                    className="px-4 md:px-6 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors font-miracode text-sm md:text-[16px] min-h-[44px]"
                  >
                    Добавить
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {vacancies.map((vacancy, index) => (
                    <div
                      key={index}
                      className="bg-white/10 rounded-xl px-4 md:px-5 py-2.5 md:py-3 flex items-center gap-2"
                    >
                      <span className="font-miracode text-sm md:text-[16px]">
                        {vacancy}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveVacancy(index)}
                        className="text-white/40 hover:text-red-400 transition-colors p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M12 4L4 12M4 4l8 8" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block font-unbounded text-lg md:text-[24px] mb-2 md:mb-3">
                Нужные навыки
              </label>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyPress={e =>
                      e.key === 'Enter' &&
                      (e.preventDefault(), handleAddSkill())
                    }
                    placeholder="Введите навык..."
                    className="flex-1 bg-white/5 rounded-xl px-4 py-3 font-miracode text-sm md:text-[16px] text-white placeholder:text-[#929292] focus:outline-none focus:ring-2 focus:ring-white/20 min-h-[44px]"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 md:px-6 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors font-miracode text-sm md:text-[16px] min-h-[44px]"
                  >
                    Добавить
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-white/10 rounded-xl px-4 md:px-5 py-2.5 md:py-3 flex items-center gap-2"
                    >
                      <span className="font-miracode text-sm md:text-[16px]">
                        {skill}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(index)}
                        className="text-white/40 hover:text-red-400 transition-colors p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M12 4L4 12M4 4l8 8" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit button */}
          <div className="flex justify-center lg:justify-end pt-6 md:pt-8">
            <button
              type="submit"
              disabled={createProjectMutation.isPending}
              className="w-full sm:w-[292px] h-[55px] rounded-[20px] font-unbounded text-sm md:text-[16px] text-white transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background:
                  'linear-gradient(229deg, rgba(35,35,35,1) 0%, rgba(47,131,94,1) 100%)',
              }}
            >
              {createProjectMutation.isPending
                ? 'Создание...'
                : 'Завершить настройку'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
