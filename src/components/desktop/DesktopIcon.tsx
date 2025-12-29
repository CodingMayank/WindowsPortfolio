import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface DesktopIconProps {
  icon: React.ReactNode;
  label: string;
  initialPosition: { x: number; y: number };
  onClick: () => void;
  isMobile?: boolean;
  animationDelay?: number;
}

export function DesktopIcon({ icon, label, initialPosition, onClick, isMobile, animationDelay = 0 }: DesktopIconProps) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const clickStart = useRef<{ x: number; y: number; time: number } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), animationDelay);
    return () => clearTimeout(timer);
  }, [animationDelay]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return;
    clickStart.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    setIsDragging(true);
    setIsPressed(true);
  };

  useEffect(() => {
    if (!isDragging || isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = Math.abs(e.clientX - (clickStart.current?.x || 0));
      const dy = Math.abs(e.clientY - (clickStart.current?.y || 0));
      if (dx > 5 || dy > 5) {
        setPosition({
          x: e.clientX - dragOffset.current.x,
          y: e.clientY - dragOffset.current.y,
        });
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      setIsDragging(false);
      setIsPressed(false);
      
      if (clickStart.current) {
        const dx = Math.abs(e.clientX - clickStart.current.x);
        const dy = Math.abs(e.clientY - clickStart.current.y);
        const dt = Date.now() - clickStart.current.time;
        
        if (dx < 5 && dy < 5 && dt < 300) {
          onClick();
        }
      }
      clickStart.current = null;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onClick, isMobile]);

  const handlePointerDown = () => {
    if (!isMobile) return;
    setIsPressed(true);
  };

  const handlePointerUp = () => {
    if (!isMobile) return;
    setIsPressed(false);
  };

  // Mobile layout - grid item
  if (isMobile) {
    return (
      <button
        className={cn(
          'flex flex-col items-center justify-center gap-1 p-2 rounded-lg',
          'transition-all duration-150 ease-out',
          'active:scale-95 active:bg-background/20',
          isPressed && 'scale-95 bg-background/20',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        )}
        onClick={onClick}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ touchAction: 'manipulation' }}
      >
        <div className={cn(
          'p-2.5 rounded-lg bg-background/50 backdrop-blur-md',
          'border border-border/20',
          'transition-transform duration-150',
          'text-foreground/80'
        )}>
          {icon}
        </div>
        <span className="text-[10px] font-medium text-primary-foreground dark:text-foreground text-center leading-tight max-w-[56px] truncate drop-shadow-sm">
          {label}
        </span>
      </button>
    );
  }

  // Desktop layout - absolute positioned, draggable
  return (
    <div
      className={cn(
        'absolute flex flex-col items-center gap-1 p-2 rounded-lg w-[72px]',
        'cursor-pointer select-none',
        'transition-all duration-150 ease-out',
        'hover:bg-background/30',
        'group',
        isPressed && 'scale-95 bg-background/20',
        isVisible ? 'opacity-100' : 'opacity-0'
      )}
      style={{ left: position.x, top: position.y }}
      onMouseDown={handleMouseDown}
    >
      <div className={cn(
        'p-2 rounded-lg transition-all duration-150',
        'bg-background/40 backdrop-blur-sm',
        'border border-border/20',
        'group-hover:bg-background/60 group-hover:scale-105',
        'text-foreground/70 group-hover:text-foreground/90'
      )}>
        {icon}
      </div>
      <span className={cn(
        'text-[11px] font-medium text-center leading-tight',
        'text-primary-foreground dark:text-foreground drop-shadow-sm',
        'group-hover:opacity-90 transition-opacity'
      )}>
        {label}
      </span>
    </div>
  );
}
