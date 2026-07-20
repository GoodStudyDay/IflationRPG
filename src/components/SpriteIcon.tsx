import { useState, useEffect } from 'react';
import { cacheImage } from '@/utils/imageCache';

interface SpriteIconProps {
  type: 'weapon' | 'armor' | 'accessory' | 'soul' | 'material';
  x: number;
  y: number;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  image?: number;
  bit32?: number;
}

const BASE_URL = import.meta.env.BASE_URL || '/';

const SPRITE_CONFIG = {
  weapon: { path: `${BASE_URL}images/item/244_item0png.png`, tileSize: 24, width: 384, height: 240 },
  weapon1: { path: `${BASE_URL}images/item/921_buki32png.png`, tileSize: 32, width: 448, height: 512 },
  weapon2: { path: `${BASE_URL}images/item/244_item0png.png`, tileSize: 24, width: 384, height: 240 },
  weapon3: { path: `${BASE_URL}images/item/984_weaponpng01.png`, tileSize: 32, width: 160, height: 32 },
  weapon4: { path: `${BASE_URL}images/item/1052_newbuki32.png`, tileSize: 32, width: 192, height: 160 },
  weapon5: { path: `${BASE_URL}images/item/1068_new32weapons.png`, tileSize: 32, width: 160, height: 192 },
  armor: { path: `${BASE_URL}images/item/245_item1png.png`, tileSize: 24, width: 384, height: 120 },
  accessory: { path: `${BASE_URL}images/item/246_item2png.png`, tileSize: 24, width: 336, height: 240 },
  accessory1: { path: `${BASE_URL}images/item/919_item3png.png`, tileSize: 24, width: 264, height: 264 },
  accessory2: { path: `${BASE_URL}images/item/928_accPlus.png`, tileSize: 24, width: 384, height: 408 },
  soul: { path: `${BASE_URL}images/item/934_SoulPng.png`, tileSize: 24, width: 384, height: 120 },
  soul2: { path: `${BASE_URL}images/item/935_SoulPng2.png`, tileSize: 48, width: 384, height: 576 },
  material: { path: `${BASE_URL}images/item/1041_item4png.png`, tileSize: 24, width: 240, height: 240 },
  material1: { path: `${BASE_URL}images/item/919_item3png.png`, tileSize: 24, width: 264, height: 264 },
  material2: { path: `${BASE_URL}images/item/928_accPlus.png`, tileSize: 24, width: 384, height: 408 },
  material3: { path: `${BASE_URL}images/item/1041_item4png.png`, tileSize: 24, width: 240, height: 240 },
};

const SIZE_MAP = {
  small: 32,
  medium: 40,
  large: 64,
};

export const SpriteIcon = ({ type, x, y, size = 'medium', className = '', image, bit32 }: SpriteIconProps) => {
  let config = SPRITE_CONFIG[type];
  
  if (type === 'weapon') {
    switch (bit32) {
      case 1: config = SPRITE_CONFIG.weapon1; break;
      case 2: config = SPRITE_CONFIG.weapon1; break;
      case 3: config = SPRITE_CONFIG.weapon3; break;
      case 4: config = SPRITE_CONFIG.weapon4; break;
      case 5: config = SPRITE_CONFIG.weapon5; break;
      case 99: config = SPRITE_CONFIG.accessory; break;
    }
  } else if (type === 'armor') {
    if (bit32 === 99) {
      config = SPRITE_CONFIG.accessory;
    }
  } else if (type === 'accessory') {
    if (image === 1) {
      config = SPRITE_CONFIG.accessory1;
    } else if (image === 2) {
      config = SPRITE_CONFIG.accessory2;
    } else if (image && image > 2) {
      config = SPRITE_CONFIG.accessory2;
    }
  } else if (type === 'material') {
    switch (bit32) {
      case 1: config = SPRITE_CONFIG.material1; break;
      case 2: config = SPRITE_CONFIG.material2; break;
      case 3: config = SPRITE_CONFIG.material3; break;
      case 4: config = SPRITE_CONFIG.accessory; break;
      default: config = SPRITE_CONFIG.material; break;
    }
  } else if (type === 'soul') {
    if (image === 2) {
      config = SPRITE_CONFIG.soul2;
    } else {
      config = SPRITE_CONFIG.soul;
    }
  }
  
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
