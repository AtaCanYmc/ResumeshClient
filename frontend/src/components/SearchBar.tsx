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

export default function SearchBar() {
  const { API_URL } = useEnv();
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = useState<GlobalSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults(null);
      setIsOpen(false);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get<GlobalSearchResponse>(`${API_URL}/api/v1/search/`, {
          params: { q: debouncedQuery },
        });
        setResults(response.data);
        setIsOpen(true);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsMobileExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMobileExpand = () => {
    setIsMobileExpanded(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const renderSection = (
    title: string,
    items: SearchResultItem[],
    icon: React.ReactNode,
    linkPrefix: string
  ) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="mb-4 last:mb-0">
        <h3 className="mb-2 flex items-center gap-2 px-3 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
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
                  onClick={() => setIsMobileExpanded(false)}
                  className="group flex flex-col rounded-lg px-3 py-2 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-gray-800"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 dark:text-gray-200 dark:group-hover:text-blue-400">
                      {item.title}
                    </span>
                    <ExternalLink
                      size={14}
                      className="text-gray-500 group-hover:text-blue-600 dark:text-gray-600 dark:group-hover:text-blue-400"
                      aria-hidden="true"
                    />
                  </div>
                  {item.subtitle && (
                    <span className="line-clamp-1 text-xs text-gray-500">{item.subtitle}</span>
                  )}
                </a>
              ) : (
                <Link
                  to={linkPrefix}
                  onClick={() => {
                    setIsOpen(false);
                    setIsMobileExpanded(false);
                  }}
                  className="group flex flex-col rounded-lg px-3 py-2 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-gray-800"
                >
                  <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 dark:text-gray-200 dark:group-hover:text-blue-400">
                    {item.title}
                  </span>
                  {item.subtitle && (
                    <span className="line-clamp-1 text-xs text-gray-500">{item.subtitle}</span>
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
    <div ref={searchRef} className="relative flex w-full justify-end md:block">
      {/* Mobile Search Icon (only visible when not expanded) */}
      {!isMobileExpanded && (
        <button
          className="rounded-full p-2 text-gray-500 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 md:hidden dark:text-gray-400 dark:hover:text-white"
          onClick={handleMobileExpand}
          aria-label={t('search.open')}
        >
          <Search size={20} aria-hidden="true" />
        </button>
      )}

      {/* Search Input Container */}
      <div
        className={`absolute top-1/2 right-0 w-full -translate-y-1/2 md:relative md:translate-y-0 ${isMobileExpanded ? 'block' : 'hidden md:block'} `}
      >
        <div className="relative flex items-center rounded-xl border border-gray-300 bg-white shadow-sm transition-all focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:border-blue-500">
          <Search
            className="pointer-events-none absolute left-4 h-5 w-5 text-gray-400 dark:text-gray-500"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value.trim() && results) setIsOpen(true);
            }}
            onFocus={() => {
              if (query.trim() && results) setIsOpen(true);
            }}
            placeholder={t('search.placeholder')}
            className="w-full rounded-xl bg-transparent py-2.5 pr-16 pl-12 text-sm text-gray-900 placeholder-gray-500 focus:outline-none dark:text-white"
            aria-label={t('search.placeholder')}
          />

          <div className="absolute right-3 flex items-center space-x-2">
            {loading && (
              <Loader2 className="h-4 w-4 animate-spin text-blue-500" aria-hidden="true" />
            )}
            {query && (
              <button
                type="button"
                className="rounded-full p-1 text-gray-400 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:text-white"
                onClick={() => {
                  setQuery('');
                  setIsOpen(false);
                  inputRef.current?.focus();
                }}
                aria-label={t('search.clear')}
              >
                <X size={16} aria-hidden="true" />
              </button>
            )}
            {isMobileExpanded && !query && (
              <button
                className="p-1 text-gray-500 hover:text-gray-900 md:hidden dark:text-gray-400 dark:hover:text-white"
                onClick={() => {
                  setIsMobileExpanded(false);
                  setIsOpen(false);
                }}
                aria-label={t('search.close')}
              >
                <X size={16} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && query.trim() !== '' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 left-0 z-50 mt-3 max-h-[70vh] overflow-hidden overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-2xl md:mt-2 dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="p-2">
              {!loading && !hasResults && (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <Search
                    size={32}
                    className="mb-3 text-gray-300 dark:text-gray-700"
                    aria-hidden="true"
                  />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {t('search.noResultsTitle')}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">{t('search.noResultsDesc')}</p>
                </div>
              )}

              {results && hasResults && (
                <>
                  {renderSection(
                    t('search.projects'),
                    results.projects,
                    <FolderGit size={14} aria-hidden="true" />,
                    '/projects'
                  )}
                  {renderSection(
                    t('search.experiences'),
                    results.experiences,
                    <Briefcase size={14} aria-hidden="true" />,
                    '/experiences'
                  )}
                  {renderSection(
                    t('search.articles'),
                    results.articles,
                    <BookOpen size={14} aria-hidden="true" />,
                    '/articles'
                  )}
                  {renderSection(
                    t('search.certificates'),
                    results.certificates,
                    <Award size={14} aria-hidden="true" />,
                    '/certificates'
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
