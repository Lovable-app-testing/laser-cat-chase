import { useState, useEffect } from 'react';
import { Cat } from './Cat';
import { LaserPointer } from './LaserPointer';

export const CatLaserGame = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isGameActive, setIsGameActive] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isGameActive) {
        setIsGameActive(true);
      }
    };

    const handleMouseLeave = () => {
      setIsGameActive(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isGameActive]);

  return (
    <div className="fixed inset-0 overflow-hidden cursor-none bg-background">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--accent))_1px,transparent_1px)] bg-[length:40px_40px]" />
      </div>

      {/* Game title */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30">
        <h1 className="text-4xl font-bold text-foreground text-center">
          🐱 Cat Laser Chase
        </h1>
        <p className="text-muted-foreground text-center mt-2">
          Move your mouse to control the laser pointer!
        </p>
      </div>

      {/* Instructions */}
      {!isGameActive && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 text-center">
          <p className="text-lg text-accent animate-pulse">
            Start moving your mouse to begin!
          </p>
        </div>
      )}

      {/* Game elements */}
      {isGameActive && (
        <>
          <LaserPointer position={mousePosition} />
          <Cat targetPosition={mousePosition} />
        </>
      )}

      {/* Fun facts about cats */}
      <div className="absolute bottom-8 right-8 z-30 max-w-xs">
        <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-border">
          <h3 className="font-semibold text-card-foreground mb-2">Did you know?</h3>
          <p className="text-sm text-muted-foreground">
            Cats can't actually see laser dots very well, but they love chasing the movement!
            Their predatory instincts kick in when they see something small and fast moving.
          </p>
        </div>
      </div>
    </div>
  );
};