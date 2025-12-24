import React, { useState, useEffect } from 'react';
import { User, Briefcase, FileText, Mail, Calculator, StickyNote, Settings, Power, ChevronUp, Gamepad2 } from 'lucide-react';
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
  game: { icon: <Gamepad2 className="w-4 h-4" />, label: 'Memory Game' },
};

const startMenuApps = [
  { id: 'about' as WindowId, icon: <User className="w-5 h-5" />, label: 'About Me' },
  { id: 'projects' as WindowId, icon: <Briefcase className="w-5 h-5" />, label: 'Projects' },
  { id: 'resume' as WindowId, icon: <FileText className="w-5 h-5" />, label: 'Resume' },
  { id: 'contact' as WindowId, icon: <Mail className="w-5 h-5" />, label: 'Contact' },
  { id: 'calculator' as WindowId, icon: <Calculator className="w-5 h-5" />, label: 'Calculator' },
  { id: 'notepad' as WindowId, icon: <StickyNote className="w-5 h-5" />, label: 'Notepad' },
  { id: 'game' as WindowId, icon: <Gamepad2 className="w-5 h-5" />, label: 'Memory Game' },
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
  const dateStr = time.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const handleAppClick = (id: WindowId) => {
    onOpenApp(id);
    setIsStartOpen(false);
  };

  return (
    <>
      {/* Start Menu */}
      <div
        className={cn(
          'fixed bottom-12 left-2 w-72 bg-white/95 backdrop-blur-xl rounded-lg shadow-2xl z-[60]',
          'transition-all duration-200 ease-out origin-bottom-left',
          isStartOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
        )}
      >
        {/* User Section */}
        <div className="p-3 border-b border-gray-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-50">
            <Lottie 
              animationData={profileAnimation} 
              loop={true}
              className="w-full h-full scale-150"
            />
          </div>
          <span className="font-medium text-gray-900 text-sm">{userName}</span>
        </div>

        {/* Apps Grid */}
        <div className="p-3 grid grid-cols-3 gap-1">
          {startMenuApps.map((app) => (
            <button
              key={app.id}
              onClick={() => handleAppClick(app.id)}
              className={cn(
                'flex flex-col items-center gap-1.5 p-2.5 rounded-md',
                'hover:bg-gray-100 active:bg-gray-200 transition-colors'
              )}
            >
              <div className="text-[hsl(207,100%,32%)]">
                {app.icon}
              </div>
              <span className="text-[10px] text-gray-700 text-center leading-tight">{app.label}</span>
            </button>
          ))}
        </div>

        {/* Power Button */}
        <div className="p-2 border-t border-gray-200">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-md hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors"
          >
            <Power className="w-4 h-4" />
            <span className="text-sm">Restart</span>
          </button>
        </div>
      </div>

      {/* Taskbar */}
      <div className="fixed bottom-0 left-0 right-0 h-11 bg-white/80 backdrop-blur-xl z-50 flex items-center justify-between px-1">
        {/* Start Button + Open Windows */}
        <div className="flex items-center gap-0.5">
          {/* Start Button */}
          <button
            onClick={() => setIsStartOpen(!isStartOpen)}
            className={cn(
              'flex items-center justify-center w-11 h-11 transition-colors',
              'hover:bg-gray-100',
              isStartOpen && 'bg-gray-100'
            )}
          >
            <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
              <div className="bg-[hsl(207,100%,32%)] rounded-[1px]" />
              <div className="bg-[hsl(207,100%,32%)] rounded-[1px]" />
              <div className="bg-[hsl(207,100%,32%)] rounded-[1px]" />
              <div className="bg-[hsl(207,100%,32%)] rounded-[1px]" />
            </div>
          </button>

          {/* Open Windows */}
          {openWindows.map((window) => (
            <button
              key={window.id}
              onClick={() => onWindowClick(window.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 transition-colors',
                'hover:bg-gray-100',
                window.isMinimized
                  ? 'text-gray-500'
                  : 'bg-gray-100 border-b-2 border-[hsl(207,100%,32%)]'
              )}
            >
              <span className="text-[hsl(207,100%,32%)]">{windowIcons[window.id]?.icon}</span>
              <span className="text-xs font-medium text-gray-700 hidden sm:inline">{windowIcons[window.id]?.label}</span>
            </button>
          ))}
        </div>

        {/* System Tray */}
        <div className="flex items-center">
          <button className="p-2 hover:bg-gray-100 transition-colors">
            <ChevronUp className="w-3.5 h-3.5 text-gray-600" />
          </button>
          <div className="flex flex-col items-end text-[11px] text-gray-600 px-3 py-1 hover:bg-gray-100 transition-colors cursor-default">
            <span>{timeStr}</span>
            <span>{dateStr}</span>
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
