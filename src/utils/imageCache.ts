const CACHE_KEY_PREFIX = 'inflation-rpg-image-cache';
const MAX_CACHE_SIZE = 50;

interface ImageCacheEntry {
  data: string;
  timestamp: number;
}

const getCacheKey = (url: string): string => {
  return `${CACHE_KEY_PREFIX}-${url}`;
};

export const cacheImage = async (url: string): Promise<string> => {
  const cacheKey = getCacheKey(url);
  const cached = localStorage.getItem(cacheKey);
  
  if (cached) {
    const entry: ImageCacheEntry = JSON.parse(cached);
    if (Date.now() - entry.timestamp < 7 * 24 * 60 * 60 * 1000) {
      return entry.data;
    }
    localStorage.removeItem(cacheKey);
  }

  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        const base64Data = reader.result as string;
        const entry: ImageCacheEntry = {
          data: base64Data,
          timestamp: Date.now(),
        };
        localStorage.setItem(cacheKey, JSON.stringify(entry));
        cleanOldCache();
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return url;
  }
};

export const getCachedImage = (url: string): string | null => {
  const cacheKey = getCacheKey(url);
  const cached = localStorage.getItem(cacheKey);
  
  if (cached) {
    const entry: ImageCacheEntry = JSON.parse(cached);
    if (Date.now() - entry.timestamp < 7 * 24 * 60 * 60 * 1000) {
      return entry.data;
    }
    localStorage.removeItem(cacheKey);
  }
  
  return null;
};

const cleanOldCache = () => {
  const keys = Object.keys(localStorage).filter(k => k.startsWith(CACHE_KEY_PREFIX));
  
  if (keys.length <= MAX_CACHE_SIZE) return;
  
  const entries: { key: string; timestamp: number }[] = [];
  
  for (const key of keys) {
    try {
      const cached = localStorage.getItem(key);
      if (cached) {
        const entry: ImageCacheEntry = JSON.parse(cached);
        entries.push({ key, timestamp: entry.timestamp });
      }
    } catch {
      localStorage.removeItem(key);
    }
  }
  
  entries.sort((a, b) => a.timestamp - b.timestamp);
  
  for (let i = 0; i < entries.length - MAX_CACHE_SIZE; i++) {
    localStorage.removeItem(entries[i].key);
  }
};

export const preloadImages = async (urls: string[]): Promise<void> => {
  await Promise.all(urls.map(url => cacheImage(url)));
};