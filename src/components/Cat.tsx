import { useEffect, useState, useRef } from 'react';
import catSprite from '../assets/cat-sprite.png';

interface CatProps {
  targetPosition: { x: number; y: number };
}

export const Cat = ({ targetPosition }: CatProps) => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isChasing, setIsChasing] = useState(false);
  const [isTired, setIsTired] = useState(false);
  const [chaseTime, setChaseTime] = useState(0);
  const animationRef = useRef<number>();
  const lastTargetRef = useRef(targetPosition);
  const [isMoving, setIsMoving] = useState(false);

  // Fatigue system constants
  const CHASE_DURATION = 8000; // 8 seconds of chasing
  const REST_DURATION = 4000;  // 4 seconds of rest

  useEffect(() => {
    // Track if target is moving
    const targetMoved = 
      Math.abs(targetPosition.x - lastTargetRef.current.x) > 5 ||
      Math.abs(targetPosition.y - lastTargetRef.current.y) > 5;
    
    if (targetMoved) {
      setIsMoving(true);
      lastTargetRef.current = targetPosition;
    }

    // Fatigue timer
    let fatigueTimer: NodeJS.Timeout;
    
    if (isMoving && !isTired) {
      // Cat is actively chasing
      fatigueTimer = setTimeout(() => {
        setChaseTime(prev => {
          const newTime = prev + 100;
          if (newTime >= CHASE_DURATION) {
            setIsTired(true);
            setIsMoving(false);
            // Rest period
            setTimeout(() => {
              setIsTired(false);
              setChaseTime(0);
            }, REST_DURATION);
            return 0;
          }
          return newTime;
        });
      }, 100);
    }

    return () => {
      if (fatigueTimer) clearTimeout(fatigueTimer);
    };
  }, [targetPosition, isMoving, isTired, chaseTime]);

  useEffect(() => {
    if (isTired) return; // Cat won't move when tired

    const updatePosition = () => {
      setPosition(prevPos => {
        const dx = targetPosition.x - prevPos.x;
        const dy = targetPosition.y - prevPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Create trailing behavior - cat stays behind at a certain distance
        const trailDistance = 80; // Minimum distance to maintain behind cursor
        
        if (distance > trailDistance) {
          setIsChasing(true);
          // Calculate direction but maintain trail distance
          const angle = Math.atan2(dy, dx);
          const targetX = targetPosition.x - Math.cos(angle) * trailDistance;
          const targetY = targetPosition.y - Math.sin(angle) * trailDistance;
          
          const newDx = targetX - prevPos.x;
          const newDy = targetY - prevPos.y;
          
          return {
            x: prevPos.x + newDx * 0.12, // Faster chase speed
            y: prevPos.y + newDy * 0.12
          };
        } else {
          setIsChasing(false);
          return prevPos; // Cat stops when close enough
        }
      });

      if (!isTired) {
        animationRef.current = requestAnimationFrame(updatePosition);
      }
    };

    updatePosition();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetPosition, isTired]);

  // Calculate rotation based on movement direction
  const dx = targetPosition.x - position.x;
  const dy = targetPosition.y - position.y;
  const rotation = Math.atan2(dy, dx) * (180 / Math.PI);

  // Energy indicator (visual feedback for fatigue system)
  const energyPercentage = Math.max(0, 100 - (chaseTime / CHASE_DURATION) * 100);

  return (
    <>
      <div
        className={`fixed pointer-events-none z-40 transition-all duration-300 ${
          isTired 
            ? 'animate-pulse' 
            : isChasing 
              ? 'animate-cat-bounce' 
              : 'animate-float'
        }`}
        style={{
          left: position.x - 32,
          top: position.y - 32,
          transform: `rotate(${rotation + 90}deg) ${isTired ? 'scale(0.9)' : 'scale(1)'}`,
        }}
      >
        <img
          src={catSprite}
          alt="Cat chasing laser"
          className={`w-16 h-16 object-contain drop-shadow-lg transition-all duration-200 ${
            isChasing && !isTired 
              ? 'animate-[wiggle_0.3s_ease-in-out_infinite]' 
              : ''
          }`}
          style={{
            filter: `drop-shadow(2px 2px 4px hsl(var(--cat-shadow))) ${
              isTired ? 'grayscale(30%)' : ''
            }`,
          }}
        />
        
        {/* Paw prints trail effect */}
        {isChasing && !isTired && (
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
            <div className="flex space-x-1 opacity-60">
              <div className="w-1 h-1 bg-cat-orange rounded-full animate-pulse" />
              <div className="w-1 h-1 bg-cat-orange rounded-full animate-pulse delay-75" />
              <div className="w-1 h-1 bg-cat-orange rounded-full animate-pulse delay-150" />
            </div>
          </div>
        )}

        {/* Tired indicator */}
        {isTired && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2">
            <div className="text-xl animate-float">😴</div>
          </div>
        )}
      </div>

      {/* Energy bar */}
      {!isTired && isMoving && (
        <div className="fixed top-20 left-8 z-30">
          <div className="bg-card/80 backdrop-blur-sm rounded-lg p-3 border border-border">
            <div className="text-xs text-muted-foreground mb-1">Cat Energy</div>
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-300"
                style={{ width: `${energyPercentage}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};