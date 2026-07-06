import { useState, useEffect } from 'react';
import { cacheImage } from '@/utils/imageCache';

interface SpriteIconProps {
  type: 'weapon' | 'armor' | 'accessory' | 'soul';
  x: number;
  y: number;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  image?: number;
}

const BASE_URL = import.meta.env.BASE_URL || '/';

const SPRITE_CONFIG = {
  weapon: { path: `${BASE_URL}images/item/244_item0png.png`, tileSize: 24, width: 384, height: 240 },
  armor: { path: `${BASE_URL}images/item/245_item1png.png`, tileSize: 24, width: 384, height: 120 },
  accessory: { path: `${BASE_URL}images/item/246_item2png.png`, tileSize: 24, width: 336, height: 240 },
  accessoryPlus: { path: `${BASE_URL}images/928_accPlus.png`, tileSize: 24, width: 384, height: 408 },
  soul: { path: `${BASE_URL}images/item/935_SoulPng2.png`, tileSize: 48, width: 384, height: 576 },
};

const SIZE_MAP = {
  small: 32,
  medium: 40,
  large: 64,
};

export const SpriteIcon = ({ type, x, y, size = 'medium', className = '', image }: SpriteIconProps) => {
  const config = type === 'accessory' && image && image > 0 
    ? SPRITE_CONFIG.accessoryPlus 
    : SPRITE_CONFIG[type];
  
  const [imageUrl, setImageUrl] = useState<string>(config.path);
  const displaySize = SIZE_MAP[size];
  
  const scale = displaySize / config.tileSize;
  
  const bgSizeX = config.width * scale;
  const bgSizeY = config.height * scale;
  
  const bgPosX = -x * displaySize;
  const bgPosY = -y * displaySize;
  
  useEffect(() => {
    const loadImage = async () => {
      const cachedUrl = await cacheImage(config.path);
      setImageUrl(cachedUrl);
    };
    loadImage();
  }, [config.path]);
  
  return (
    <div
      className={`${className}`}
      style={{
        width: `${displaySize}px`,
        height: `${displaySize}px`,
        backgroundImage: `url(${imageUrl})`,
        backgroundPosition: `${bgPosX}px ${bgPosY}px`,
        backgroundSize: `${bgSizeX}px ${bgSizeY}px`,
        backgroundRepeat: 'no-repeat',
        imageRendering: 'pixelated',
      }}
    />
  );
};