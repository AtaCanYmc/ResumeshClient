import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Server } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useEnv } from '../hooks/useEnv';

interface ServerWakeupGateProps {
  children: React.ReactNode;
}

const ServerWakeupGate: React.FC<ServerWakeupGateProps> = ({ children }) => {
  const env = useEnv();
  const [isAwake, setIsAwake] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [dots, setDots] = useState<string>('');
  const { t } = useTranslation();

  const apiUrl = env.API_URL;

  useEffect(() => {
    let intervalId: any;
    let isActive = true;

    const checkServer = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/v1/health`, { timeout: 3000 });
        if (response.status === 200 && isActive) {
          setIsAwake(true);
          setLoading(false);
          clearInterval(intervalId);
        }
      } catch (error) {
        console.log('Waiting for backend server to wake up...');
      }
    };

    // Initial check
    checkServer();

    // Poll every 3 seconds
    intervalId = setInterval(checkServer, 3000);

    return () => {
      isActive = false;
      clearInterval(intervalId);
    };
  }, [apiUrl]);

  // Dots animation
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, [loading]);

  if (!isAwake) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 p-6 font-sans text-neutral-100 selection:bg-blue-500/30">
        {/* Glow Effects */}
        <div className="pointer-events-none absolute top-1/4 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-1/4 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[100px]" />

        <div className="relative z-10 w-full max-w-md space-y-8 rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-8 text-center shadow-2xl backdrop-blur-md">
          {/* Animated Icon */}
          <div className="relative flex justify-center">
            <div className="group relative rounded-full border border-neutral-800 bg-neutral-900 p-5 shadow-inner">
              <Server className="h-10 w-10 text-neutral-400 transition-colors duration-300 group-hover:text-blue-400" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex h-4 w-4 rounded-full bg-blue-500"></span>
              </span>
            </div>
          </div>

          {/* Texts */}
          <div className="space-y-3">
            <h1 className="bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-400 bg-clip-text text-xl font-bold tracking-tight text-transparent">
              {t('wakeup.title')}
              {dots}
            </h1>
            <p className="mx-auto max-w-sm text-sm leading-relaxed text-neutral-400">
              {t('wakeup.description')}
            </p>
          </div>

          {/* Status Indicator */}
          <div className="pt-2">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-neutral-800 bg-neutral-900/80 px-4 py-2 text-xs font-medium text-neutral-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-500" />
              <span>{t('wakeup.status')}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ServerWakeupGate;
