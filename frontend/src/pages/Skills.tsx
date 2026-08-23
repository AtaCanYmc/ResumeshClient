import React, { useState, useEffect } from 'react';
import { Skill } from '../types';
import axios from 'axios';
import { Wand2 } from 'lucide-react';
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
      <div className="py-6">
        <div className="mb-6">
          <h1 className="font-mono text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-100">
            {t('skills.title')}
          </h1>
          <p className="mt-1 font-mono text-xs text-zinc-600 dark:text-zinc-400">
            {t('skills.subtitle')}
          </p>
        </div>

        {skills.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white py-12 text-center text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
            <Wand2 className="mx-auto mb-3 h-10 w-10 text-zinc-400 dark:text-zinc-500" />
            <p className="font-mono text-xs">{t('skills.emptyDesc')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {Object.entries(groupedSkills).map(([category, catSkills]) => (
              <div
                key={category}
                className="rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:hover:border-zinc-700/80"
              >
                <h3 className="mb-4 flex items-center gap-2 border-b border-zinc-200/80 pb-3 font-mono text-base font-semibold text-zinc-900 dark:border-zinc-800/80 dark:text-zinc-100">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                    <Wand2 size={14} />
                  </span>
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {catSkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="cursor-default rounded-md border border-zinc-200 bg-zinc-100 px-3 py-1 font-mono text-xs text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
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
