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
  isMobile?: boolean;
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
  isMobile,
}: WindowProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 600, height: 450 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setIsAnimatingIn(true);
      setIsClosing(false);
      const timer = setTimeout(() => setIsAnimatingIn(false), 250);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMinimized]);

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
    if (isMaximized || isMobile) return;
    onFocus();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
    if (isMobile) return;
    e.stopPropagation();
    e.preventDefault();
    onFocus();
    setIsResizing(true);
    setResizeDirection(direction);
  };

  const handleClose = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 150);
  };

  const handleMinimize = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onMinimize();
  };

  const handleMaximize = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onMaximize();
  };

  if (!isOpen || isMinimized) return null;

  const shouldBeMaximized = isMaximized || isMobile;
  const bottomOffset = isMobile
    ? 'calc(48px + env(safe-area-inset-bottom, 0px))'
    : '56px';
  const topOffset = isMobile ? 'env(safe-area-inset-top, 0px)' : 0;

  return (
    <>
      {/* Background overlay when maximized - covers desktop icons (but not the taskbar) */}
      {shouldBeMaximized && (
        <div
          className="fixed inset-x-0 bg-background"
          style={{ zIndex: zIndex, top: topOffset as any, bottom: bottomOffset }}
        />
      )}

      <div
        ref={windowRef}
        className={cn(
          'fixed flex flex-col overflow-hidden',
          'bg-background/98 backdrop-blur-2xl',
          'border border-border/40',
          'transition-all duration-200 ease-out',
          shouldBeMaximized ? 'rounded-none' : 'rounded-xl',
          !shouldBeMaximized && 'shadow-2xl shadow-black/25',
          isHovered && !isDragging && !shouldBeMaximized && 'shadow-[0_30px_70px_-15px_rgba(0,0,0,0.4)] scale-[1.002]',
          isAnimatingIn && 'animate-scale-in',
          isClosing && 'animate-scale-out opacity-0'
        )}
        style={
          shouldBeMaximized
            ? {
                zIndex,
                top: topOffset as any,
                left: 0,
                right: 0,
                bottom: bottomOffset,
              }
            : { zIndex, left: position.x, top: position.y, width: size.width, height: size.height }
        }
        onMouseDown={onFocus}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Title Bar with glassmorphism */}
        <div
          className={cn(
            'flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 shrink-0',
            'bg-gradient-to-b from-muted/90 to-muted/50',
            'border-b border-border/30',
            'backdrop-blur-xl',
            !shouldBeMaximized && 'cursor-move'
          )}
          onMouseDown={(e) => {
            if ((e.target as HTMLElement).closest('button')) return;
            handleTitleBarMouseDown(e);
          }}
        >
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="text-primary transition-all duration-300 hover:scale-110 hover:rotate-3 shrink-0">{icon}</span>
            <span className="text-xs sm:text-sm font-semibold text-foreground/90 select-none truncate tracking-tight">{title}</span>
          </div>
          
          {/* Window Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 relative z-[100] shrink-0">
            {!isMobile && (
              <>
                <button
                  type="button"
                  onClick={handleMinimize}
                  onTouchEnd={handleMinimize}
                  className={cn(
                    'w-9 h-8 sm:w-10 sm:h-8 flex items-center justify-center rounded-lg',
                    'transition-all duration-200 ease-out',
                    'hover:bg-muted active:scale-90',
                    'group touch-manipulation'
                  )}
                >
                  <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>
                <button
                  type="button"
                  onClick={handleMaximize}
                  onTouchEnd={handleMaximize}
                  className={cn(
                    'w-9 h-8 sm:w-10 sm:h-8 flex items-center justify-center rounded-lg',
                    'transition-all duration-200 ease-out',
                    'hover:bg-muted active:scale-90',
                    'group touch-manipulation'
                  )}
                >
                  {isMaximized ? (
                    <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  ) : (
                    <Square className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                  )}
                </button>
              </>
            )}
            <button
              type="button"
              onClick={handleClose}
              onTouchEnd={handleClose}
              className={cn(
                'w-9 h-8 sm:w-10 sm:h-8 flex items-center justify-center rounded-lg',
                'transition-all duration-200 ease-out',
                'hover:bg-destructive active:scale-90',
                'group touch-manipulation',
                isMobile && 'bg-destructive/10'
              )}
            >
              <X className={cn(
                "w-4 h-4 sm:w-4.5 sm:h-4.5 transition-colors",
                isMobile ? "text-destructive" : "text-muted-foreground group-hover:text-destructive-foreground"
              )} />
            </button>
          </div>
        </div>

        {/* Content with subtle inner shadow */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-background relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_2px_8px_rgba(0,0,0,0.04)] z-0" />
          <div className="relative z-10 h-full overflow-y-auto">
            {children}
          </div>
        </div>

        {/* Resize Handles (only when not maximized and not mobile) */}
        {!shouldBeMaximized && !isMobile && (
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
    </>
  );
}
