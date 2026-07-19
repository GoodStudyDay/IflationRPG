/**
 * Logo 图片 localStorage 缓存
 *
 * 把 logo 文件夹中的关键图片以 base64 形式缓存到 localStorage，
 * 后续读取时直接从 localStorage 获取，避免每次请求网络。
 */

const CACHE_PREFIX = 'logo_cache_';

const LOGO_FILES = [
  '145_titlebackpng.png',
  '143_logoENpng.png',
  '1066.png',
];

/**
 * 获取缓存中已存储的图片 URL（base64 data URL）
 * 如果缓存未命中，返回 null
 */
export const getLogoFromCache = (fileName: string): string | null => {
  try {
    const cached = localStorage.getItem(CACHE_PREFIX + fileName);
    if (cached && cached.startsWith('data:image')) {
      return cached;
    }
  } catch {
    // ignore
  }
  return null;
};

/**
 * 将图片以 base64 存入 localStorage
 */
const cacheLogoToStorage = async (fileName: string, url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        try {
          localStorage.setItem(CACHE_PREFIX + fileName, base64);
        } catch {
          // localStorage 满了则跳过缓存
        }
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return url;
  }
};

/**
 * 获取 logo 图片 URL（优先从缓存获取）
 * @param basePath  图片所在的基础路径，如 `${import.meta.env.BASE_URL}images/logo/`
 * @param fileName  图片文件名
 * @returns base64 data URL 或原始 URL
 */
export const getLogoSrc = async (basePath: string, fileName: string): Promise<string> => {
  // 先尝试从 localStorage 缓存获取
  const cached = getLogoFromCache(fileName);
  if (cached) return cached;

  // 缓存未命中则从网络获取并缓存
  const url = `${basePath}${fileName}`;
  return cacheLogoToStorage(fileName, url);
};

/**
 * 预加载所有 logo 图片到 localStorage 缓存
 * 在进入标题画面前调用
 */
export const preloadLogos = async (basePath: string): Promise<void> => {
  const results = await Promise.allSettled(
    LOGO_FILES.map((fileName) => {
      const cached = getLogoFromCache(fileName);
      if (!cached) {
        return cacheLogoToStorage(fileName, `${basePath}${fileName}`);
      }
      return Promise.resolve(cached);
    })
  );
  // 静默处理失败
  void results;
};
