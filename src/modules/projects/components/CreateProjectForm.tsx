'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import type { ProjectCreate, ProjectStatus } from '@/types/api';

interface CreateProjectFormProps {
  onSubmit?: (data: ProjectCreate) => void;
  onSubmitWithImage?: (data: {
    projectData: ProjectCreate;
    imageFile?: File;
  }) => void;
  isLoading?: boolean;
}

export default function CreateProjectForm({
  onSubmit,
  onSubmitWithImage,
  isLoading = false,
}: CreateProjectFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ProjectCreate>({
    name: '',
    title: '',
    subtitle: '',
    description: '',
    status: 'prototype',
    tag_ids: [],
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof ProjectCreate, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          image: 'Image size must be less than 5MB',
        }));
        return;
      }

      // Validate file type
      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
      ];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          image: 'Only JPG, PNG, and WebP images are allowed',
        }));
        return;
      }

      // Clear any previous image errors
      setErrors(prev => ({ ...prev, image: '' }));

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = e => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Project name must be at least 3 characters long';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Project title must be at least 5 characters long';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    } else if (formData.description.trim().length < 20) {
      newErrors.description =
        'Project description must be at least 20 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // If we have both callbacks, prefer the one with image support
    if (onSubmitWithImage) {
      onSubmitWithImage({
        projectData: formData,
        imageFile: selectedImage || undefined,
      });
    } else if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-unbounded font-bold text-white mb-2">
              Create New Project
            </h1>
            <p className="text-white/60 font-montserrat">
              Start building your next innovative project
            </p>
          </div>
          <Button
            type="button"
            onClick={() => router.back()}
            variant="ghost"
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            <svg
              className="w-5 h-5 mr-2"
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
            Back
          </Button>
        </div>

        {/* Main Form */}
        <div className="bg-white/5 backdrop-blur-sm rounded-[20px] p-8 space-y-8">
          {/* Project Image */}
          <div>
            <label className="block text-lg font-unbounded font-medium text-white mb-4">
              Project Image
            </label>
            <div className="flex items-start gap-6">
              {/* Image Preview */}
              <div className="flex-shrink-0">
                {imagePreview ? (
                  <div className="relative w-40 h-40 rounded-[15px] overflow-hidden bg-white/10">
                    <Image
                      src={imagePreview}
                      alt="Project preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-40 h-40 border-2 border-dashed border-white/30 rounded-[15px] flex flex-col items-center justify-center cursor-pointer hover:border-[#00A851]/50 hover:bg-[#00A851]/5 transition-all duration-300"
                  >
                    <svg
                      className="w-8 h-8 text-white/60 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span className="text-white/60 font-montserrat text-sm text-center">
                      Click to upload
                      <br />
                      project image
                    </span>
                  </div>
                )}
              </div>

              {/* Upload Instructions */}
              <div className="flex-1">
                <p className="text-white/80 font-montserrat mb-2">
                  Upload a high-quality image that represents your project
                </p>
                <ul className="text-white/60 font-montserrat text-sm space-y-1">
                  <li>• Recommended size: 400x400px or larger</li>
                  <li>• Supported formats: JPG, PNG, WebP</li>
                  <li>• Maximum file size: 5MB</li>
                </ul>
                {!imagePreview && (
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="mt-4 border-white/20 text-white hover:bg-white/10"
                  >
                    Choose File
                  </Button>
                )}
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            {errors.image && (
              <p className="mt-2 text-sm text-red-400 font-montserrat">
                {errors.image}
              </p>
            )}
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Project Name *"
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                placeholder="Enter project name"
                error={errors.name}
                className="bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-[#00A851] focus:ring-2 focus:ring-[#00A851]/20"
              />
            </div>
            <div>
              <Input
                label="Project Title *"
                value={formData.title}
                onChange={e => handleInputChange('title', e.target.value)}
                placeholder="Enter project title"
                error={errors.title}
                className="bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-[#00A851] focus:ring-2 focus:ring-[#00A851]/20"
              />
            </div>
          </div>

          <div>
            <Input
              label="Project Subtitle"
              value={formData.subtitle}
              onChange={e => handleInputChange('subtitle', e.target.value)}
              placeholder="Brief description of your project"
              className="bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-[#00A851]"
            />
          </div>

          <div>
            <label className="block text-sm font-montserrat text-white/80 mb-2">
              Project Description *
            </label>
            <textarea
              value={formData.description}
              onChange={e => handleInputChange('description', e.target.value)}
              placeholder="Describe your project, its goals, and what makes it unique..."
              rows={6}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-montserrat placeholder-white/50 focus:outline-none focus:border-[#00A851] focus:ring-2 focus:ring-[#00A851]/20 transition-all duration-300 resize-none"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-400 font-montserrat">
                {errors.description}
              </p>
            )}
          </div>

          {/* Project Status */}
          <div>
            <label className="block text-sm font-montserrat text-white/80 mb-2">
              Project Status
            </label>
            <select
              value={formData.status}
              onChange={e =>
                handleInputChange('status', e.target.value as ProjectStatus)
              }
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-montserrat focus:outline-none focus:border-[#00A851] focus:ring-2 focus:ring-[#00A851]/20 transition-all duration-300"
            >
              <option value="prototype">Prototype</option>
              <option value="mvp">MVP</option>
              <option value="beta">Beta</option>
              <option value="release">Release</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            onClick={() => router.back()}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isLoading}
            className="bg-[#00A851] hover:bg-[#008f45] text-white border-none px-8"
          >
            Create Project
          </Button>
        </div>
      </form>
    </div>
  );
}
