import { useState, useEffect } from 'react';

export type CharacterAnimation = 'idle' | 'attack' | 'hurt' | 'dead';

interface CharacterSpriteProps {
  animation: CharacterAnimation;
  direction?: 'left' | 'right' | 'front' | 'back';
  size?: number;
}

export const CharacterSprite = ({ 
  animation = 'idle', 
  direction = 'front', 
  size = 96 
}: CharacterSpriteProps) => {
  const [frame, setFrame] = useState(0);
  
  useEffect(() => {
    setFrame(0);
    if (animation === 'idle') {
      const interval = setInterval(() => {
        setFrame(f => (f + 1) % 4);
      }, 300);
      return () => clearInterval(interval);
    } else if (animation === 'attack') {
      const interval = setInterval(() => {
        setFrame(f => {
          if (f >= 2) return 0;
          return f + 1;
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [animation]);
  
  const getSpritePosition = () => {
    const spriteWidth = 100;
    const spriteHeight = 100;
    const safeFrame = Number.isNaN(frame) ? 0 : frame;
    
    switch (animation) {
      case 'idle':
        switch (direction) {
          case 'front': return { x: 0, y: 0 };
          case 'right': return { x: spriteWidth * (safeFrame % 3), y: spriteHeight };
          case 'left': return { x: spriteWidth * (safeFrame % 3), y: spriteHeight * 2 };
          case 'back': return { x: spriteWidth * 2, y: 0 };
          default: return { x: 0, y: 0 };
        }
      case 'attack':
        return { x: spriteWidth * safeFrame, y: spriteHeight * 2 };
      case 'hurt':
        return { x: spriteWidth * 1, y: spriteHeight * 3 };
      case 'dead':
        return { x: spriteWidth * 2, y: spriteHeight * 3 };
      default:
        return { x: 0, y: 0 };
    }
  };
  
  const position = getSpritePosition();
  
  return (
    <div 
      className="relative"
      style={{ 
        width: size, 
        height: size,
        overflow: 'hidden',
      }}
    >
      <img
        src="/images/player/hero.svg"
        alt="character"
        className="absolute transition-all duration-100"
        style={{
          width: size * 3,
          height: size * 4,
          objectFit: 'cover',
          transform: `translate(-${position.x * (size / 100)}px, -${position.y * (size / 100)}px)`,
        }}
      />
      {animation === 'hurt' && (
        <div className="absolute inset-0 bg-red-500/30 animate-pulse" />
      )}
    </div>
  );
};
