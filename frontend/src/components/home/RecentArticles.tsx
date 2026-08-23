import React from 'react';
import { ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useArticles } from '../../hooks/useHomeData';
import { ArticlesSkeleton } from '../ui/Skeletons';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function RecentArticles() {
  const { t } = useTranslation();
  const { data: articles, isLoading } = useArticles(6);

  if (isLoading) return <ArticlesSkeleton />;
  if (!articles || articles.length === 0) return null;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className="py-10"
    >
      <div className="mb-8">
        <h2 className="font-mono text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
          {t('home.recentArticles')}
        </h2>
        <p className="mt-1 font-mono text-xs text-zinc-600 dark:text-zinc-400">
          {t('articles.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {articles.map((article: any) => {
          return (
            <motion.div variants={itemVariants} key={article.id} className="h-full">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:hover:border-zinc-700/80 dark:hover:bg-zinc-900/80"
              >
                <div>
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="rounded-md border border-zinc-200 bg-zinc-100 px-2 py-0.5 font-mono text-[11px] text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                      {article.platform || 'Article'}
                    </span>
                    {article.published_at && (
                      <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                        {new Date(article.published_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <h3 className="mb-2 line-clamp-2 text-base font-semibold text-zinc-900 transition-colors group-hover:text-black dark:text-zinc-100 dark:group-hover:text-white">
                    {article.title}
                  </h3>

                  <p className="line-clamp-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {article.summary || article.description || 'İçerik özeti bulunmuyor.'}
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-1.5 border-t border-zinc-200/80 pt-3 font-mono text-xs font-medium text-zinc-700 transition-colors group-hover:text-black dark:border-zinc-800/80 dark:text-zinc-300 dark:group-hover:text-white">
                  <span>{t('home.readArticle')}</span>
                  <ExternalLink size={13} aria-hidden="true" />
                </div>
              </a>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
