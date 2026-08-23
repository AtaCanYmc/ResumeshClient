import React, { useState, useEffect } from 'react';
import { Skill } from '../types';
import axios from 'axios';
import { Loader2, Wand2 } from 'lucide-react';
import SEO from '../components/SEO';
import { useTranslation } from 'react-i18next';
import { useEnv } from '../hooks/useEnv';

import { ListSkeleton } from '../components/ui/Skeletons';

export default function Skills() {
  const { API_URL } = useEnv();
  const { t } = useTranslation();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get<Skill[]>(`${API_URL}/api/v1/skills/`);
        setSkills(res.data);
      } catch (error) {
        console.error('Failed to fetch skills', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  if (loading) {
    return <ListSkeleton />;
  }

  // Group skills by category
  const groupedSkills = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>
  );

  return (
    <>
      <SEO title={`${t('skills.title')} | ResuMesh`} description={t('skills.subtitle')} />
      <div className="mx-auto max-w-5xl py-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {t('skills.title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">{t('skills.subtitle')}</p>
        </div>

        {skills.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white py-12 text-center text-gray-500 dark:border-gray-800 dark:bg-gray-900">
            <Wand2 className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p>{t('skills.emptyDesc')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {Object.entries(groupedSkills).map(([category, catSkills]) => (
              <div
                key={category}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
              >
                <h3 className="mb-6 flex items-center gap-2 border-b border-gray-100 pb-3 text-xl font-bold text-gray-900 dark:border-gray-800 dark:text-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <Wand2 size={16} />
                  </span>
                  {category}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {catSkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="cursor-default rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-blue-500 dark:hover:text-blue-400"
                    >
                      {skill.name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
