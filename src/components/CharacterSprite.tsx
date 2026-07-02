import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { getHeroById, getHeroSpritePath } from '@/data/heroData';
import { cacheImage } from '@/utils/imageCache';

const BASE_URL = import.meta.env.BASE_URL || '/';

export type CharacterAnimation = 'idle' | 'attack' | 'hurt' | 'dead' | 'victory';

interface CharacterSpriteProps {
  animation: CharacterAnimation;
  size?: number;
  useBackView?: boolean;
  className?: string;
}

const COLS = 3;
const ROWS = 4;

export const CharacterSprite = ({ 
  animation = 'idle', 
  size = 96,
  useBackView = false,
  className = ''
}: CharacterSpriteProps) => {
  const { player } = useGameStore();
  const [frame, setFrame] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const intervalRef = useRef<number | null>(null);

  const hero = getHeroById(player.heroId);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (animation === 'idle') {
      intervalRef.current = window.setInterval(() => {
        setFrame(prev => (prev + 1) % COLS);
      }, 300);
    } else if (animation === 'attack') {
      setIsAnimating(true);
      setFrame(0);
      let currentFrame = 0;
      intervalRef.current = window.setInterval(() => {
        currentFrame++;
        if (currentFrame >= COLS) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setIsAnimating(false);
          setFrame(0);
        } else {
          setFrame(currentFrame);
        }
      }, 100);
    } else if (animation === 'hurt') {
      setIsAnimating(true);
      setFrame(0);
      let currentFrame = 0;
      intervalRef.current = window.setInterval(() => {
        currentFrame++;
        if (currentFrame >= 2) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setIsAnimating(false);
          setFrame(0);
        } else {
          setFrame(currentFrame);
        }
      }, 100);
    } else if (animation === 'victory') {
      intervalRef.current = window.setInterval(() => {
        setFrame(prev => (prev + 1) % COLS);
      }, 200);
    } else if (animation === 'dead') {
      setFrame(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [animation]);

  const getSpriteConfig = () => {
    if (!hero) {
      return {
        imagePath: `${BASE_URL}images/player/963_heropng83_0.png`,
        bgPosX: 0,
        bgPosY: 0,
      };
    }

    const row = useBackView ? ROWS - 1 : 0;

    const getPath = (type: 'idle' | 'battle' | 'victory') => {
      return BASE_URL + getHeroSpritePath(player.heroId, type).replace(/^\//, '');
    };

    switch (animation) {
      case 'idle':
        return {
          imagePath: getPath('idle'),
          bgPosX: -(frame % COLS) * size,
          bgPosY: -row * size,
        };
      case 'attack':
        return {
          imagePath: getPath('idle'),
          bgPosX: -(frame % COLS) * size,
          bgPosY: -row * size,
        };
      case 'hurt':
        return {
          imagePath: getPath('battle'),
          bgPosX: -(frame % 2) * size,
          bgPosY: -row * size,
        };
      case 'victory':
        return {
          imagePath: getPath('victory'),
          bgPosX: -(frame % COLS) * size,
          bgPosY: -row * size,
        };
      case 'dead':
        return {
          imagePath: getPath('battle'),
          bgPosX: 0,
          bgPosY: -(ROWS - 1) * size,
        };
      default:
        return {
          imagePath: getPath('idle'),
          bgPosX: 0,
          bgPosY: 0,
        };
    }
  };

  const spriteConfig = getSpriteConfig();

  useEffect(() => {
    const loadImage = async () => {
      const cachedUrl = await cacheImage(spriteConfig.imagePath);
      setImageUrl(cachedUrl);
    };
    loadImage();
  }, [spriteConfig.imagePath]);

  const getTransform = () => {
    switch (animation) {
      case 'attack':
        return isAnimating ? 'translate-x-4 scale-110' : '';
      case 'dead':
        return 'opacity-50 scale-90';
      case 'victory':
        return 'translate-y-[-5px]';
      default:
        return '';
    }
  };

  return (
    <div 
      className={`relative flex items-center justify-center ${getTransform()} ${className}`}
      style={{ 
        width: size, 
        height: size,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          backgroundImage: imageUrl ? `url(${imageUrl})` : `url(${spriteConfig.imagePath})`,
          backgroundPosition: `${spriteConfig.bgPosX}px ${spriteConfig.bgPosY}px`,
          backgroundSize: `${COLS * size}px ${ROWS * size}px`,
          backgroundRepeat: 'no-repeat',
          imageRendering: 'pixelated',
        }}
      />
      
      {animation === 'dead' && (
        <div className="absolute inset-0 bg-gray-500/50" />
      )}
      {animation === 'victory' && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2">
          <span className="text-yellow-400 text-xs font-bold animate-bounce">Victory!</span>
        </div>
      )}
    </div>
  );
};