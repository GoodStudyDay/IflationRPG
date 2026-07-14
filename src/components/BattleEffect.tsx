import { useState, useEffect, useRef } from 'react';
import { getEffectByIndex } from '@/data/battleEffects';
import { getOrCacheImage } from '@/utils/imageCache';

interface BattleEffectProps {
  effectId: number;
  position: 'player' | 'enemy';
  onComplete?: () => void;
}

const BASE_URL = import.meta.env.BASE_URL;

const PRELOADED_IMAGES: Record<string, { width: number; height: number }> = {
  [`${BASE_URL}images/eef/257_ef_kougeki1.png`]: { width: 540, height: 60 },
  [`${BASE_URL}images/eef/258_ef_kougeki2.png`]: { width: 540, height: 60 },
  [`${BASE_URL}images/eef/259_ef_kougeki3.png`]: { width: 540, height: 90 },
  [`${BASE_URL}images/eef/260_ef_kougeki4.png`]: { width: 810, height: 60 },
  [`${BASE_URL}images/eef/256_ef_kaihuku.png`]: { width: 1080, height: 90 },
  [`${BASE_URL}images/eef/250_ef_Skougeki1.png`]: { width: 360, height: 216 },
  [`${BASE_URL}images/eef/251_ef_Skougeki2.png`]: { width: 360, height: 216 },
  [`${BASE_URL}images/eef/252_ef_Skougeki3.png`]: { width: 360, height: 432 },
  [`${BASE_URL}images/eef/253_ef_Skougeki4.png`]: { width: 360, height: 432 },
  [`${BASE_URL}images/eef/254_ef_Skougeki5.png`]: { width: 360, height: 432 },
  [`${BASE_URL}images/eef/255_ef_Skougeki6.png`]: { width: 360, height: 432 },
  [`${BASE_URL}images/eef/249_ef_Enekougeki1.png`]: { width: 420, height: 60 },
};

const processedCanvasCache = new Map<string, HTMLCanvasElement>();

const loadImageWithTransparentBlack = async (url: string): Promise<HTMLCanvasElement> => {
  const cachedUrl = await getOrCacheImage(url);
  
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      const threshold = 30;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        if (r < threshold && g < threshold && b < threshold) {
          data[i+3] = 0;
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      resolve(canvas);
    };
    img.onerror = function() {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      resolve(canvas);
    };
    img.src = cachedUrl;
  });
};

export const BattleEffect = ({ effectId, position, onComplete }: BattleEffectProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const processedCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const effect = getEffectByIndex(effectId);

  if (!effect) return null;

  const imageSize = PRELOADED_IMAGES[effect.imagePath] || { width: 540, height: 60 };

  useEffect(() => {
    const cachedCanvas = processedCanvasCache.get(effect.imagePath);
    if (cachedCanvas) {
      processedCanvasRef.current = cachedCanvas;
      setImageLoaded(true);
      startTimeRef.current = performance.now();
      return;
    }

    loadImageWithTransparentBlack(effect.imagePath).then((canvas) => {
      processedCanvasCache.set(effect.imagePath, canvas);
      processedCanvasRef.current = canvas;
      setImageLoaded(true);
      startTimeRef.current = performance.now();
    }).catch(() => {
      console.error(`Failed to load effect image: ${effect.imagePath}`);
    });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [effect]);

  useEffect(() => {
    if (!imageLoaded || !processedCanvasRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const SCALE = 2;
    const framePixelWidth = imageSize.width / effect.framesPerRow;
    const framePixelHeight = imageSize.height / effect.rows;

    canvas.width = framePixelWidth * SCALE;
    canvas.height = framePixelHeight * SCALE;

    const animate = () => {
      const elapsed = performance.now() - startTimeRef.current;
      const frameDuration = 33;
      const frameIndex = Math.min(
        Math.floor(elapsed / frameDuration),
        effect.frameCount - 1
      );

      const row = Math.floor(frameIndex / effect.framesPerRow);
      const col = frameIndex % effect.framesPerRow;
      const clipX = col * framePixelWidth;
      const clipY = row * framePixelHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false;
      
      if (effect.blendMode === 'add') {
        ctx.globalCompositeOperation = 'lighter';
      } else {
        ctx.globalCompositeOperation = 'source-over';
      }
      
      ctx.drawImage(
        processedCanvasRef.current!,
        clipX, clipY, framePixelWidth, framePixelHeight,
        0, 0, canvas.width, canvas.height
      );

      ctx.globalCompositeOperation = 'source-over';

      if (frameIndex < effect.frameCount - 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          onComplete?.();
        }, 0);
      }
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [imageLoaded, effect, imageSize, onComplete]);

  const getPositionStyle = () => {
    if (position === 'player') {
      return {
        top: '70%',
        left: '50%',
      };
    }
    return {
      top: '25%',
      left: '50%',
    };
  };

  const framePixelWidth = imageSize.width / effect.framesPerRow;
  const framePixelHeight = imageSize.height / effect.rows;
  const SCALE = 2;

  return (
    <div
      className="absolute z-50 pointer-events-none overflow-hidden"
      style={{
        ...getPositionStyle(),
        transform: 'translate(-50%, -50%)',
        width: framePixelWidth * SCALE,
        height: framePixelHeight * SCALE,
        zIndex: 100,
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{
          width: framePixelWidth * SCALE,
          height: framePixelHeight * SCALE,
          imageRendering: 'pixelated',
          display: imageLoaded ? 'block' : 'none',
        }}
      />
    </div>
  );
};

export const useBattleEffect = () => {
  const [activeEffect, setActiveEffect] = useState<{ effectId: number; position: 'player' | 'enemy' } | null>(null);

  const playEffect = (effectId: number, position: 'player' | 'enemy') => {
    setActiveEffect({ effectId, position });
  };

  const clearEffect = () => {
    setActiveEffect(null);
  };

  return {
    activeEffect,
    playEffect,
    clearEffect,
  };
};