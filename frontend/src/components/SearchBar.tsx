import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Loader2,
  FolderGit,
  Briefcase,
  BookOpen,
  Award,
  ExternalLink,
  X,
} from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { GlobalSearchResponse, SearchResultItem } from '../types';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useEnv } from '../hooks/useEnv';
import FocusTrap from 'focus-trap-react';

export default function SearchBar() {
  const { API_URL } = useEnv();
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 250);
  const [results, setResults] = useState<GlobalSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K / Escape) & custom event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsModalOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };

    const handleOpenSearchModal = () => setIsModalOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-search-modal', handleOpenSearchModal);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-search-modal', handleOpenSearchModal);
    };
  }, [isModalOpen]);

  // Focus input when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setResults(null);
    }
  }, [isModalOpen]);

  // Debounced search query fetching
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults(null);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get<GlobalSearchResponse>(`${API_URL}/api/v1/search/`, {
          params: { q: debouncedQuery },
        });
        setResults(response.data);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery, API_URL]);

  const closeModal = () => setIsModalOpen(false);

  const renderSection = (
    title: string,
    items: SearchResultItem[],
    icon: React.ReactNode,
    linkPrefix: string
  ) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="mb-4 last:mb-0">
        <h3 className="mb-2 flex items-center gap-1.5 px-3 font-mono text-[11px] font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
          {icon}
          {title}
        </h3>
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.id}>
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeModal}
                  className="group flex flex-col rounded-lg px-3 py-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-sm font-medium text-zinc-900 group-hover:text-black dark:text-zinc-200 dark:group-hover:text-white">
                      {item.title}
                    </span>
                    <ExternalLink
                      size={14}
                      className="ml-2 shrink-0 text-zinc-400 group-hover:text-zinc-700 dark:text-zinc-500 dark:group-hover:text-zinc-200"
                      aria-hidden="true"
                    />
                  </div>
                  {item.subtitle && (
                    <span className="line-clamp-1 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                      {item.subtitle}
                    </span>
                  )}
                </a>
              ) : (
                <Link
                  to={linkPrefix}
                  onClick={closeModal}
                  className="group flex flex-col rounded-lg px-3 py-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
                >
                  <span className="text-sm font-medium text-zinc-900 group-hover:text-black dark:text-zinc-200 dark:group-hover:text-white">
                    {item.title}
                  </span>
                  {item.subtitle && (
                    <span className="line-clamp-1 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                      {item.subtitle}
                    </span>
                  )}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const hasResults =
    results &&
    (results.projects.length > 0 ||
      results.experiences.length > 0 ||
      results.articles.length > 0 ||
      results.certificates.length > 0);

  return (
    <>
      {/* Magnifying Glass Button in Topbar */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
        aria-label={t('search.open')}
        title="Ara (Cmd+K)"
      >
        <Search size={18} aria-hidden="true" />
      </button>

      {/* Search Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <FocusTrap
            focusTrapOptions={{
              clickOutsideDeactivates: true,
              onDeactivate: closeModal,
            }}
          >
            <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-16 sm:pt-24">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeModal}
                className="fixed inset-0 bg-black/60 backdrop-blur-xs"
                aria-hidden="true"
              />

              {/* Modal Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -10 }}
                transition={{ duration: 0.15 }}
                className="relative z-10 flex max-h-[80vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
              >
                {/* Search Header Input */}
                <div className="flex items-center border-b border-zinc-200 px-4 py-3.5 dark:border-zinc-800">
                  <Search className="mr-3 h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-500" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('search.placeholder')}
                    className="w-full bg-transparent font-mono text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none sm:text-sm dark:text-zinc-100 dark:placeholder-zinc-500"
                  />
                  {loading && (
                    <Loader2
                      className="mr-2 h-4 w-4 animate-spin text-zinc-500"
                      aria-hidden="true"
                    />
                  )}
                  {query && (
                    <button
                      onClick={() => {
                        setQuery('');
                        inputRef.current?.focus();
                      }}
                      className="mr-2 rounded-md p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                    >
                      <X size={14} />
                    </button>
                  )}
                  <button
                    onClick={closeModal}
                    className="rounded-lg border border-zinc-200 bg-zinc-100 px-2 py-1 font-mono text-[11px] font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
                  >
                    ESC
                  </button>
                </div>

                {/* Search Results Area */}
                <div className="flex-1 overflow-y-auto p-4">
                  {!query.trim() && (
                    <div className="py-8 text-center font-mono text-xs text-zinc-500 dark:text-zinc-500">
                      Aramaya başlamak için bir kelime yazın...
                    </div>
                  )}

                  {query.trim() && !loading && !hasResults && (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Search
                        size={24}
                        className="mb-2 text-zinc-400 dark:text-zinc-600"
                        aria-hidden="true"
                      />
                      <p className="font-mono text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        {t('search.noResultsTitle')}
                      </p>
                      <p className="mt-1 font-mono text-[11px] text-zinc-500">
                        {t('search.noResultsDesc')}
                      </p>
                    </div>
                  )}

                  {results && hasResults && (
                    <>
                      {renderSection(
                        t('search.projects'),
                        results.projects,
                        <FolderGit size={13} aria-hidden="true" />,
                        '/projects'
                      )}
                      {renderSection(
                        t('search.experiences'),
                        results.experiences,
                        <Briefcase size={13} aria-hidden="true" />,
                        '/experiences'
                      )}
                      {renderSection(
                        t('search.articles'),
                        results.articles,
                        <BookOpen size={13} aria-hidden="true" />,
                        '/articles'
                      )}
                      {renderSection(
                        t('search.certificates'),
                        results.certificates,
                        <Award size={13} aria-hidden="true" />,
                        '/certificates'
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          </FocusTrap>
        )}
      </AnimatePresence>
    </>
  );
}
