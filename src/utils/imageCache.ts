import * as db from './imageCacheDB';

const memoryCache = new Map<string, string>();

export const cacheImage = async (url: string): Promise<string> => {
  if (memoryCache.has(url)) {
    return memoryCache.get(url)!;
  }

  const cachedFromDB = await db.getCachedImage(url);
  if (cachedFromDB) {
    memoryCache.set(url, cachedFromDB);
    return cachedFromDB;
  }

  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const reader = new FileReader();
    
    return new Promise((resolve) => {
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        memoryCache.set(url, base64Data);
        await db.cacheImage(url, base64Data);
        await db.deleteOldCache(200);
        resolve(base64Data);
      };
      reader.onerror = () => {
        memoryCache.set(url, url);
        resolve(url);
      };
      reader.readAsDataURL(blob);
    });
  } catch {
    memoryCache.set(url, url);
    return url;
  }
};

export const getCachedImage = async (url: string): Promise<string | null> => {
  if (memoryCache.has(url)) {
    const cached = memoryCache.get(url)!;
    return cached !== url ? cached : null;
  }

  const cachedFromDB = await db.getCachedImage(url);
  if (cachedFromDB) {
    memoryCache.set(url, cachedFromDB);
    return cachedFromDB;
  }

  return null;
};

export const getOrCacheImage = async (url: string): Promise<string> => {
  const cached = await getCachedImage(url);
  if (cached) {
    return cached;
  }
  return await cacheImage(url);
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

export const clearCache = async (): Promise<void> => {
  memoryCache.clear();
  await db.clearCache();
};

export const getMemoryCacheSize = (): number => {
  let size = 0;
  for (const [, data] of memoryCache) {
    size += data.length * 2;
  }
  return size;
};

export const getCacheSize = async (): Promise<number> => {
  return await db.getCacheSize();
};

export const formatCacheSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};