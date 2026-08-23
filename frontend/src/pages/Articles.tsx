import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import axios from 'axios';
import { ExternalLink, Clock, Calendar, BookOpen } from 'lucide-react';
import Modal from '../components/Modal';
import SEO from '../components/SEO';
import EmptyState from '../components/ui/EmptyState';
import { useTranslation } from 'react-i18next';
import { useEnv } from '../hooks/useEnv';
import { ArticlesSkeleton } from '../components/ui/Skeletons';

export default function Articles() {
  const { API_URL } = useEnv();
  const { t } = useTranslation();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'MEDIUM' | 'DEV_TO'>('MEDIUM');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get<Article[]>(`${API_URL}/api/v1/articles/`);
        setArticles(res.data);
      } catch (error) {
        console.error('Failed to fetch articles', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const filteredArticles = articles.filter(
    (a) =>
      a.platform?.toUpperCase() === activeTab || (activeTab === 'DEV_TO' && a.platform === 'Dev.to')
  );

  if (loading) {
    return <ArticlesSkeleton />;
  }

  return (
    <>
      <SEO title={`${t('articles.title')} | ResuMesh`} description={t('articles.subtitle')} />
      <div className="py-6">
        <div className="mb-6 flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h1 className="font-mono text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
              {t('articles.title')}
            </h1>
            <p className="mt-1 font-mono text-xs text-zinc-400">{t('articles.subtitle')}</p>
          </div>

          <div className="flex rounded-lg border border-zinc-800 bg-zinc-950 p-1 font-mono text-xs">
            <button
              onClick={() => setActiveTab('MEDIUM')}
              className={`rounded-md px-4 py-1.5 font-medium transition-colors ${
                activeTab === 'MEDIUM'
                  ? 'border border-zinc-700 bg-zinc-900 text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Medium
            </button>
            <button
              onClick={() => setActiveTab('DEV_TO')}
              className={`rounded-md px-4 py-1.5 font-medium transition-colors ${
                activeTab === 'DEV_TO'
                  ? 'border border-zinc-700 bg-zinc-900 text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Dev.to
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="group block cursor-pointer rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-5 transition-colors hover:border-zinc-700/80 hover:bg-zinc-900/80"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <h3 className="line-clamp-2 text-base font-semibold text-zinc-100 transition-colors group-hover:text-white">
                  {article.title}
                </h3>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="shrink-0 text-zinc-500 transition-colors hover:text-zinc-200"
                >
                  <ExternalLink size={18} />
                </a>
              </div>

              <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-zinc-400">
                {article.summary || 'Açıklama bulunmuyor.'}
              </p>

              <div className="mt-auto flex items-center space-x-4 border-t border-zinc-800/80 pt-3 font-mono text-xs text-zinc-400">
                {article.published_at && (
                  <div className="flex items-center space-x-1">
                    <Calendar size={13} />
                    <span>{new Date(article.published_at).toLocaleDateString()}</span>
                  </div>
                )}
                {article.reading_time_minutes && (
                  <div className="flex items-center space-x-1">
                    <Clock size={13} />
                    <span>{article.reading_time_minutes} min read</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          {filteredArticles.length === 0 && (
            <EmptyState
              icon={BookOpen}
              title={t('articles.emptyTitle')}
              message={t('articles.emptyDesc', { platform: activeTab })}
            />
          )}
        </div>

        <Modal
          isOpen={!!selectedArticle}
          onClose={() => setSelectedArticle(null)}
          title={selectedArticle?.title}
        >
          {selectedArticle && (
            <div className="space-y-5">
              <p className="text-sm leading-relaxed text-zinc-300">
                {selectedArticle.summary || t('common.noDescription')}
              </p>

              <div className="flex items-center gap-5 border-t border-zinc-800 pt-4 font-mono text-xs text-zinc-400">
                {selectedArticle.published_at && (
                  <div className="flex items-center space-x-1.5">
                    <Calendar size={15} />
                    <span>{new Date(selectedArticle.published_at).toLocaleDateString()}</span>
                  </div>
                )}
                {selectedArticle.reading_time_minutes && (
                  <div className="flex items-center space-x-1.5">
                    <Clock size={15} />
                    <span>{selectedArticle.reading_time_minutes} min read</span>
                  </div>
                )}
                <a
                  href={selectedArticle.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 font-mono text-xs font-semibold text-zinc-200 transition-colors hover:border-zinc-700 hover:text-zinc-100"
                >
                  <ExternalLink size={15} />
                  <span>{t('common.readMore')}</span>
                </a>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
}
