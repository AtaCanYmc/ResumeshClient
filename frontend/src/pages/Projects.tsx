import React, { useState } from 'react';
import { Project } from '../types';
import axios from 'axios';
import {
  Star,
  GitFork,
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

  const {
    data: projects = [],
    isLoading,
    isError,
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
          <div className="flex min-h-[30vh] flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
            <AlertOctagon className="mb-3 h-12 w-12 text-zinc-500 dark:text-zinc-400" />
            <h2 className="mb-1.5 text-lg font-bold text-zinc-900 dark:text-zinc-200">
              Projeler Yüklenemedi
            </h2>
            <p className="max-w-md text-sm text-zinc-600 dark:text-zinc-400">
              Açık kaynak projeleri yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.
            </p>
          </div>
        </div>
      </>
    );
  }

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
      <div className="py-6">
        <div className="mb-6 flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h1 className="font-mono text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-100">
              {t('projects.title')}
            </h1>
            <p className="mt-1 font-mono text-xs text-zinc-600 dark:text-zinc-400">
              {t('projects.subtitle')}
            </p>
          </div>
        </div>

        {/* Filters & Sorting */}
        <div className="mb-6 flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
          <div className="scrollbar-hide -mx-4 flex w-full gap-1.5 overflow-x-auto px-4 pb-2 whitespace-nowrap md:mx-0 md:w-auto md:px-0">
            <button
              onClick={() => setFilter('All')}
              className={`shrink-0 rounded-lg border px-3.5 py-1.5 font-mono text-xs font-medium transition-colors focus:outline-none ${
                filter === 'All'
                  ? 'border-zinc-300 bg-zinc-100 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100'
                  : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-200'
              }`}
            >
              All
            </button>
            {allLanguages.map((lang) => (
              <button
                key={lang}
                onClick={() => setFilter(lang)}
                className={`shrink-0 rounded-lg border px-3.5 py-1.5 font-mono text-xs font-medium transition-colors focus:outline-none ${
                  filter === lang
                    ? 'border-zinc-300 bg-zinc-100 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100'
                    : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-200'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          <div className="relative w-full shrink-0 md:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full cursor-pointer appearance-none rounded-lg border border-zinc-200 bg-white py-2 pr-9 pl-3 font-mono text-xs text-zinc-700 focus:border-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:focus:border-zinc-700"
            >
              <option value="stars">Yıldız Sayısına Göre</option>
              <option value="forks">Fork Sayısına Göre</option>
              <option value="date_desc">Eklenme Tarihi (En Yeni)</option>
              <option value="date_asc">Eklenme Tarihi (En Eski)</option>
              <option value="alphabetical">Alfabetik (A-Z)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-zinc-500">
              <ChevronDown size={14} aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Grid using ContentCard */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
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
                icon={<Code size={18} />}
                externalLink={project.url || undefined}
                onClick={() => setSelectedProject(project)}
                footerContent={
                  <>
                    <span className="flex items-center gap-1">
                      <Star size={13} aria-hidden="true" /> {project.stars || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork size={13} aria-hidden="true" /> {project.forks || 0}
                    </span>
                  </>
                }
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-100 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                <FolderSearch size={24} aria-hidden="true" />
              </div>
              <h3 className="mb-1 text-base font-bold text-zinc-900 dark:text-zinc-200">
                Proje Bulunamadı
              </h3>
              <p className="mx-auto mb-5 max-w-md font-mono text-xs text-zinc-600 dark:text-zinc-400">
                Seçtiğiniz <span className="text-zinc-900 dark:text-zinc-200">"{filter}"</span>{' '}
                filtresine uygun proje bulunamadı.
              </p>
              <button
                onClick={() => setFilter('All')}
                className="rounded-lg border border-zinc-200 bg-white px-4 py-2 font-mono text-xs text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
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
            <div className="space-y-5">
              <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                {selectedProject.description || t('common.noDescription')}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {selectedProject.languages?.map((lang) => (
                  <span
                    key={lang}
                    className="rounded-md border border-zinc-200 bg-zinc-100 px-2.5 py-1 font-mono text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400"
                  >
                    {lang}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-5 border-t border-zinc-200 pt-4 font-mono text-xs text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <Star size={15} aria-hidden="true" />
                  <span>{selectedProject.stars || 0} Stars</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <GitFork size={15} aria-hidden="true" />
                  <span>{selectedProject.forks || 0} Forks</span>
                </div>
                {selectedProject.url && (
                  <a
                    href={selectedProject.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="ml-auto flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-800 transition-colors hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
                  >
                    <Code size={15} aria-hidden="true" />
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
