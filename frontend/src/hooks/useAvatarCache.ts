import { useState, useEffect } from 'react';

const CACHE_PREFIX = 'resumesh_avatar_base64_';

export function useAvatarCache(rawUrl?: string): string {
  const [cachedSrc, setCachedSrc] = useState<string>(() => {
    if (!rawUrl) return '';
    try {
      const stored = localStorage.getItem(`${CACHE_PREFIX}${rawUrl}`);
      if (stored) return stored;
    } catch {
      // Ignore storage read errors
    }
    return rawUrl;
  });

  useEffect(() => {
    if (!rawUrl) return;

    // Check if already stored in localStorage
    try {
      const stored = localStorage.getItem(`${CACHE_PREFIX}${rawUrl}`);
      if (stored) {
        setCachedSrc(stored);
        return;
      }
    } catch {
      // Ignore storage read errors
    }

    // Fetch and convert image to Base64 data URL for instant 0ms frontend caching
    let isMounted = true;
    const fetchAndCache = async () => {
      try {
        const response = await fetch(rawUrl);
        if (!response.ok) return;

        const blob = await response.blob();
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64data = reader.result as string;
          if (base64data && isMounted) {
            setCachedSrc(base64data);
            try {
              localStorage.setItem(`${CACHE_PREFIX}${rawUrl}`, base64data);
            } catch (err) {
              console.warn('Failed to cache avatar in localStorage:', err);
            }
          }
        };

        reader.readAsDataURL(blob);
      } catch (err) {
        console.warn('Avatar frontend caching fetch failed:', err);
      }
    };

    fetchAndCache();

    return () => {
      isMounted = false;
    };
  }, [rawUrl]);

  return cachedSrc || rawUrl || '';
}
