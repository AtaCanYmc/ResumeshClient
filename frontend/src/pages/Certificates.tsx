import React, { useState, useEffect } from 'react';
import { Certificate } from '../types';
import axios from 'axios';
import { Award, ExternalLink, Calendar, Search, X } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredCertificates = certificates.filter((cert) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;

    const nameMatch = (cert.name || '').toLowerCase().includes(q);
    const orgMatch = (cert.issuing_organization || '').toLowerCase().includes(q);

    return nameMatch || orgMatch;
  });

  return (
    <>
      <SEO
        title={`${t('certificates.title')} | ResuMesh`}
        description={t('certificates.subtitle')}
      />
      <div className="py-6">
        <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h1 className="font-mono text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-100">
              {t('certificates.title')}
            </h1>
            <p className="mt-1 font-mono text-xs text-zinc-600 dark:text-zinc-400">
              {t('certificates.subtitle')}
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Sertifikalarda ara..."
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

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredCertificates.map((cert) => (
            <div
              key={cert.id}
              className="flex flex-col rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:hover:border-zinc-700/80"
            >
              <div className="mb-4 flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                  <Award size={20} />
                </div>
                <div>
                  <h3 className="text-base leading-snug font-semibold text-zinc-900 dark:text-zinc-100">
                    {cert.name}
                  </h3>
                  <p className="mt-0.5 font-mono text-xs text-zinc-600 dark:text-zinc-400">
                    {cert.issuing_organization}
                  </p>
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between border-t border-zinc-200/80 pt-4 font-mono text-xs text-zinc-500 dark:border-zinc-800/80 dark:text-zinc-400">
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
                    className="flex items-center space-x-1 font-semibold text-zinc-700 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
                  >
                    <span>View Credential</span>
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>
          ))}
          {filteredCertificates.length === 0 && (
            <div className="col-span-full py-12 text-center font-mono text-xs text-zinc-500 dark:text-zinc-400">
              {searchQuery
                ? 'Aradığınız kriterlere uygun sertifika bulunamadı.'
                : 'Henüz sertifika eklenmemiş.'}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
