import React, { useState, useEffect } from 'react';
import { Education } from '../types';
import axios from 'axios';
import { Loader2, GraduationCap } from 'lucide-react';
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
      <div className="mx-auto max-w-4xl py-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {t('educations.title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">{t('educations.subtitle')}</p>
        </div>

        <div className="relative ml-3 space-y-12 border-l border-gray-200 md:ml-6 dark:border-gray-800">
          {educations.length === 0 && (
            <div className="pl-8 text-gray-500">{t('educations.emptyDesc')}</div>
          )}
          {educations.map((edu) => (
            <div key={edu.id} className="group relative pl-8 md:pl-12">
              {/* Timeline Dot */}
              <div className="absolute top-1.5 -left-3.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-blue-500 bg-white transition-colors group-hover:bg-blue-500 dark:bg-gray-900">
                <GraduationCap size={12} className="text-blue-500 group-hover:text-white" />
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
                <div className="mb-4 flex flex-col md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {edu.school}
                    </h3>
                    <h4 className="text-md font-medium text-blue-600 dark:text-blue-400">
                      {edu.degree} - {edu.field_of_study}
                    </h4>
                  </div>
                  <div className="mt-2 inline-block rounded-full border border-gray-200 bg-gray-100 px-3 py-1 font-mono text-sm text-gray-600 md:mt-0 dark:border-gray-800 dark:bg-black dark:text-gray-500">
                    {edu.start_date} - {edu.end_date || 'Present'}
                  </div>
                </div>

                {edu.grade && (
                  <div className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <span className="opacity-70">Grade/GPA: </span> {edu.grade}
                  </div>
                )}

                {edu.description && (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-600 dark:text-gray-400">
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
