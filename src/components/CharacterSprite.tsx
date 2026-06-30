export type CharacterAnimation = 'idle' | 'attack' | 'hurt' | 'dead';

interface CharacterSpriteProps {
  animation: CharacterAnimation;
  size?: number;
}

export const CharacterSprite = ({ 
  animation = 'idle', 
  size = 96 
}: CharacterSpriteProps) => {
  
  return (
    <div 
      className="relative flex items-center justify-center"
      style={{ 
        width: size, 
        height: size * 1.5,
      }}
    >
      <img
        src="/images/player/hero.svg"
        alt="character"
        className="transition-all duration-100"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
      {animation === 'hurt' && (
        <div className="absolute inset-0 bg-red-500/30 animate-pulse" />
      )}
    </div>
  );
};
