import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useSkills } from '../../hooks/useHomeData';
import { getIcon } from '../../utils/iconResolver';

export default function SkillsMarquee() {
  const { t, i18n } = useTranslation();
  const { data: skills, isLoading } = useSkills();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (isLoading || !skills || !Array.isArray(skills) || skills.length === 0) {
    return null;
  }

  const rawCategories = Array.from(new Set(skills.map((s) => s.category)));
  const categories = [
    { id: 'all', label: i18n.language === 'tr' ? 'Hepsi' : 'All' },
    ...rawCategories.map((cat) => ({
      id: cat.toLowerCase(),
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
    })),
  ];

  const filteredSkills =
    selectedCategory === 'all'
      ? skills
      : skills.filter((s) => s.category.toLowerCase() === selectedCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  };

  return (
    <div className="relative py-10">
      <div className="mb-8">
        <h2 className="font-mono text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
          {t('home.skills')}
        </h2>
        <p className="mt-1 font-mono text-xs text-zinc-600 dark:text-zinc-400">
          {t('home.skillsSubtitle')}
        </p>
      </div>

      {/* Categories Selector Tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-lg border px-4 py-2 font-mono text-xs font-medium transition-colors focus:outline-none ${
                isActive
                  ? 'border-zinc-300 bg-zinc-100 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100'
                  : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800/80 dark:bg-zinc-950/60 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-200'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Skills Grid */}
      <motion.div
        layout
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredSkills.map((skill) => {
            const Icon = getIcon(skill.icon_name || 'code');

            return (
              <motion.div
                layout
                key={skill.id}
                variants={itemVariants}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                className="flex items-center gap-3.5 rounded-xl border border-zinc-200 bg-white p-3.5 transition-colors hover:border-zinc-300 dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:hover:border-zinc-700/80"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
                  <Icon size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {skill.name}
                  </h4>
                  <p className="truncate font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                    {skill.category.charAt(0).toUpperCase() + skill.category.slice(1)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
