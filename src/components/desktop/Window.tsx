import React, { useState, useRef, useEffect } from 'react';
import { X, Minus, Square, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WindowProps {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onPositionChange: (pos: { x: number; y: number }) => void;
  children: React.ReactNode;
}

export function Window({
  title,
  icon,
  isOpen,
  isMinimized,
  isMaximized,
  zIndex,
  position,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onPositionChange,
  children,
}: WindowProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 600, height: 450 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDragging && !isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        onPositionChange({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      } else if (isResizing && resizeDirection) {
        const minWidth = 300;
        const minHeight = 200;

        if (resizeDirection.includes('e')) {
          setSize((prev) => ({ ...prev, width: Math.max(minWidth, e.clientX - position.x) }));
        }
        if (resizeDirection.includes('s')) {
          setSize((prev) => ({ ...prev, height: Math.max(minHeight, e.clientY - position.y) }));
        }
        if (resizeDirection.includes('w')) {
          const newWidth = Math.max(minWidth, size.width + (position.x - e.clientX));
          if (newWidth > minWidth) {
            onPositionChange({ ...position, x: e.clientX });
            setSize((prev) => ({ ...prev, width: newWidth }));
          }
        }
        if (resizeDirection.includes('n')) {
          const newHeight = Math.max(minHeight, size.height + (position.y - e.clientY));
          if (newHeight > minHeight) {
            onPositionChange({ ...position, y: e.clientY });
            setSize((prev) => ({ ...prev, height: newHeight }));
          }
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeDirection(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, resizeDirection, onPositionChange, position, size]);

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    onFocus();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    e.preventDefault();
    onFocus();
    setIsResizing(true);
    setResizeDirection(direction);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onClose();
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onMinimize();
  };

  const handleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onMaximize();
  };

  if (!isOpen || isMinimized) return null;

  return (
    <div
      ref={windowRef}
      className={cn(
        'fixed flex flex-col overflow-hidden',
        'bg-background backdrop-blur-xl',
        'border border-border/50',
        'shadow-2xl shadow-black/20',
        'transition-shadow duration-300 ease-out',
        isMaximized ? 'rounded-none' : 'rounded-xl',
        isHovered && !isDragging && 'shadow-[0_25px_60px_-12px_rgba(0,0,0,0.35)]'
      )}
      style={
        isMaximized
          ? { zIndex, top: 0, left: 0, width: '100vw', height: 'calc(100vh - 48px)' }
          : { zIndex, left: position.x, top: position.y, width: size.width, height: size.height }
      }
      onMouseDown={onFocus}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Title Bar */}
      <div
        className={cn(
          'flex items-center justify-between px-4 py-2.5 shrink-0',
          'bg-gradient-to-b from-muted/80 to-muted/40',
          'border-b border-border/30',
          !isMaximized && 'cursor-move'
        )}
        onMouseDown={(e) => {
          if ((e.target as HTMLElement).closest('button')) return;
          handleTitleBarMouseDown(e);
        }}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-primary transition-transform duration-200 hover:scale-110">{icon}</span>
          <span className="text-sm font-medium text-foreground/90 select-none">{title}</span>
        </div>
        
        {/* Window Controls */}
        <div className="flex items-center gap-1 relative z-50">
          <button
            type="button"
            onClick={handleMinimize}
            className={cn(
              'w-9 h-7 flex items-center justify-center rounded-md',
              'transition-all duration-200 ease-out',
              'hover:bg-muted active:scale-95',
              'group'
            )}
          >
            <Minus className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>
          <button
            type="button"
            onClick={handleMaximize}
            className={cn(
              'w-9 h-7 flex items-center justify-center rounded-md',
              'transition-all duration-200 ease-out',
              'hover:bg-muted active:scale-95',
              'group'
            )}
          >
            {isMaximized ? (
              <Copy className="w-3 h-3 text-muted-foreground group-hover:text-foreground transition-colors" />
            ) : (
              <Square className="w-2.5 h-2.5 text-muted-foreground group-hover:text-foreground transition-colors" />
            )}
          </button>
          <button
            type="button"
            onClick={handleClose}
            className={cn(
              'w-9 h-7 flex items-center justify-center rounded-md',
              'transition-all duration-200 ease-out',
              'hover:bg-destructive active:scale-95',
              'group'
            )}
          >
            <X className="w-3.5 h-3.5 text-muted-foreground group-hover:text-destructive-foreground transition-colors" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 overflow-y-auto bg-background">
        {children}
      </div>

      {/* Resize Handles (only when not maximized) */}
      {!isMaximized && (
        <>
          {/* Corners */}
          <div
            className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize hover:bg-primary/10 transition-colors rounded-tl-xl"
            onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
          />
          <div
            className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize hover:bg-primary/10 transition-colors rounded-tr-xl"
            onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
          />
          <div
            className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize hover:bg-primary/10 transition-colors rounded-bl-xl"
            onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
          />
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize hover:bg-primary/10 transition-colors rounded-br-xl"
            onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
          />
          {/* Edges */}
          <div
            className="absolute top-0 left-4 right-4 h-1.5 cursor-n-resize hover:bg-primary/10 transition-colors"
            onMouseDown={(e) => handleResizeMouseDown(e, 'n')}
          />
          <div
            className="absolute bottom-0 left-4 right-4 h-1.5 cursor-s-resize hover:bg-primary/10 transition-colors"
            onMouseDown={(e) => handleResizeMouseDown(e, 's')}
          />
          <div
            className="absolute left-0 top-4 bottom-4 w-1.5 cursor-w-resize hover:bg-primary/10 transition-colors"
            onMouseDown={(e) => handleResizeMouseDown(e, 'w')}
          />
          <div
            className="absolute right-0 top-4 bottom-4 w-1.5 cursor-e-resize hover:bg-primary/10 transition-colors"
            onMouseDown={(e) => handleResizeMouseDown(e, 'e')}
          />
        </>
      )}
    </div>
  );
}
