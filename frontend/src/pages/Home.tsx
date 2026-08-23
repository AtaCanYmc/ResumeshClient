import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import HeroSection from '../components/home/HeroSection';
import SEO from '../components/SEO';
import InfiniteMarquee from '../components/ui/InfiniteMarquee';
import { useContentConfig, useAppSettings } from '../hooks/useHomeData';

const QuickMetrics = lazy(() => import('../components/home/QuickMetrics'));
const FeaturedProjects = lazy(() => import('../components/home/FeaturedProjects'));
const Timeline = lazy(() => import('../components/home/Timeline'));
const RecentArticles = lazy(() => import('../components/home/RecentArticles'));
const SkillsMarquee = lazy(() => import('../components/home/SkillsMarquee'));
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const Home: React.FC = () => {
  const { i18n } = useTranslation();
  const { data: config } = useContentConfig(i18n.language);
  const { data: settings } = useAppSettings();

  return (
    <>
      <SEO
        title={config?.hero.name ? `${config.hero.name} | Portfolio` : 'Portfolio'}
        description={config?.hero.description || 'Portfolio'}
      />
      <motion.div
        className="flex flex-col gap-24 pb-24 md:gap-32"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <HeroSection />

        {config && (
          <div className="-mx-4 overflow-hidden border-y border-gray-200 bg-white/30 px-4 py-12 backdrop-blur-sm sm:-mx-8 sm:px-8 dark:border-gray-800 dark:bg-black/20">
            <InfiniteMarquee
              items={config.marquee.map((tech: string) => (
                <span
                  key={tech}
                  className="text-xl font-bold tracking-widest text-gray-400 uppercase transition-colors hover:text-blue-500 md:text-2xl dark:text-gray-600 dark:hover:text-blue-400"
                >
                  {tech}
                </span>
              ))}
              speed="normal"
            />
          </div>
        )}

        <Suspense
          fallback={
            <div className="flex h-40 items-center justify-center opacity-50">Yükleniyor...</div>
          }
        >
          <QuickMetrics />
          {settings?.show_experiences !== false && <Timeline />}
          <SkillsMarquee />
          {settings?.show_projects !== false && <FeaturedProjects />}
          <RecentArticles />
        </Suspense>
      </motion.div>
    </>
  );
};

export default Home;
