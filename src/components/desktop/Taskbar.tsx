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
          'fixed bottom-14 left-2 sm:left-3 w-[calc(100vw-16px)] sm:w-80 max-w-96',
          'bg-background/95 backdrop-blur-2xl rounded-xl',
          'shadow-2xl shadow-black/30 z-[60]',
          'transition-all duration-300 ease-out origin-bottom-left',
          'border border-border/40',
          isStartOpen 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
        )}
      >
        {/* User Section */}
        <div className="p-4 border-b border-border/30 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10 ring-2 ring-primary/20">
            <Lottie 
              animationData={profileAnimation} 
              loop={true}
              className="w-full h-full scale-150"
            />
          </div>
          <div>
            <span className="font-semibold text-foreground text-sm block">{userName}</span>
            <span className="text-[11px] text-muted-foreground">Welcome back</span>
          </div>
        </div>

        {/* Apps Grid */}
        <div className="p-3 grid grid-cols-4 sm:grid-cols-3 gap-1.5">
          {startMenuApps.map((app, index) => (
            <button
              key={app.id}
              onClick={() => handleAppClick(app.id)}
              className={cn(
                'flex flex-col items-center gap-1.5 p-2.5 sm:p-3 rounded-xl',
                'hover:bg-muted active:bg-muted/80',
                'transition-all duration-200 ease-out',
                'active:scale-90',
                'group'
              )}
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <div className={cn(
                'text-primary transition-all duration-200',
                'group-hover:scale-110 group-hover:text-primary/80'
              )}>
                {app.icon}
              </div>
              <span className="text-[10px] sm:text-[11px] text-muted-foreground group-hover:text-foreground text-center leading-tight transition-colors font-medium">
                {app.label}
              </span>
            </button>
          ))}
        </div>

        {/* Power Button */}
        <div className="p-3 border-t border-border/30">
          <button
            onClick={() => window.location.reload()}
            className={cn(
              'flex items-center gap-2.5 w-full px-4 py-2.5 rounded-xl',
              'hover:bg-destructive/10 text-muted-foreground hover:text-destructive',
              'transition-all duration-200 active:scale-[0.98]'
            )}
          >
            <Power className="w-4 h-4" />
            <span className="text-sm font-medium">Restart</span>
          </button>
        </div>
      </div>

      {/* Taskbar */}
      <div className={cn(
        'fixed bottom-0 left-0 right-0 h-12 sm:h-14',
        'bg-background/80 backdrop-blur-2xl z-50',
        'flex items-center justify-between px-1 sm:px-2',
        'border-t border-border/20',
        'pb-[env(safe-area-inset-bottom,0px)]'
      )}>
        {/* Start Button + Open Windows */}
        <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide">
          {/* Start Button */}
          <button
            onClick={() => setIsStartOpen(!isStartOpen)}
            className={cn(
              'flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14',
              'transition-all duration-200 ease-out shrink-0 rounded-lg',
              'hover:bg-muted/60 active:scale-90',
              isStartOpen && 'bg-muted/80'
            )}
          >
            <div className="grid grid-cols-2 gap-0.5 w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:rotate-45">
              <div className="bg-primary rounded-sm transition-colors" />
              <div className="bg-primary rounded-sm transition-colors" />
              <div className="bg-primary rounded-sm transition-colors" />
              <div className="bg-primary rounded-sm transition-colors" />
            </div>
          </button>

          {/* Open Windows */}
          {openWindows.map((window) => (
            <button
              key={window.id}
              onClick={() => onWindowClick(window.id)}
              className={cn(
                'flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg mx-0.5',
                'transition-all duration-200 ease-out shrink-0',
                'hover:bg-muted/60 active:scale-95',
                window.isMinimized
                  ? 'text-muted-foreground bg-transparent'
                  : 'bg-muted/50 border-b-2 border-primary shadow-sm'
              )}
            >
              <span className="text-primary transition-transform duration-200 hover:scale-110">
                {windowIcons[window.id]?.icon}
              </span>
              <span className="text-xs font-medium text-foreground hidden sm:inline max-w-24 truncate">
                {windowIcons[window.id]?.label}
              </span>
            </button>
          ))}
        </div>

        {/* System Tray */}
        <div className="flex items-center shrink-0">
          <button className="p-2.5 hover:bg-muted/60 transition-all duration-200 active:scale-95 rounded-lg hidden sm:block">
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className={cn(
            'flex flex-col items-end text-[10px] sm:text-[11px] text-muted-foreground',
            'px-3 sm:px-4 py-1.5 hover:bg-muted/40 rounded-lg transition-colors cursor-default'
          )}>
            <span className="font-medium">{timeStr}</span>
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
