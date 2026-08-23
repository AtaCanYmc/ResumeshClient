import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import axios from 'axios';
import { Loader2, ExternalLink, Clock, Calendar, BookOpen } from 'lucide-react';
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

  const filteredArticles = articles.filter((a) => a.platform === activeTab);

  if (loading) {
    return <ArticlesSkeleton />;
  }

  return (
    <>
      <SEO title={`${t('articles.title')} | ResuMesh`} description={t('articles.subtitle')} />
      <div className="py-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-white">
              {t('articles.title')}
            </h1>
            <p className="text-gray-400">{t('articles.subtitle')}</p>
          </div>

          {/* Tabs */}
          <div className="flex rounded-lg border border-gray-800 bg-gray-900 p-1">
            <button
              onClick={() => setActiveTab('MEDIUM')}
              className={`rounded-md px-6 py-2 text-sm font-medium transition-all ${
                activeTab === 'MEDIUM'
                  ? 'border border-gray-700 bg-black text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Medium
            </button>
            <button
              onClick={() => setActiveTab('DEV_TO')}
              className={`rounded-md px-6 py-2 text-sm font-medium transition-all ${
                activeTab === 'DEV_TO'
                  ? 'border border-gray-700 bg-black text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Dev.to
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="group block cursor-pointer rounded-xl border border-gray-800 bg-gray-900 p-6 transition-colors hover:border-gray-600"
            >
              <div className="mb-4 flex items-start justify-between">
                <h3 className="line-clamp-2 text-xl font-bold text-gray-100 transition-colors group-hover:text-blue-400">
                  {article.title}
                </h3>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="ml-4 shrink-0 text-gray-600 group-hover:text-blue-400"
                >
                  <ExternalLink size={20} />
                </a>
              </div>

              <p className="mb-6 line-clamp-3 text-sm text-gray-400">
                {article.summary || 'Açıklama bulunmuyor.'}
              </p>

              <div className="mt-auto flex items-center space-x-4 text-xs font-medium text-gray-500">
                {article.published_at && (
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>{new Date(article.published_at).toLocaleDateString()}</span>
                  </div>
                )}
                {article.reading_time_minutes && (
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
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
            <div className="space-y-6">
              <p className="text-base leading-relaxed whitespace-pre-wrap text-gray-300">
                {selectedArticle.summary || t('common.noDescription')}
              </p>

              <div className="flex items-center gap-6 border-t border-gray-800 pt-4 text-gray-400">
                {selectedArticle.published_at && (
                  <div className="flex items-center space-x-2">
                    <Calendar size={18} />
                    <span>{new Date(selectedArticle.published_at).toLocaleDateString()}</span>
                  </div>
                )}
                {selectedArticle.reading_time_minutes && (
                  <div className="flex items-center space-x-2">
                    <Clock size={18} />
                    <span>{selectedArticle.reading_time_minutes} min read</span>
                  </div>
                )}
                <a
                  href={selectedArticle.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                >
                  <ExternalLink size={18} />
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
