import { battleEffects } from '@/data/battleEffects';

export const getAllGameImageUrls = (): string[] => {
  const urls: string[] = [];

  const enemyModules = import.meta.glob('/public/images/enemies/*.png', { eager: true, query: '?url', import: 'default' });
  for (const url of Object.values(enemyModules)) {
    urls.push(url as string);
  }

  const effectModules = import.meta.glob('/public/images/eef/*.png', { eager: true, query: '?url', import: 'default' });
  for (const url of Object.values(effectModules)) {
    urls.push(url as string);
  }

  const mapModules = import.meta.glob('/public/images/maps/*.png', { eager: true, query: '?url', import: 'default' });
  for (const url of Object.values(mapModules)) {
    urls.push(url as string);
  }

  const playerModules = import.meta.glob('/public/images/players/*.png', { eager: true, query: '?url', import: 'default' });
  for (const url of Object.values(playerModules)) {
    urls.push(url as string);
  }

  const uiModules = import.meta.glob('/public/images/ui/*.png', { eager: true, query: '?url', import: 'default' });
  for (const url of Object.values(uiModules)) {
    urls.push(url as string);
  }

  for (const effect of battleEffects) {
    if (!urls.includes(effect.imagePath)) {
      urls.push(effect.imagePath);
    }
  }

  return urls;
};

export const getTotalImageCount = (): number => {
  return getAllGameImageUrls().length;
};