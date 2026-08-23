import React, { useState, useEffect } from 'react';
import { Education } from '../types';
import axios from 'axios';
import { GraduationCap } from 'lucide-react';
import SEO from '../components/SEO';
import { useTranslation } from 'react-i18next';
import { useEnv } from '../hooks/useEnv';
import { TimelineSkeleton } from '../components/ui/Skeletons';

export default function Educations() {
  const { API_URL } = useEnv();
  const { t } = useTranslation();
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEducations = async () => {
      try {
        const res = await axios.get<Education[]>(`${API_URL}/api/v1/educations/`);
        setEducations(res.data);
      } catch (error) {
        console.error('Failed to fetch educations', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEducations();
  }, []);

  if (loading) {
    return <TimelineSkeleton />;
  }

  return (
    <>
      <SEO title={`${t('educations.title')} | ResuMesh`} description={t('educations.subtitle')} />
      <div className="py-6">
        <div className="mb-6">
          <h1 className="font-mono text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-100">
            {t('educations.title')}
          </h1>
          <p className="mt-1 font-mono text-xs text-zinc-600 dark:text-zinc-400">
            {t('educations.subtitle')}
          </p>
        </div>

        <div className="relative ml-3 space-y-6 border-l border-zinc-200 pl-6 sm:ml-4 sm:pl-8 dark:border-zinc-800/80">
          {educations.length === 0 && (
            <div className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
              {t('educations.emptyDesc')}
            </div>
          )}
          {educations.map((edu) => (
            <div key={edu.id} className="relative">
              <div className="absolute top-1.5 -left-[31px] flex h-6 w-6 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-600 sm:-left-[39px] dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400">
                <GraduationCap size={12} />
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:hover:border-zinc-700/80">
                <div className="mb-2 flex flex-col justify-between gap-1.5 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                      {edu.school}
                    </h3>
                    <h4 className="font-mono text-xs text-zinc-600 dark:text-zinc-400">
                      {edu.degree} - {edu.field_of_study}
                    </h4>
                  </div>
                  <span className="w-fit rounded-md border border-zinc-200 bg-zinc-100 px-2.5 py-0.5 font-mono text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                    {edu.start_date} - {edu.end_date || 'Present'}
                  </span>
                </div>

                {edu.grade && (
                  <div className="mb-2 font-mono text-xs text-zinc-600 dark:text-zinc-400">
                    <span className="text-zinc-500">GPA: </span> {edu.grade}
                  </div>
                )}

                {edu.description && (
                  <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap text-zinc-600 dark:text-zinc-400">
                    {edu.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
