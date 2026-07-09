import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  progress: number;
  total: number;
  onComplete: () => void;
}

export const LoadingScreen = ({ progress, total, onComplete }: LoadingScreenProps) => {
  const [isComplete, setIsComplete] = useState(false);
  const percent = total > 0 ? Math.round((progress / total) * 100) : 0;

  useEffect(() => {
    if (progress >= total && total > 0) {
      const timer = setTimeout(() => {
        setIsComplete(true);
        setTimeout(onComplete, 500);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [progress, total, onComplete]);

  return (
    <div className={`min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center transition-opacity duration-500 ${isComplete ? 'opacity-0' : ''}`}>
      <div className="relative z-10 text-center">
        <h1 className="text-4xl sm:text-6xl font-black mb-8">
          <span className="text-red-600 drop-shadow-lg">Iflation</span>
          <span className="text-yellow-500 drop-shadow-lg">RPG</span>
        </h1>
        
        <div className="w-64 sm:w-80 mx-auto">
          <div className="h-4 bg-gray-700 rounded-full overflow-hidden border-2 border-gray-600">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-300 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-gray-300 mt-3 text-lg">
            {percent < 100 ? `Loading assets... ${progress}/${total}` : 'Ready!'}
          </p>
          <p className="text-gray-500 text-sm mt-1">
            {percent}%
          </p>
        </div>
        
        <div className="mt-8 flex justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 150}ms`, animationDuration: '1s' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};