import React, { useState, useEffect } from 'react';
import { Skill } from '../types';
import axios from 'axios';
import { Wand2, Search, X } from 'lucide-react';
import SEO from '../components/SEO';
import { useTranslation } from 'react-i18next';
import { useEnv } from '../hooks/useEnv';
import { ListSkeleton } from '../components/ui/Skeletons';

export default function Skills() {
  const { API_URL } = useEnv();
  const { t } = useTranslation();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredSkills = skills.filter((skill) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return skill.name.toLowerCase().includes(q) || skill.category.toLowerCase().includes(q);
  });

  const groupedSkills = filteredSkills.reduce(
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
        <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h1 className="font-mono text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-100">
              {t('skills.title')}
            </h1>
            <p className="mt-1 font-mono text-xs text-zinc-600 dark:text-zinc-400">
              {t('skills.subtitle')}
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Yeteneklerde ara..."
              className="w-full rounded-lg border border-zinc-200 bg-white py-2 pr-8 pl-8 font-mono text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-zinc-700"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute top-1/2 right-2.5 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {Object.keys(groupedSkills).length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white py-12 text-center text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
            <Wand2 className="mx-auto mb-3 h-10 w-10 text-zinc-400 dark:text-zinc-500" />
            <p className="font-mono text-xs">Aradığınız kriterlere uygun yetenek bulunamadı.</p>
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
