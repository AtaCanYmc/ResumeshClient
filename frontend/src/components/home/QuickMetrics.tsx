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
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
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
      viewport={{ once: true, margin: '-50px' }}
      className="grid grid-cols-1 gap-4 py-8 md:grid-cols-4"
    >
      {config.metrics.map((metric, index) => {
        const Icon = getIcon(metric.icon);
        const isFeatured = index === 0;

        const getBgClass = (color: string) => {
          switch (color) {
            case 'blue':
              return 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20';
            case 'indigo':
              return 'bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20';
            case 'purple':
              return 'bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20';
            default:
              return 'bg-gray-100 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-500/20';
          }
        };

        const iconBg =
          metric.color === 'blue'
            ? 'bg-blue-500 dark:bg-blue-500'
            : metric.color === 'indigo'
              ? 'bg-indigo-500 dark:bg-indigo-500'
              : 'bg-purple-500 dark:bg-purple-500';

        // Bento grid spans
        const colSpanClass =
          index === 0
            ? 'md:col-span-2 md:row-span-2'
            : index === 1
              ? 'md:col-span-2'
              : index === 2
                ? 'md:col-span-2'
                : 'md:col-span-1';

        return (
          <motion.div
            key={metric.id}
            variants={itemVariants}
            className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900 ${colSpanClass}`}
          >
            {/* Background Gradient Blob */}
            <div
              className={`absolute -top-8 -right-8 h-32 w-32 rounded-full opacity-20 blur-3xl transition-opacity group-hover:opacity-40 ${iconBg}`}
            />

            <div
              className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border shadow-sm ${getBgClass(metric.color)}`}
            >
              <Icon size={24} aria-hidden="true" />
            </div>

            <div className="relative z-10 mt-auto">
              <div className={`mb-1 text-4xl font-black text-gray-900 lg:text-5xl dark:text-white`}>
                {metric.value}
              </div>
              <div className="text-sm font-medium text-gray-500 lg:text-base dark:text-gray-400">
                {metric.label}
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default QuickMetrics;
