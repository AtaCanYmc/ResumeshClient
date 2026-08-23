import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useContentConfig } from '../../hooks/useHomeData';
import { MetricsSkeleton } from '../ui/Skeletons';
import { getIcon } from '../../utils/iconResolver';

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
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const QuickMetrics: React.FC = () => {
  const { i18n } = useTranslation();
  const { data: config, isLoading } = useContentConfig(i18n.language);

  if (isLoading || !config) {
    return <MetricsSkeleton />;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      className="grid grid-cols-1 gap-4 py-6 sm:grid-cols-3"
    >
      {config.metrics.map((metric) => {
        const Icon = getIcon(metric.icon);

        return (
          <motion.div
            key={metric.id}
            variants={itemVariants}
            className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:hover:border-zinc-700/80"
          >
            <div>
              <div className="font-mono text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-100">
                {metric.value}
              </div>
              <div className="mt-1 font-mono text-xs font-medium tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                {metric.label}
              </div>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-100 p-2.5 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
              <Icon size={20} aria-hidden="true" />
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default QuickMetrics;
