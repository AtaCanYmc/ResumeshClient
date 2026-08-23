import React, { useState } from 'react';
import { Package } from '../types';
import {
  Package as PackageIcon,
  Download,
  ExternalLink,
  BookOpen,
  ChevronDown,
  FolderSearch,
  AlertOctagon,
} from 'lucide-react';
import Modal from '../components/Modal';
import { ContentCard } from '../components/ui/ContentCard';
import { ContentCardSkeleton } from '../components/ui/ContentCardSkeleton';
import SEO from '../components/SEO';
import EmptyState from '../components/ui/EmptyState';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { useAppSettings, usePackages } from '../hooks/useHomeData';

export default function Packages() {
  const { data: settings } = useAppSettings();
  const { t } = useTranslation();

  const [platformFilter, setPlatformFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'downloads' | 'name' | 'platform'>('downloads');
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  const { data: packages = [], isLoading, isError } = usePackages();

  if (settings && settings.show_packages === false) {
    return <Navigate to="/" replace />;
  }

  if (isError) {
    return (
      <>
        <SEO title={`Hata | ResuMesh`} description="Paketler yüklenirken bir hata oluştu." />
        <div className="mx-auto max-w-4xl py-8">
          <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/30 dark:bg-red-900/10">
            <AlertOctagon className="mb-4 h-16 w-16 text-red-500" />
            <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-red-400">
              Paketler Yüklenemedi
            </h2>
            <p className="max-w-md text-gray-600 dark:text-gray-400">
              Paketler ve kütüphaneler yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar
              deneyin.
            </p>
          </div>
        </div>
      </>
    );
  }

  // Extract unique platforms
  const platforms = Array.from(
    new Set((packages as Package[]).map((p) => p.platform).filter(Boolean))
  );

  const filteredPackages = (packages as Package[]).filter((pkg) => {
    if (platformFilter !== 'All' && pkg.platform !== platformFilter) return false;
    return true;
  });

  const sortedPackages = [...filteredPackages].sort((a, b) => {
    switch (sortBy) {
      case 'downloads':
        return (b.last_month_downloads || 0) - (a.last_month_downloads || 0);
      case 'name':
        return (a.title || '').localeCompare(b.title || '');
      case 'platform':
        return (a.platform || '').localeCompare(b.platform || '');
      default:
        return 0;
    }
  });

  return (
    <>
      <SEO title={`${t('packages.title')} | ResuMesh`} description={t('packages.subtitle')} />
      <div className="py-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              {t('packages.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{t('packages.subtitle')}</p>
          </div>
        </div>

        {/* Filters & Sorting */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          {/* Platform Filters */}
          <div className="scrollbar-hide -mx-4 flex w-full gap-2 overflow-x-auto px-4 pb-2 whitespace-nowrap md:mx-0 md:w-auto md:px-0">
            <button
              onClick={() => setPlatformFilter('All')}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                platformFilter === 'All'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
              }`}
            >
              All
            </button>
            {platforms.map((platform) => (
              <button
                key={platform}
                onClick={() => setPlatformFilter(platform)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  platformFilter === platform
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                }`}
              >
                {platform}
              </button>
            ))}
          </div>

          {/* Sorting */}
          <div className="relative w-full shrink-0 md:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pr-10 pl-4 text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
            >
              <option value="downloads">Aylık İndirmeye Göre</option>
              <option value="name">Alfabetik (A-Z)</option>
              <option value="platform">Platforma Göre</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
              <ChevronDown size={16} aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Grid using ContentCard */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, idx) => <ContentCardSkeleton key={idx} />)
          ) : packages.length === 0 ? (
            <EmptyState
              icon={PackageIcon}
              title={t('packages.emptyTitle')}
              message={t('packages.emptyDesc')}
            />
          ) : sortedPackages.length > 0 ? (
            sortedPackages.map((pkg) => {
              const tagsArray = pkg.tags
                ? pkg.tags
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean)
                : [];
              if (pkg.platform && !tagsArray.includes(pkg.platform)) {
                tagsArray.unshift(pkg.platform);
              }
              if (pkg.version) {
                tagsArray.push(`v${pkg.version}`);
              }

              return (
                <ContentCard
                  key={pkg.id}
                  title={pkg.title}
                  tags={tagsArray}
                  description={pkg.description || t('common.noDescription')}
                  icon={<PackageIcon size={20} />}
                  externalLink={pkg.url || pkg.docs_url || undefined}
                  onClick={() => setSelectedPackage(pkg)}
                  footerContent={
                    pkg.last_month_downloads !== undefined && pkg.last_month_downloads > 0 ? (
                      <span className="flex items-center gap-1">
                        <Download size={14} aria-hidden="true" />
                        {pkg.last_month_downloads.toLocaleString()} / ay
                      </span>
                    ) : null
                  }
                />
              );
            })
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
                <FolderSearch size={32} aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                Paket Bulunamadı
              </h3>
              <p className="mx-auto mb-6 max-w-md text-gray-500 dark:text-gray-400">
                Seçtiğiniz filtreye uygun bir paket veya kütüphane bulunamadı.
              </p>
              <button
                onClick={() => {
                  setPlatformFilter('All');
                }}
                className="rounded-lg bg-blue-50 px-6 py-2.5 font-medium text-blue-600 transition-colors hover:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20"
              >
                Filtreleri Temizle
              </button>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        <Modal
          isOpen={!!selectedPackage}
          onClose={() => setSelectedPackage(null)}
          title={selectedPackage?.title}
        >
          {selectedPackage && (
            <div className="space-y-6">
              <p className="text-base leading-relaxed whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {selectedPackage.description || t('common.noDescription')}
              </p>

              {/* Tags & Metadata */}
              <div className="flex flex-wrap items-center gap-2">
                {selectedPackage.platform && (
                  <span className="rounded-md border border-blue-200 bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800 dark:border-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                    {selectedPackage.platform}
                  </span>
                )}
                {selectedPackage.version && (
                  <span className="rounded-md border border-gray-200 bg-gray-100 px-3 py-1 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    v{selectedPackage.version}
                  </span>
                )}
                {selectedPackage.tags &&
                  selectedPackage.tags.split(',').map((tag) => (
                    <span
                      key={tag.trim()}
                      className="rounded-md border border-gray-200 bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    >
                      {tag.trim()}
                    </span>
                  ))}
              </div>

              {/* Download & Links */}
              <div className="flex flex-wrap items-center gap-4 border-t border-gray-200 pt-4 text-gray-600 dark:border-gray-800 dark:text-gray-400">
                {selectedPackage.last_month_downloads !== undefined &&
                  selectedPackage.last_month_downloads > 0 && (
                    <div className="flex items-center gap-2">
                      <Download size={18} aria-hidden="true" />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {selectedPackage.last_month_downloads.toLocaleString()}
                      </span>
                      <span className="text-sm">aylık indirme</span>
                    </div>
                  )}

                <div className="ml-auto flex flex-wrap items-center gap-3">
                  {selectedPackage.docs_url && (
                    <a
                      href={selectedPackage.docs_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      <BookOpen size={16} aria-hidden="true" />
                      <span>{t('packages.docs')}</span>
                    </a>
                  )}

                  {selectedPackage.url && (
                    <a
                      href={selectedPackage.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      <ExternalLink size={16} aria-hidden="true" />
                      <span>Platform Sayfası</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
}
