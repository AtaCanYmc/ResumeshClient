import React from 'react';
import { Download, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useContentConfig } from '../../hooks/useHomeData';
import { HeroSkeleton } from '../ui/Skeletons';
import { getIcon } from '../../utils/iconResolver';
import { useDownloadResume } from '../../hooks/useDownloadResume';
import { useEnv } from '../../hooks/useEnv';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const HeroSection: React.FC = () => {
  const env = useEnv();
  const { t, i18n } = useTranslation();
  const { data: config, isLoading } = useContentConfig(i18n.language);
  const { isDownloading, handleDownload } = useDownloadResume(config?.hero?.resumeLink);

  const avatarSrc = React.useMemo(() => {
    const img = config?.hero?.avatarImage;
    if (img && img.startsWith('http')) return img;
    if (img && img.startsWith('/api/')) return `${env.API_URL}${img}`;
    return '/images/profile_pic.jpeg';
  }, [config?.hero?.avatarImage, env.API_URL]);

  return (
    <div className="relative my-8 flex min-h-[50vh] items-center">
      <div className="flex min-h-[360px] w-full flex-col items-center justify-between gap-10 lg:flex-row">
        {isLoading || !config ? (
          <HeroSkeleton />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="z-10 flex-1 space-y-5 text-center lg:text-left"
          >
            <motion.h1
              variants={textVariants}
              className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl dark:text-zinc-100"
            >
              {t('home.greeting')}{' '}
              <span className="text-zinc-900 underline decoration-zinc-400 underline-offset-8 dark:text-zinc-100 dark:decoration-zinc-700">
                {config.hero.name}
              </span>
            </motion.h1>

            <motion.div
              variants={textVariants}
              className="text-xl font-medium tracking-tight text-zinc-700 sm:text-2xl lg:text-3xl dark:text-zinc-300"
            >
              {config.hero.title}
            </motion.div>

            <motion.p
              variants={textVariants}
              className="mx-auto max-w-2xl text-base leading-relaxed text-zinc-600 sm:text-lg lg:mx-0 dark:text-zinc-400"
            >
              {config.hero.description}
            </motion.p>

            <motion.div
              variants={textVariants}
              className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row lg:justify-start"
            >
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-zinc-100 transition-colors hover:bg-black focus:outline-none disabled:opacity-70 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
                aria-label={t('hero.downloadResume')}
              >
                {isDownloading ? (
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                ) : (
                  <Download size={16} aria-hidden="true" />
                )}
                <span>
                  {isDownloading ? t('hero.downloadingResume') : t('hero.downloadResume')}
                </span>
              </button>

              <Link
                to="/projects"
                className="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-6 py-2.5 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
                aria-label={t('hero.viewProjects')}
              >
                <span>{t('hero.viewProjects')}</span>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>

              <div className="mt-3 flex items-center gap-1.5 sm:mt-0 sm:ml-2">
                {config.socials.map((social: any) => {
                  const Icon = getIcon(social.icon || social.platform);
                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-zinc-200 bg-white p-2.5 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
                      aria-label={social.label || social.platform}
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Right Content: Clean Matte Profile Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden flex-1 items-center justify-center lg:flex"
        >
          <div className="relative flex h-[340px] w-[340px] flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white p-8 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/40">
            <div className="mb-5 h-28 w-28 overflow-hidden rounded-full border border-zinc-200 dark:border-zinc-700/80">
              <img
                src={avatarSrc}
                alt={config?.hero?.fullName || 'Profile Picture'}
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
            <h3 className="font-mono text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {config?.hero?.fullName || config?.hero?.name}
            </h3>
            <p className="mt-1.5 text-center font-mono text-xs text-zinc-500 dark:text-zinc-400">
              {config?.hero?.avatarSubtitle}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
