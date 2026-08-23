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
          <div className="flex min-h-[30vh] flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
            <AlertOctagon className="mb-3 h-12 w-12 text-zinc-500 dark:text-zinc-400" />
            <h2 className="mb-1.5 text-lg font-bold text-zinc-900 dark:text-zinc-200">
              Paketler Yüklenemedi
            </h2>
            <p className="max-w-md text-sm text-zinc-600 dark:text-zinc-400">
              Paketler ve kütüphaneler yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar
              deneyin.
            </p>
          </div>
        </div>
      </>
    );
  }

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
      <div className="py-6">
        <div className="mb-6 flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h1 className="font-mono text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-100">
              {t('packages.title')}
            </h1>
            <p className="mt-1 font-mono text-xs text-zinc-600 dark:text-zinc-400">
              {t('packages.subtitle')}
            </p>
          </div>
        </div>

        {/* Filters & Sorting */}
        <div className="mb-6 flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
          <div className="scrollbar-hide -mx-4 flex w-full gap-1.5 overflow-x-auto px-4 pb-2 whitespace-nowrap md:mx-0 md:w-auto md:px-0">
            <button
              onClick={() => setPlatformFilter('All')}
              className={`shrink-0 rounded-lg border px-3.5 py-1.5 font-mono text-xs font-medium transition-colors focus:outline-none ${
                platformFilter === 'All'
                  ? 'border-zinc-300 bg-zinc-100 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100'
                  : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-200'
              }`}
            >
              All
            </button>
            {platforms.map((platform) => (
              <button
                key={platform}
                onClick={() => setPlatformFilter(platform)}
                className={`shrink-0 rounded-lg border px-3.5 py-1.5 font-mono text-xs font-medium transition-colors focus:outline-none ${
                  platformFilter === platform
                    ? 'border-zinc-300 bg-zinc-100 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100'
                    : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-200'
                }`}
              >
                {platform}
              </button>
            ))}
          </div>

          <div className="relative w-full shrink-0 md:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full cursor-pointer appearance-none rounded-lg border border-zinc-200 bg-white py-2 pr-9 pl-3 font-mono text-xs text-zinc-700 focus:border-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:focus:border-zinc-700"
            >
              <option value="downloads">Aylık İndirmeye Göre</option>
              <option value="name">Alfabetik (A-Z)</option>
              <option value="platform">Platforma Göre</option>
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
                  icon={<PackageIcon size={18} />}
                  externalLink={pkg.url || pkg.docs_url || undefined}
                  onClick={() => setSelectedPackage(pkg)}
                  footerContent={
                    pkg.last_month_downloads !== undefined && pkg.last_month_downloads > 0 ? (
                      <span className="flex items-center gap-1 font-mono">
                        <Download size={13} aria-hidden="true" />
                        {pkg.last_month_downloads.toLocaleString()} / ay
                      </span>
                    ) : null
                  }
                />
              );
            })
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-100 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                <FolderSearch size={24} aria-hidden="true" />
              </div>
              <h3 className="mb-1 text-base font-bold text-zinc-900 dark:text-zinc-200">
                Paket Bulunamadı
              </h3>
              <p className="mx-auto mb-5 max-w-md font-mono text-xs text-zinc-600 dark:text-zinc-400">
                Seçtiğiniz filtreye uygun bir paket veya kütüphane bulunamadı.
              </p>
              <button
                onClick={() => setPlatformFilter('All')}
                className="rounded-lg border border-zinc-200 bg-white px-4 py-2 font-mono text-xs text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
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
            <div className="space-y-5">
              <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                {selectedPackage.description || t('common.noDescription')}
              </p>

              <div className="flex flex-wrap items-center gap-1.5">
                {selectedPackage.platform && (
                  <span className="rounded-md border border-zinc-200 bg-zinc-100 px-2.5 py-1 font-mono text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
                    {selectedPackage.platform}
                  </span>
                )}
                {selectedPackage.version && (
                  <span className="rounded-md border border-zinc-200 bg-zinc-100 px-2.5 py-1 font-mono text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                    v{selectedPackage.version}
                  </span>
                )}
                {selectedPackage.tags &&
                  selectedPackage.tags.split(',').map((tag) => (
                    <span
                      key={tag.trim()}
                      className="rounded-md border border-zinc-200 bg-zinc-100 px-2.5 py-1 font-mono text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400"
                    >
                      {tag.trim()}
                    </span>
                  ))}
              </div>

              <div className="flex flex-wrap items-center gap-4 border-t border-zinc-200 pt-4 font-mono text-xs text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
                {selectedPackage.last_month_downloads !== undefined &&
                  selectedPackage.last_month_downloads > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Download size={15} aria-hidden="true" />
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                        {selectedPackage.last_month_downloads.toLocaleString()}
                      </span>
                      <span>aylık indirme</span>
                    </div>
                  )}

                <div className="ml-auto flex flex-wrap items-center gap-2">
                  {selectedPackage.docs_url && (
                    <a
                      href={selectedPackage.docs_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-1.5 font-mono text-xs text-zinc-700 transition-colors hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
                    >
                      <BookOpen size={14} aria-hidden="true" />
                      <span>{t('packages.docs')}</span>
                    </a>
                  )}

                  {selectedPackage.url && (
                    <a
                      href={selectedPackage.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-100 px-3.5 py-1.5 font-mono text-xs font-semibold text-zinc-800 transition-colors hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
                    >
                      <ExternalLink size={14} aria-hidden="true" />
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
