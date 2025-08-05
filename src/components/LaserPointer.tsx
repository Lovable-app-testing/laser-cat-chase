import { useEffect, useState } from 'react';

interface LaserPointerProps {
  position: { x: number; y: number };
}

export const LaserPointer = ({ position }: LaserPointerProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: position.x - 3,
        top: position.y - 3,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Laser dot */}
      <div className="w-2 h-2 bg-laser-red rounded-full animate-laser-pulse" />
      
      {/* Outer glow */}
      <div 
        className="absolute top-1/2 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 bg-laser-glow rounded-full opacity-60 blur-sm" 
      />
      
      {/* Large glow */}
      <div 
        className="absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 bg-laser-red rounded-full opacity-20 blur-md animate-pulse" 
      />
    </div>
  );
};