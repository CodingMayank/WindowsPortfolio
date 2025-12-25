import React, { useState, useEffect } from 'react';
import { User, Briefcase, FileText, Mail, Calculator, StickyNote, Settings, Power, ChevronUp, Gamepad2, Joystick } from 'lucide-react';
import Lottie from 'lottie-react';
import { cn } from '@/lib/utils';
import { WindowState, WindowId } from '@/hooks/useWindowManager';
import profileAnimation from '@/assets/profile-avatar.json';

interface TaskbarProps {
  openWindows: WindowState[];
  onWindowClick: (id: WindowId) => void;
  onOpenApp: (id: WindowId) => void;
  userName: string;
}

const windowIcons: Record<WindowId, { icon: React.ReactNode; label: string }> = {
  about: { icon: <User className="w-4 h-4" />, label: 'About Me' },
  projects: { icon: <Briefcase className="w-4 h-4" />, label: 'Projects' },
  resume: { icon: <FileText className="w-4 h-4" />, label: 'Resume' },
  contact: { icon: <Mail className="w-4 h-4" />, label: 'Contact' },
  calculator: { icon: <Calculator className="w-4 h-4" />, label: 'Calculator' },
  notepad: { icon: <StickyNote className="w-4 h-4" />, label: 'Notepad' },
  settings: { icon: <Settings className="w-4 h-4" />, label: 'Settings' },
  game: { icon: <Gamepad2 className="w-4 h-4" />, label: 'Memory' },
  snake: { icon: <Joystick className="w-4 h-4" />, label: 'Snake' },
};

const startMenuApps = [
  { id: 'about' as WindowId, icon: <User className="w-5 h-5" />, label: 'About Me' },
  { id: 'projects' as WindowId, icon: <Briefcase className="w-5 h-5" />, label: 'Projects' },
  { id: 'resume' as WindowId, icon: <FileText className="w-5 h-5" />, label: 'Resume' },
  { id: 'contact' as WindowId, icon: <Mail className="w-5 h-5" />, label: 'Contact' },
  { id: 'calculator' as WindowId, icon: <Calculator className="w-5 h-5" />, label: 'Calculator' },
  { id: 'notepad' as WindowId, icon: <StickyNote className="w-5 h-5" />, label: 'Notepad' },
  { id: 'game' as WindowId, icon: <Gamepad2 className="w-5 h-5" />, label: 'Memory' },
  { id: 'snake' as WindowId, icon: <Joystick className="w-5 h-5" />, label: 'Snake' },
  { id: 'settings' as WindowId, icon: <Settings className="w-5 h-5" />, label: 'Settings' },
];

export function Taskbar({ openWindows, onWindowClick, onOpenApp, userName }: TaskbarProps) {
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeStr = time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const dateStr = time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const handleAppClick = (id: WindowId) => {
    onOpenApp(id);
    setIsStartOpen(false);
  };

  return (
    <>
      {/* Start Menu */}
      <div
        className={cn(
          'fixed bottom-12 left-1 sm:left-2 w-[calc(100vw-8px)] sm:w-72 max-w-80 bg-background/95 backdrop-blur-xl rounded-lg shadow-2xl z-[60]',
          'transition-all duration-200 ease-out origin-bottom-left border border-border/50',
          isStartOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
        )}
      >
        {/* User Section */}
        <div className="p-3 border-b border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10">
            <Lottie 
              animationData={profileAnimation} 
              loop={true}
              className="w-full h-full scale-150"
            />
          </div>
          <span className="font-medium text-foreground text-sm">{userName}</span>
        </div>

        {/* Apps Grid */}
        <div className="p-2 sm:p-3 grid grid-cols-4 sm:grid-cols-3 gap-1">
          {startMenuApps.map((app) => (
            <button
              key={app.id}
              onClick={() => handleAppClick(app.id)}
              className={cn(
                'flex flex-col items-center gap-1 sm:gap-1.5 p-2 sm:p-2.5 rounded-md',
                'hover:bg-muted active:bg-muted/80 transition-all duration-150 active:scale-95',
                'group'
              )}
            >
              <div className="text-primary transition-transform duration-150 group-hover:scale-110">
                {app.icon}
              </div>
              <span className="text-[9px] sm:text-[10px] text-muted-foreground group-hover:text-foreground text-center leading-tight transition-colors">{app.label}</span>
            </button>
          ))}
        </div>

        {/* Power Button */}
        <div className="p-2 border-t border-border">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all duration-150 active:scale-[0.98]"
          >
            <Power className="w-4 h-4" />
            <span className="text-sm">Restart</span>
          </button>
        </div>
      </div>

      {/* Taskbar */}
      <div className="fixed bottom-0 left-0 right-0 h-12 bg-background/80 backdrop-blur-xl z-50 flex items-center justify-between px-1 border-t border-border/30 safe-area-pb">
        {/* Start Button + Open Windows */}
        <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide">
          {/* Start Button */}
          <button
            onClick={() => setIsStartOpen(!isStartOpen)}
            className={cn(
              'flex items-center justify-center w-11 h-11 transition-all duration-150 shrink-0',
              'hover:bg-muted active:scale-95',
              isStartOpen && 'bg-muted'
            )}
          >
            <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
              <div className="bg-primary rounded-[1px]" />
              <div className="bg-primary rounded-[1px]" />
              <div className="bg-primary rounded-[1px]" />
              <div className="bg-primary rounded-[1px]" />
            </div>
          </button>

          {/* Open Windows */}
          {openWindows.map((window) => (
            <button
              key={window.id}
              onClick={() => onWindowClick(window.id)}
              className={cn(
                'flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 transition-all duration-150 shrink-0',
                'hover:bg-muted active:scale-[0.98]',
                window.isMinimized
                  ? 'text-muted-foreground'
                  : 'bg-muted border-b-2 border-primary'
              )}
            >
              <span className="text-primary">{windowIcons[window.id]?.icon}</span>
              <span className="text-xs font-medium text-foreground hidden sm:inline max-w-20 truncate">{windowIcons[window.id]?.label}</span>
            </button>
          ))}
        </div>

        {/* System Tray */}
        <div className="flex items-center shrink-0">
          <button className="p-2 hover:bg-muted transition-all duration-150 active:scale-95 hidden sm:block">
            <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <div className="flex flex-col items-end text-[10px] sm:text-[11px] text-muted-foreground px-2 sm:px-3 py-1 hover:bg-muted transition-colors cursor-default">
            <span>{timeStr}</span>
            <span className="hidden sm:inline">{dateStr}</span>
          </div>
        </div>
      </div>

      {/* Click outside to close start menu */}
      {isStartOpen && (
        <div
          className="fixed inset-0 z-[55]"
          onClick={() => setIsStartOpen(false)}
        />
      )}
    </>
  );
}
