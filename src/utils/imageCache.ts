const memoryCache = new Map<string, string>();

export const cacheImage = async (url: string): Promise<string> => {
  if (memoryCache.has(url)) {
    return memoryCache.get(url)!;
  }

  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        const base64Data = reader.result as string;
        memoryCache.set(url, base64Data);
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
  return null;
};

export const getOrCacheImage = async (url: string): Promise<string> => {
  const cached = getCachedImage(url);
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

export const clearCache = (): void => {
  memoryCache.clear();
};

export const getMemoryCacheSize = (): number => {
  let size = 0;
  for (const [, data] of memoryCache) {
    size += data.length * 2;
  }
  return size;
};