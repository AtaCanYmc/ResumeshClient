import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Briefcase, GraduationCap } from 'lucide-react';
import { useExperiences, useEducations } from '../../hooks/useHomeData';
import { TimelineSkeleton } from '../ui/Skeletons';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export default function Timeline() {
  const { t } = useTranslation();
  const { data: experiences, isLoading: isExpLoading } = useExperiences();
  const { data: educations, isLoading: isEduLoading } = useEducations();

  if (isExpLoading || isEduLoading) return <TimelineSkeleton />;

  const hasExperiences = experiences && experiences.length > 0;
  const hasEducations = educations && educations.length > 0;

  if (!hasExperiences && !hasEducations) return null;

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
      viewport={{ once: true, margin: '-60px' }}
      className="py-10"
    >
      <div className="mb-8">
        <h2 className="font-mono text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
          {t('home.careerTimeline')}
        </h2>
        <p className="mt-1 font-mono text-xs text-zinc-400">{t('experiences.subtitle')}</p>
      </div>

      <div className="relative ml-3 space-y-6 border-l border-zinc-800/80 pl-6 sm:ml-4 sm:pl-8">
        {timelineItems.map((item: any) => {
          const isEducation = item.type === 'education';

          return (
            <motion.div
              variants={itemVariants}
              key={`${item.type}-${item.id}`}
              className="relative"
            >
              <div className="absolute top-1.5 -left-[31px] flex h-6 w-6 items-center justify-center rounded-full border border-zinc-700 bg-zinc-950 text-zinc-400 sm:-left-[39px]">
                {isEducation ? <GraduationCap size={12} /> : <Briefcase size={12} />}
              </div>

              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-5 transition-colors hover:border-zinc-700/80">
                <div className="mb-2 flex flex-col justify-between gap-1.5 sm:flex-row sm:items-center">
                  <h3 className="text-base font-semibold text-zinc-100">
                    {isEducation ? item.degree : item.title}
                  </h3>
                  <span className="w-fit rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-0.5 font-mono text-xs text-zinc-400">
                    {item.start_date ? new Date(item.start_date).getFullYear() : ''} -{' '}
                    {item.end_date ? new Date(item.end_date).getFullYear() : 'Devam Ediyor'}
                  </span>
                </div>
                <div className="mb-2.5 font-mono text-xs text-zinc-400">
                  {isEducation ? `${item.school} • ${item.field_of_study}` : item.company_name}
                </div>
                <p className="text-sm leading-relaxed text-zinc-400">{item.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
