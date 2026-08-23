import React, { useState } from 'react';
import { Download, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import MagneticButton from '../ui/MagneticButton';
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
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.65, 0.3, 0.9] } },
};

const HeroSection: React.FC = () => {
  const env = useEnv();
  const { t, i18n } = useTranslation();
  const { data: config, isLoading } = useContentConfig(i18n.language);
  const { isDownloading, handleDownload } = useDownloadResume(config?.hero?.resumeLink);

  // 3D Tilt Effect State
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['15deg', '-15deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-15deg', '15deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="relative mt-10 mb-20 flex min-h-[60vh] items-center">
      {/* Background Mesh/Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] h-[50%] w-[50%] animate-pulse rounded-full bg-blue-500/20 blur-[120px] dark:bg-blue-600/20" />
        <div
          className="absolute top-[20%] -right-[10%] h-[40%] w-[40%] animate-pulse rounded-full bg-indigo-500/20 blur-[100px] dark:bg-purple-600/20"
          style={{ animationDelay: '2s' }}
        />
      </div>

      <div className="flex min-h-[400px] w-full flex-col items-center justify-between gap-12 lg:flex-row">
        {/* Left Content: Staggered Text Reveal */}
        {isLoading || !config ? (
          <HeroSkeleton />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="z-10 flex-1 space-y-6 text-center lg:text-left"
          >
            <motion.h1
              variants={textVariants}
              className="text-5xl leading-tight font-black tracking-tighter text-gray-900 sm:text-6xl lg:text-7xl dark:text-white"
            >
              {t('home.greeting')}{' '}
              <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                {config.hero.name}
              </span>
              .
            </motion.h1>
            <motion.div
              variants={textVariants}
              className="text-3xl font-extrabold text-gray-800 sm:text-4xl lg:text-5xl dark:text-gray-200"
            >
              {config.hero.title}
            </motion.div>
            <motion.p
              variants={textVariants}
              className="mx-auto max-w-2xl text-lg leading-relaxed font-medium text-gray-600 sm:text-xl lg:mx-0 dark:text-gray-400"
            >
              {config.hero.description}
            </motion.p>

            <motion.div
              variants={textVariants}
              className="flex flex-col items-center justify-center gap-4 pt-6 sm:flex-row lg:justify-start"
            >
              <MagneticButton>
                <div className="group relative rounded-xl">
                  <div className="absolute -inset-0.5 animate-pulse rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 opacity-60 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200"></div>
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="relative flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 font-semibold text-white shadow-lg transition-all focus:outline-none disabled:opacity-80"
                    aria-label={t('hero.downloadResume')}
                  >
                    {isDownloading ? (
                      <Loader2 size={20} className="animate-spin" aria-hidden="true" />
                    ) : (
                      <Download size={20} aria-hidden="true" />
                    )}
                    <span>
                      {isDownloading ? t('hero.downloadingResume') : t('hero.downloadResume')}
                    </span>
                  </button>
                </div>
              </MagneticButton>

              <MagneticButton as="a" href="/projects">
                <Link
                  to="/projects"
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white/50 px-8 py-3.5 font-medium text-gray-900 backdrop-blur-md transition-all hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white dark:hover:bg-gray-700"
                  aria-label={t('hero.viewProjects')}
                >
                  <span>{t('hero.viewProjects')}</span>
                  <ArrowRight size={20} aria-hidden="true" />
                </Link>
              </MagneticButton>

              <div className="mt-4 ml-0 flex items-center gap-2 sm:mt-0 sm:ml-4">
                {config.socials.map((social: any) => {
                  const Icon = getIcon(social.icon || social.platform);
                  return (
                    <MagneticButton key={social.id} as="a" href={social.url}>
                      <div className="cursor-pointer rounded-xl border border-gray-200 bg-white/50 p-3 text-gray-600 shadow-sm backdrop-blur-md transition-colors hover:bg-white hover:text-blue-600 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-400">
                        <Icon size={20} />
                      </div>
                    </MagneticButton>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Right Content: 3D Interactive Mockup/Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hidden flex-1 items-center justify-center perspective-[1000px] lg:flex"
        >
          <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            className="relative flex h-[400px] w-[400px] cursor-crosshair items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 shadow-2xl backdrop-blur-3xl"
          >
            {/* Inner Floating Element for Parallax */}
            <motion.div
              style={{ transform: 'translateZ(50px)' }}
              className="rounded-2xl border border-white/20 bg-white/10 p-8 text-center backdrop-blur-md dark:border-white/10 dark:bg-black/20"
            >
              {config.hero.avatarImage || env.GITHUB_USERNAME ? (
                <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full border-2 border-white/20 shadow-lg">
                  <img
                    src={
                      config.hero.avatarImage?.startsWith('http')
                        ? config.hero.avatarImage
                        : config.hero.avatarImage?.startsWith('/api/v1/avatar/')
                          ? `${env.API_URL}${config.hero.avatarImage}/url`
                          : config.hero.avatarImage?.startsWith('/')
                            ? `${env.API_URL}${config.hero.avatarImage}`
                            : config.hero.avatarImage ||
                              `https://github.com/${env.GITHUB_USERNAME}.png`
                    }
                    alt={config.hero.fullName}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-3xl font-bold text-white shadow-lg">
                  AY
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {config.hero.fullName || config.hero.name}
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {config.hero.avatarSubtitle}
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
