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
      <div className="mb-3 last:mb-0">
        <h3 className="mb-1.5 flex items-center gap-1.5 px-3 font-mono text-[11px] font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
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
                  className="group flex flex-col rounded-lg px-3 py-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-sm font-medium text-zinc-900 group-hover:text-black dark:text-zinc-200 dark:group-hover:text-white">
                      {item.title}
                    </span>
                    <ExternalLink
                      size={14}
                      className="text-zinc-400 group-hover:text-zinc-700 dark:text-zinc-500 dark:group-hover:text-zinc-200"
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
                  onClick={() => {
                    setIsOpen(false);
                    setIsMobileExpanded(false);
                  }}
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
    <div ref={searchRef} className="relative flex w-full justify-end md:block">
      {!isMobileExpanded && (
        <button
          className="rounded-lg p-2 text-zinc-500 hover:text-zinc-900 focus:outline-none md:hidden dark:text-zinc-400 dark:hover:text-white"
          onClick={handleMobileExpand}
          aria-label={t('search.open')}
        >
          <Search size={18} aria-hidden="true" />
        </button>
      )}

      <div
        className={`absolute top-1/2 right-0 w-full -translate-y-1/2 md:relative md:translate-y-0 ${isMobileExpanded ? 'block' : 'hidden md:block'} `}
      >
        <div className="relative flex items-center rounded-lg border border-zinc-200 bg-white transition-colors focus-within:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:focus-within:border-zinc-700">
          <Search
            className="pointer-events-none absolute left-3 h-4 w-4 text-zinc-400 dark:text-zinc-500"
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
            className="w-full rounded-lg bg-transparent py-2 pr-10 pl-9 font-mono text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none dark:text-zinc-100 dark:placeholder-zinc-500"
            aria-label={t('search.placeholder')}
          />

          <div className="absolute right-2.5 flex items-center space-x-1.5">
            {loading && (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-500" aria-hidden="true" />
            )}
            {query && (
              <button
                type="button"
                className="rounded-md p-1 text-zinc-400 hover:text-zinc-900 focus:outline-none dark:hover:text-white"
                onClick={() => {
                  setQuery('');
                  setIsOpen(false);
                  inputRef.current?.focus();
                }}
                aria-label={t('search.clear')}
              >
                <X size={14} aria-hidden="true" />
              </button>
            )}
            {isMobileExpanded && !query && (
              <button
                className="p-1 text-zinc-500 hover:text-zinc-900 md:hidden dark:text-zinc-400 dark:hover:text-white"
                onClick={() => {
                  setIsMobileExpanded(false);
                  setIsOpen(false);
                }}
                aria-label={t('search.close')}
              >
                <X size={14} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && query.trim() !== '' && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 left-0 z-50 mt-2 max-h-[70vh] overflow-hidden overflow-y-auto rounded-xl border border-zinc-200 bg-white p-2 shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
          >
            {!loading && !hasResults && (
              <div className="flex flex-col items-center justify-center p-6 text-center">
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
