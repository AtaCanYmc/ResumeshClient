import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Briefcase, GraduationCap } from 'lucide-react';
import SpotlightCard from '../ui/SpotlightCard';
import { useExperiences, useEducations } from '../../hooks/useHomeData';
import { TimelineSkeleton } from '../ui/Skeletons';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function Timeline() {
  const { t } = useTranslation();
  const { data: experiences, isLoading: isExpLoading } = useExperiences();
  const { data: educations, isLoading: isEduLoading } = useEducations();

  if (isExpLoading || isEduLoading) return <TimelineSkeleton />;

  const hasExperiences = experiences && experiences.length > 0;
  const hasEducations = educations && educations.length > 0;

  if (!hasExperiences && !hasEducations) return null;

  // Combine and sort by start_date descending (newest first)
  const timelineItems = [
    ...(experiences || []).map((exp: any) => ({ ...exp, type: 'experience' })),
    ...(educations || []).map((edu: any) => ({ ...edu, type: 'education' })),
  ].sort((a: any, b: any) => {
    return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
  });

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="py-12"
    >
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
          <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-500">
            {t('home.careerTimeline')}
          </span>
        </h2>
        <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">{t('experiences.subtitle')}</p>
      </div>

      <div className="relative pl-4 sm:pl-8">
        {/* Vertical Timeline Line */}
        <div className="absolute top-2 bottom-2 left-4 w-0.5 rounded-full bg-gray-200 sm:left-8 dark:bg-gray-800" />

        <div className="space-y-8">
          {timelineItems.map((item: any) => {
            const isEducation = item.type === 'education';
            const color = isEducation ? 'indigo' : item.color || 'blue';

            const getDotColor = (c: string) => {
              switch (c) {
                case 'blue':
                  return 'bg-blue-500 shadow-blue-500/50';
                case 'indigo':
                  return 'bg-indigo-500 shadow-indigo-500/50';
                case 'purple':
                  return 'bg-purple-500 shadow-purple-500/50';
                default:
                  return 'bg-gray-500 shadow-gray-500/50';
              }
            };

            const getSpotlightColor = (c: string) => {
              switch (c) {
                case 'blue':
                  return 'rgba(59, 130, 246, 0.1)';
                case 'indigo':
                  return 'rgba(99, 102, 241, 0.1)';
                case 'purple':
                  return 'rgba(168, 85, 247, 0.1)';
                default:
                  return 'rgba(156, 163, 175, 0.1)';
              }
            };

            return (
              <motion.div
                variants={itemVariants}
                key={`${item.type}-${item.id}`}
                className="relative pl-8 sm:pl-12"
              >
                {/* Timeline Dot */}
                <div
                  className={`absolute top-5 left-[-11px] flex h-6 w-6 items-center justify-center rounded-full text-white shadow-lg sm:left-[-11px] ${getDotColor(color)}`}
                >
                  {isEducation ? <GraduationCap size={12} /> : <Briefcase size={12} />}
                </div>

                <SpotlightCard spotlightColor={getSpotlightColor(color)}>
                  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
                    <div className="mb-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {isEducation ? item.degree : item.title}
                      </h3>
                      <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        {item.start_date ? new Date(item.start_date).getFullYear() : ''} -{' '}
                        {item.end_date ? new Date(item.end_date).getFullYear() : 'Devam Ediyor'}
                      </span>
                    </div>
                    <div
                      className={`mb-3 text-base font-medium text-${color}-600 dark:text-${color}-400`}
                    >
                      {isEducation ? `${item.school} • ${item.field_of_study}` : item.company_name}
                    </div>
                    <p className="text-sm leading-relaxed text-gray-600 sm:text-base dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
