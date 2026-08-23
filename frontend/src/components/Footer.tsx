import React, { useState } from 'react';
import { Mail, Heart, ChevronUp, ChevronDown } from 'lucide-react';
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
    <footer className="mt-24 border-t border-gray-200 bg-white pt-8 pb-8 dark:border-gray-800 dark:bg-black/40">
      <div className="container mx-auto max-w-6xl px-4">
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="mb-12 grid grid-cols-1 gap-12 pt-4 md:grid-cols-2">
                {/* About Section */}
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                    <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                      ResuMesh
                    </span>
                  </h3>
                  <p className="max-w-md leading-relaxed text-gray-600 dark:text-gray-400">
                    <strong className="mb-2 block text-gray-800 dark:text-gray-200">
                      {t('footer.aboutTitle')}
                    </strong>
                    {t('footer.aboutText')}
                  </p>
                </div>

                {/* Connect Section */}
                <div className="md:text-right">
                  <h3 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
                    {t('footer.connect')}
                  </h3>
                  <div className="flex flex-col gap-4 md:items-end">
                    <a
                      href={`mailto:${config.footer.email}`}
                      className="flex w-fit items-center gap-2 text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    >
                      <Mail size={18} />
                      <span>{config.footer.email}</span>
                    </a>

                    <div className="mt-2 flex items-center gap-4">
                      {config.socials.map((social) => {
                        const Icon = getIcon(social.icon || social.platform);
                        return (
                          <a
                            key={social.id}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg bg-gray-100 p-2.5 text-gray-600 transition-all hover:bg-blue-50 hover:text-blue-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                            aria-label={social.label}
                          >
                            <Icon size={20} />
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

        {/* Bottom Bar */}
        <div
          className={`flex flex-col items-center justify-between transition-all duration-300 md:flex-row ${isExpanded ? 'border-t border-gray-200 pt-8 dark:border-gray-800' : ''} text-sm text-gray-500 dark:text-gray-500`}
        >
          <div className="flex items-center gap-4">
            <p>
              © {new Date().getFullYear()} {config.hero.name}. {t('footer.allRightsReserved')}
            </p>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="rounded-full bg-gray-100 p-1.5 text-gray-600 transition-colors hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              aria-label={isExpanded ? 'Daralt' : 'Genişlet'}
              title={isExpanded ? 'Daralt' : 'Genişlet'}
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>
          </div>
          <p className="mt-4 flex items-center gap-1.5 md:mt-0">
            {i18n.language === 'tr' ? (
              <>
                {config.hero.name} tarafından{' '}
                <Heart size={14} className="animate-pulse fill-red-500 text-red-500" /> ile
                geliştirildi
              </>
            ) : (
              <>
                {t('footer.builtWith')} <Heart size={14} className="fill-red-500 text-red-500" />{' '}
                {t('footer.by')} {config.hero.name}
              </>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
