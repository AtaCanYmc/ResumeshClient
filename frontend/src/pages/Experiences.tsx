import React, { useState, useEffect } from 'react';
import { Experience } from '../types';
import axios from 'axios';
import { Briefcase } from 'lucide-react';
import SEO from '../components/SEO';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { useAppSettings } from '../hooks/useHomeData';
import { useEnv } from '../hooks/useEnv';
import { TimelineSkeleton } from '../components/ui/Skeletons';

export default function Experiences() {
  const { API_URL } = useEnv();
  const { data: settings } = useAppSettings();
  const { t } = useTranslation();

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await axios.get<Experience[]>(`${API_URL}/api/v1/experiences/`);
        setExperiences(res.data);
      } catch (error) {
        console.error('Failed to fetch experiences', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  if (settings && settings.show_experiences === false) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return <TimelineSkeleton />;
  }

  return (
    <>
      <SEO title={`${t('experiences.title')} | ResuMesh`} description={t('experiences.subtitle')} />
      <div className="py-6">
        <div className="mb-6">
          <h1 className="font-mono text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-100">
            {t('experiences.title')}
          </h1>
          <p className="mt-1 font-mono text-xs text-zinc-600 dark:text-zinc-400">
            {t('experiences.subtitle')}
          </p>
        </div>

        <div className="relative ml-3 space-y-6 border-l border-zinc-200 pl-6 sm:ml-4 sm:pl-8 dark:border-zinc-800/80">
          {experiences.length === 0 && (
            <div className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
              {t('experiences.emptyDesc')}
            </div>
          )}
          {experiences.map((exp) => (
            <div key={exp.id} className="relative">
              <div className="absolute top-1.5 -left-[31px] flex h-6 w-6 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-600 sm:-left-[39px] dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400">
                <Briefcase size={12} />
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:hover:border-zinc-700/80">
                <div className="mb-2 flex flex-col justify-between gap-1.5 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                      {exp.title}
                    </h3>
                    <h4 className="font-mono text-xs text-zinc-600 dark:text-zinc-400">
                      {exp.company_name}
                    </h4>
                  </div>
                  <span className="w-fit rounded-md border border-zinc-200 bg-zinc-100 px-2.5 py-0.5 font-mono text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                    {exp.start_date} - {exp.end_date || 'Present'}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap text-zinc-600 dark:text-zinc-400">
                  {exp.description}
                </p>

                {exp.skills && exp.skills.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5 border-t border-zinc-200/80 pt-3 dark:border-zinc-800/80">
                    {exp.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md border border-zinc-200 bg-zinc-100 px-2 py-0.5 font-mono text-[11px] text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
