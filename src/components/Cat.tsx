import { useEffect, useState, useRef } from 'react';
import catSprite from '../assets/cat-sprite.png';

interface CatProps {
  targetPosition: { x: number; y: number };
}

export const Cat = ({ targetPosition }: CatProps) => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isChasing, setIsChasing] = useState(false);
  const animationRef = useRef<number>();

  useEffect(() => {
    const updatePosition = () => {
      setPosition(prevPos => {
        const dx = targetPosition.x - prevPos.x;
        const dy = targetPosition.y - prevPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // If close enough, slow down and show excited animation
        if (distance < 50) {
          setIsChasing(true);
          return {
            x: prevPos.x + dx * 0.05,
            y: prevPos.y + dy * 0.05
          };
        } else {
          setIsChasing(false);
          // Move towards the target with smooth easing
          return {
            x: prevPos.x + dx * 0.08,
            y: prevPos.y + dy * 0.08
          };
        }
      });

      animationRef.current = requestAnimationFrame(updatePosition);
    };

    updatePosition();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetPosition]);

  // Calculate rotation based on movement direction
  const rotation = Math.atan2(
    targetPosition.y - position.y,
    targetPosition.x - position.x
  ) * (180 / Math.PI);

  return (
    <div
      className={`fixed pointer-events-none z-40 transition-transform duration-200 ${
        isChasing ? 'animate-cat-bounce' : 'animate-float'
      }`}
      style={{
        left: position.x - 32,
        top: position.y - 32,
        transform: `rotate(${rotation + 90}deg)`,
      }}
    >
      <img
        src={catSprite}
        alt="Cat chasing laser"
        className="w-16 h-16 object-contain drop-shadow-lg"
        style={{
          filter: 'drop-shadow(2px 2px 4px hsl(var(--cat-shadow)))',
        }}
      />
      
      {/* Paw prints trail effect */}
      {isChasing && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
          <div className="flex space-x-1 opacity-60">
            <div className="w-1 h-1 bg-cat-orange rounded-full animate-pulse" />
            <div className="w-1 h-1 bg-cat-orange rounded-full animate-pulse delay-75" />
            <div className="w-1 h-1 bg-cat-orange rounded-full animate-pulse delay-150" />
          </div>
        </div>
      )}
    </div>
  );
};