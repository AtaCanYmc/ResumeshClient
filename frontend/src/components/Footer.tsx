import React, { useState } from 'react';
import { Mail, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useContentConfig } from '../hooks/useHomeData';
import { getIcon } from '../utils/iconResolver';

const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { data: config } = useContentConfig(i18n.language);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!config) return null;

  return (
    <footer className="mt-20 border-t border-zinc-200 bg-white py-8 dark:border-zinc-800/80 dark:bg-zinc-950">
      <div className="container mx-auto max-w-5xl px-4">
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mb-10 grid grid-cols-1 gap-8 pt-2 md:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="font-mono text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    ResuMesh<span className="text-zinc-500">.</span>
                  </h3>
                  <p className="max-w-md text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                    <strong className="mb-1 block font-mono text-zinc-800 dark:text-zinc-200">
                      {t('footer.aboutTitle')}
                    </strong>
                    {t('footer.aboutText')}
                  </p>
                </div>

                <div className="md:text-right">
                  <h3 className="mb-4 font-mono text-base font-bold text-zinc-900 dark:text-zinc-100">
                    {t('footer.connect')}
                  </h3>
                  <div className="flex flex-col gap-3 md:items-end">
                    <a
                      href={`mailto:${config.footer.email}`}
                      className="flex w-fit items-center gap-2 font-mono text-xs text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    >
                      <Mail size={15} />
                      <span>{config.footer.email}</span>
                    </a>

                    <div className="mt-1 flex items-center gap-2">
                      {config.socials.map((social) => {
                        const Icon = getIcon(social.icon || social.platform);
                        return (
                          <a
                            key={social.id}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-md border border-zinc-200 bg-zinc-100 p-2 text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
                            aria-label={social.label}
                          >
                            <Icon size={16} />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className={`flex flex-col items-center justify-between gap-4 font-mono text-xs text-zinc-500 md:flex-row ${
            isExpanded ? 'border-t border-zinc-200 pt-6 dark:border-zinc-800/80' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            <p>
              © {new Date().getFullYear()} {config.hero.name}. {t('footer.allRightsReserved')}
            </p>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="rounded-md border border-zinc-200 bg-zinc-100 p-1 text-zinc-600 transition-colors hover:text-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              aria-label={isExpanded ? 'Daralt' : 'Genişlet'}
              title={isExpanded ? 'Daralt' : 'Genişlet'}
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
          </div>
          <p className="flex items-center gap-1">{config.hero.name} • ResuMesh Engine v1.0</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
