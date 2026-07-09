const CACHE_KEY_PREFIX = 'inflation-rpg-image-cache';
const MAX_CACHE_SIZE = 200;

interface ImageCacheEntry {
  data: string;
  timestamp: number;
}

const memoryCache = new Map<string, string>();

const getCacheKey = (url: string): string => {
  return `${CACHE_KEY_PREFIX}-${url}`;
};

export const cacheImage = async (url: string): Promise<string> => {
  if (memoryCache.has(url)) {
    return memoryCache.get(url)!;
  }

  const cacheKey = getCacheKey(url);
  const cached = localStorage.getItem(cacheKey);
  
  if (cached) {
    try {
      const entry: ImageCacheEntry = JSON.parse(cached);
      if (Date.now() - entry.timestamp < 7 * 24 * 60 * 60 * 1000) {
        memoryCache.set(url, entry.data);
        return entry.data;
      }
    } catch {
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
        memoryCache.set(url, base64Data);
        
        const entry: ImageCacheEntry = {
          data: base64Data,
          timestamp: Date.now(),
        };
        localStorage.setItem(cacheKey, JSON.stringify(entry));
        cleanOldCache();
        resolve(base64Data);
      };
      reader.onerror = () => {
        memoryCache.set(url, url);
        reject(new Error(`Failed to load image: ${url}`));
      };
      reader.readAsDataURL(blob);
    });
  } catch {
    memoryCache.set(url, url);
    return url;
  }
};

export const getCachedImage = (url: string): string | null => {
  if (memoryCache.has(url)) {
    const cached = memoryCache.get(url)!;
    return cached !== url ? cached : null;
  }

  const cacheKey = getCacheKey(url);
  const cached = localStorage.getItem(cacheKey);
  
  if (cached) {
    try {
      const entry: ImageCacheEntry = JSON.parse(cached);
      if (Date.now() - entry.timestamp < 7 * 24 * 60 * 60 * 1000) {
        memoryCache.set(url, entry.data);
        return entry.data;
      }
    } catch {
    }
    localStorage.removeItem(cacheKey);
  }
  
  return null;
};

export const getOrCacheImage = async (url: string): Promise<string> => {
  const cached = getCachedImage(url);
  if (cached) {
    return cached;
  }
  return await cacheImage(url);
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

export const preloadImages = async (urls: string[], onProgress?: (loaded: number, total: number) => void): Promise<void> => {
  let loaded = 0;
  const total = urls.length;
  
  await Promise.all(urls.map(async (url) => {
    try {
      await cacheImage(url);
    } catch {
    }
    loaded++;
    onProgress?.(loaded, total);
  }));
};

export const getCacheSize = (): number => {
  const keys = Object.keys(localStorage).filter(k => k.startsWith(CACHE_KEY_PREFIX));
  let totalSize = 0;
  
  for (const key of keys) {
    const value = localStorage.getItem(key);
    if (value) {
      totalSize += value.length * 2;
    }
  }
  
  return totalSize;
};

export const formatCacheSize = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
};

export const clearCache = (): void => {
  memoryCache.clear();
  const keys = Object.keys(localStorage).filter(k => k.startsWith(CACHE_KEY_PREFIX));
  for (const key of keys) {
    localStorage.removeItem(key);
  }
};

export const getMemoryCacheSize = (): number => {
  let size = 0;
  for (const [, data] of memoryCache) {
    size += data.length * 2;
  }
  return size;
};