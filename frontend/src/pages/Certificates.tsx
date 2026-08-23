import React, { useState, useEffect } from 'react';
import { Certificate } from '../types';
import axios from 'axios';
import { Award, ExternalLink, Calendar } from 'lucide-react';
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
      <div className="py-6">
        <div className="mb-6">
          <h1 className="font-mono text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            {t('certificates.title')}
          </h1>
          <p className="mt-1 font-mono text-xs text-zinc-400">{t('certificates.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="flex flex-col rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-5 transition-colors hover:border-zinc-700/80"
            >
              <div className="mb-4 flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-400">
                  <Award size={20} />
                </div>
                <div>
                  <h3 className="text-base leading-snug font-semibold text-zinc-100">
                    {cert.name}
                  </h3>
                  <p className="mt-0.5 font-mono text-xs text-zinc-400">
                    {cert.issuing_organization}
                  </p>
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between border-t border-zinc-800/80 pt-4 font-mono text-xs text-zinc-400">
                <div className="flex items-center space-x-1.5">
                  {cert.issue_date && (
                    <>
                      <Calendar size={13} />
                      <span>{new Date(cert.issue_date).toLocaleDateString()}</span>
                    </>
                  )}
                </div>
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 font-semibold text-zinc-300 transition-colors hover:text-zinc-100"
                  >
                    <span>View Credential</span>
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>
          ))}
          {certificates.length === 0 && (
            <div className="col-span-full py-12 text-center font-mono text-xs text-zinc-400">
              Henüz sertifika eklenmemiş.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
