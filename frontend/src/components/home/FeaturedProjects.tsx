import React from 'react';
import { ExternalLink, Star, GitFork } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useProjects } from '../../hooks/useHomeData';
import { ProjectsSkeleton } from '../ui/Skeletons';

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

const FeaturedProjects: React.FC = () => {
  const { t } = useTranslation();
  const { data: projects, isLoading } = useProjects(6);

  if (isLoading) return <ProjectsSkeleton />;
  if (!projects || projects.length === 0) return null;

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
          {t('home.featuredProjects')}
        </h2>
        <p className="mt-1 font-mono text-xs text-zinc-600 dark:text-zinc-400">
          {t('projects.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project: any) => {
          const stars = project.stars ?? project.stargazers_count ?? 0;
          const forks = project.forks ?? project.forks_count ?? 0;
          const languages = project.languages || (project.language ? [project.language] : []);

          return (
            <motion.div variants={itemVariants} key={project.id} className="h-full">
              <a
                href={project.url || project.html_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:hover:border-zinc-700/80 dark:hover:bg-zinc-900/80"
                aria-label={`${project.name || project.title} projesine git`}
              >
                <div>
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h3 className="line-clamp-1 text-base font-semibold text-zinc-900 transition-colors group-hover:text-black dark:text-zinc-100 dark:group-hover:text-white">
                      {project.name || project.title}
                    </h3>
                    <ExternalLink
                      size={16}
                      className="flex-shrink-0 text-zinc-400 transition-colors group-hover:text-zinc-700 dark:text-zinc-500 dark:group-hover:text-zinc-300"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="line-clamp-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {project.description || 'Açıklama bulunmuyor.'}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-zinc-200/80 pt-3 font-mono text-xs text-zinc-500 dark:border-zinc-800/80 dark:text-zinc-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Star size={13} className="text-zinc-400" aria-hidden="true" />
                      {stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork size={13} className="text-zinc-400" aria-hidden="true" />
                      {forks}
                    </span>
                  </div>
                  {languages.length > 0 && (
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      {languages[0]}
                    </span>
                  )}
                </div>
              </a>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default FeaturedProjects;
