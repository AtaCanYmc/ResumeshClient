import React, { useState } from 'react';
import { Project } from '../types';
import axios from 'axios';
import {
  Star,
  GitFork,
  Loader2,
  Code,
  FolderSearch,
  ChevronDown,
  FolderGit,
  AlertOctagon,
} from 'lucide-react';
import Modal from '../components/Modal';
import { useQuery } from '@tanstack/react-query';
import { ContentCard } from '../components/ui/ContentCard';
import { ContentCardSkeleton } from '../components/ui/ContentCardSkeleton';
import SEO from '../components/SEO';
import EmptyState from '../components/ui/EmptyState';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { useAppSettings } from '../hooks/useHomeData';
import { useEnv } from '../hooks/useEnv';

export default function Projects() {
  const { API_URL } = useEnv();
  const { data: settings } = useAppSettings();
  const { t } = useTranslation();

  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState<
    'stars' | 'forks' | 'date_desc' | 'date_asc' | 'alphabetical'
  >('stars');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // TanStack Query for data fetching
  const {
    data: projects = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await axios.get<Project[]>(`${API_URL}/api/v1/projects/`);
      return res.data;
    },
  });

  if (settings && settings.show_projects === false) {
    return <Navigate to="/" replace />;
  }

  if (isError) {
    return (
      <>
        <SEO title={`Hata | ResuMesh`} description="Projeler yüklenirken bir hata oluştu." />
        <div className="mx-auto max-w-4xl py-8">
          <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/30 dark:bg-red-900/10">
            <AlertOctagon className="mb-4 h-16 w-16 text-red-500" />
            <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-red-400">
              Projeler Yüklenemedi
            </h2>
            <p className="max-w-md text-gray-600 dark:text-gray-400">
              Açık kaynak projeleri yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.
            </p>
          </div>
        </div>
      </>
    );
  }

  // Extract unique languages
  const allLanguages = Array.from(new Set(projects.flatMap((p) => p.languages || []))).filter(
    Boolean
  );

  const filteredProjects =
    filter === 'All' ? projects : projects.filter((p) => p.languages?.includes(filter));

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'stars':
        return (b.stars || 0) - (a.stars || 0);
      case 'forks':
        return (b.forks || 0) - (a.forks || 0);
      case 'date_desc':
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      case 'date_asc':
        return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
      case 'alphabetical':
        return (a.name || a.title || '').localeCompare(b.name || b.title || '');
      default:
        return 0;
    }
  });

  return (
    <>
      <SEO title={`${t('projects.title')} | ResuMesh`} description={t('projects.subtitle')} />
      <div className="py-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              {t('projects.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{t('projects.subtitle')}</p>
          </div>
        </div>

        {/* Filters & Sorting */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          {/* Horizontal Scrollable Filters */}
          <div className="scrollbar-hide -mx-4 flex w-full gap-2 overflow-x-auto px-4 pb-2 whitespace-nowrap md:mx-0 md:w-auto md:px-0">
            <button
              onClick={() => setFilter('All')}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                filter === 'All'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
              }`}
            >
              All
            </button>
            {allLanguages.map((lang) => (
              <button
                key={lang}
                onClick={() => setFilter(lang)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  filter === lang
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Custom Headless Select */}
          <div className="relative w-full shrink-0 md:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pr-10 pl-4 text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
            >
              <option value="stars">Yıldız Sayısına Göre</option>
              <option value="forks">Fork Sayısına Göre</option>
              <option value="date_desc">Eklenme Tarihi (En Yeni)</option>
              <option value="date_asc">Eklenme Tarihi (En Eski)</option>
              <option value="alphabetical">Alfabetik (A-Z)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
              <ChevronDown size={16} aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Grid using ContentCard */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            // Skeleton Loaders
            Array.from({ length: 6 }).map((_, idx) => <ContentCardSkeleton key={idx} />)
          ) : projects.length === 0 ? (
            <EmptyState
              icon={FolderGit}
              title={t('projects.emptyTitle')}
              message={t('projects.emptyDesc')}
            />
          ) : sortedProjects.length > 0 ? (
            sortedProjects.map((project) => (
              <ContentCard
                key={project.id}
                title={project.name || project.title || ''}
                tags={project.languages || []}
                description={project.description || t('common.noDescription')}
                icon={<Code size={20} />}
                externalLink={project.url || undefined}
                onClick={() => setSelectedProject(project)}
                footerContent={
                  <>
                    <span className="flex items-center gap-1">
                      <Star size={14} aria-hidden="true" /> {project.stars || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork size={14} aria-hidden="true" /> {project.forks || 0}
                    </span>
                  </>
                }
              />
            ))
          ) : (
            // Empty State
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
                <FolderSearch size={32} aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                Proje Bulunamadı
              </h3>
              <p className="mx-auto mb-6 max-w-md text-gray-500 dark:text-gray-400">
                Seçtiğiniz{' '}
                <span className="font-semibold text-gray-700 dark:text-gray-300">"{filter}"</span>{' '}
                filtresine uygun bir açık kaynak projesi henüz eklenmemiş.
              </p>
              <button
                onClick={() => setFilter('All')}
                className="rounded-lg bg-blue-50 px-6 py-2.5 font-medium text-blue-600 transition-colors hover:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20"
              >
                Filtreleri Temizle
              </button>
            </div>
          )}
        </div>

        <Modal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          title={selectedProject?.name || selectedProject?.title}
        >
          {selectedProject && (
            <div className="space-y-6">
              <p className="text-base leading-relaxed whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {selectedProject.description || t('common.noDescription')}
              </p>

              <div className="flex flex-wrap gap-2">
                {selectedProject.languages?.map((lang) => (
                  <span
                    key={lang}
                    className="rounded-md border border-gray-200 bg-gray-100 px-3 py-1 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    {lang}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-6 border-t border-gray-200 pt-4 text-gray-600 dark:border-gray-800 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Star size={18} aria-hidden="true" />
                  <span>{selectedProject.stars || 0} Stars</span>
                </div>
                <div className="flex items-center gap-2">
                  <GitFork size={18} aria-hidden="true" />
                  <span>{selectedProject.forks || 0} Forks</span>
                </div>
                {selectedProject.url && (
                  <a
                    href={selectedProject.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="ml-auto flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <Code size={18} aria-hidden="true" />
                    <span>{t('common.viewOnGithub')}</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
}
