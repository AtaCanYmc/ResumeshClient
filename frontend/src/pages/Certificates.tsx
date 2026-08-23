import React, { useState, useEffect } from 'react';
import { Certificate } from '../types';
import axios from 'axios';
import { Loader2, Award, ExternalLink, Calendar } from 'lucide-react';
import SEO from '../components/SEO';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { useAppSettings } from '../hooks/useHomeData';
import { useEnv } from '../hooks/useEnv';

import { ListSkeleton } from '../components/ui/Skeletons';

export default function Certificates() {
  const { API_URL } = useEnv();
  const { data: settings } = useAppSettings();
  const { t } = useTranslation();

  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await axios.get<Certificate[]>(`${API_URL}/api/v1/certificates/`);
        setCertificates(res.data);
      } catch (error) {
        console.error('Failed to fetch certificates', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  if (settings && settings.show_certificates === false) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return <ListSkeleton />;
  }

  return (
    <>
      <SEO
        title={`${t('certificates.title')} | ResuMesh`}
        description={t('certificates.subtitle')}
      />
      <div className="py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-white">
            {t('certificates.title')}
          </h1>
          <p className="text-gray-400">{t('certificates.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="flex flex-col rounded-xl border border-gray-800 bg-gray-900 p-6 transition-colors hover:border-gray-700"
            >
              <div className="mb-4 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-gray-800 bg-black">
                  <Award className="text-blue-500" size={24} />
                </div>
                <div>
                  <h3 className="text-lg leading-snug font-bold text-gray-100">{cert.name}</h3>
                  <p className="mt-1 text-sm font-medium text-gray-400">
                    {cert.issuing_organization}
                  </p>
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between border-t border-gray-800 pt-6">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  {cert.issue_date && (
                    <>
                      <Calendar size={14} />
                      <span>Issued {new Date(cert.issue_date).toLocaleDateString()}</span>
                    </>
                  )}
                </div>
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-xs font-semibold text-blue-400 transition-colors hover:text-blue-300"
                  >
                    <span>View Credential</span>
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          ))}
          {certificates.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500">
              Henüz sertifika eklenmemiş.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
