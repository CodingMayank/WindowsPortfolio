import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface DesktopIconProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  initialPosition: { x: number; y: number };
  isMobile?: boolean;
}

export function DesktopIcon({ icon, label, onClick, initialPosition, isMobile }: DesktopIconProps) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const iconRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isDragging || isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      setHasMoved(true);
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, isMobile]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return;
    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    setIsDragging(true);
    setHasMoved(false);
  };

  const handleClick = () => {
    if (!hasMoved || isMobile) {
      onClick();
    }
  };

  // Mobile layout - static grid items
  if (isMobile) {
    return (
      <button
        onClick={onClick}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        className={cn(
          'flex flex-col items-center gap-1.5 p-2 rounded-xl',
          'active:bg-white/20 transition-all duration-150',
          'focus:outline-none select-none',
          isPressed && 'scale-95 bg-white/10'
        )}
      >
        <div className={cn(
          "w-12 h-12 flex items-center justify-center text-white",
          "transition-transform duration-150",
          isPressed && "scale-110"
        )}>
          {icon}
        </div>
        <span className="text-[10px] text-white text-center font-medium leading-tight drop-shadow-md line-clamp-2">
          {label}
        </span>
      </button>
    );
  }

  // Desktop layout - absolute positioning with drag
  return (
    <button
      ref={iconRef}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      className={cn(
        'absolute flex flex-col items-center gap-2 p-3 rounded-lg w-20',
        'hover:bg-white/10 active:bg-white/20 transition-all duration-150',
        'focus:outline-none focus:ring-1 focus:ring-white/30',
        'select-none group',
        isDragging && 'cursor-grabbing z-50'
      )}
      style={{
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      <div className="w-12 h-12 flex items-center justify-center text-white pointer-events-none transition-transform duration-150 group-hover:scale-110">
        {icon}
      </div>
      <span className="text-xs text-white text-center font-medium leading-tight drop-shadow-md pointer-events-none">
        {label}
      </span>
    </button>
  );
}
