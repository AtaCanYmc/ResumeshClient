import React, { useState, useEffect } from 'react';
import { Experience } from '../types';
import axios from 'axios';
import { Loader2, Briefcase } from 'lucide-react';
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
      <div className="mx-auto max-w-4xl py-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white">
            {t('experiences.title')}
          </h1>
          <p className="text-gray-400">{t('experiences.subtitle')}</p>
        </div>

        <div className="relative ml-3 space-y-12 border-l border-gray-800 md:ml-6">
          {experiences.length === 0 && (
            <div className="pl-8 text-gray-500">{t('experiences.emptyDesc')}</div>
          )}
          {experiences.map((exp) => (
            <div key={exp.id} className="group relative pl-8 md:pl-12">
              {/* Timeline Dot */}
              <div className="absolute top-1.5 -left-3.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-blue-500 bg-gray-900 transition-colors group-hover:bg-blue-500">
                <Briefcase size={12} className="text-blue-500 group-hover:text-white" />
              </div>

              <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 transition-colors hover:border-gray-700">
                <div className="mb-4 flex flex-col md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-100">{exp.title}</h3>
                    <h4 className="text-md font-medium text-blue-400">{exp.company_name}</h4>
                  </div>
                  <div className="mt-2 inline-block rounded-full border border-gray-800 bg-black px-3 py-1 font-mono text-sm text-gray-500 md:mt-0">
                    {exp.start_date} - {exp.end_date || 'Present'}
                  </div>
                </div>

                <p className="mb-6 text-sm leading-relaxed whitespace-pre-wrap text-gray-400">
                  {exp.description}
                </p>

                {exp.skills && exp.skills.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {exp.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md border border-gray-700 bg-gray-800 px-3 py-1 text-xs font-medium text-gray-300"
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
