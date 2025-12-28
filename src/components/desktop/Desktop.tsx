import React, { useState } from 'react';
import { User, Briefcase, FileText, Mail, Calculator, StickyNote, Settings, Gamepad2, Joystick } from 'lucide-react';
import { DesktopIcon } from './DesktopIcon';
import { Window } from './Window';
import { Taskbar } from './Taskbar';
import { BootScreen } from './BootScreen';
import { AboutWindow } from '@/components/windows/AboutWindow';
import { ProjectsWindow } from '@/components/windows/ProjectsWindow';
import { ResumeWindow } from '@/components/windows/ResumeWindow';
import { ContactWindow } from '@/components/windows/ContactWindow';
import { CalculatorWindow } from '@/components/windows/CalculatorWindow';
import { NotepadWindow } from '@/components/windows/NotepadWindow';
import { SettingsWindow } from '@/components/windows/SettingsWindow';
import { MemoryGame } from '@/components/windows/MemoryGameWindow';
import { SnakeGame } from '@/components/windows/SnakeGameWindow';
import { useWindowManager, WindowId } from '@/hooks/useWindowManager';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import wallpaper from '@/assets/wallpaper-light.jpg';

const desktopIcons = [
  { id: 'about' as WindowId, icon: <User className="w-5 h-5 sm:w-6 sm:h-6" />, label: 'About Me', position: { x: 20, y: 20 } },
  { id: 'projects' as WindowId, icon: <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />, label: 'Projects', position: { x: 20, y: 95 } },
  { id: 'resume' as WindowId, icon: <FileText className="w-5 h-5 sm:w-6 sm:h-6" />, label: 'Resume', position: { x: 20, y: 170 } },
  { id: 'contact' as WindowId, icon: <Mail className="w-5 h-5 sm:w-6 sm:h-6" />, label: 'Contact', position: { x: 20, y: 245 } },
  { id: 'calculator' as WindowId, icon: <Calculator className="w-5 h-5 sm:w-6 sm:h-6" />, label: 'Calculator', position: { x: 20, y: 320 } },
  { id: 'notepad' as WindowId, icon: <StickyNote className="w-5 h-5 sm:w-6 sm:h-6" />, label: 'Notepad', position: { x: 20, y: 395 } },
  { id: 'game' as WindowId, icon: <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6" />, label: 'Memory', position: { x: 95, y: 20 } },
  { id: 'snake' as WindowId, icon: <Joystick className="w-5 h-5 sm:w-6 sm:h-6" />, label: 'Snake', position: { x: 95, y: 95 } },
];

export function Desktop() {
  const [isBooted, setIsBooted] = useState(false);
  const [userName, setUserName] = useState('');
  const isMobile = useIsMobile();

  const {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    toggleMaximize,
    focusWindow,
    updatePosition,
    getOpenWindows,
  } = useWindowManager();

  const handleBootComplete = (name: string) => {
    setUserName(name);
    setIsBooted(true);
  };

  const getWindowConfig = (id: WindowId): { title: string; icon: React.ReactNode; content: React.ReactNode } => {
    const configs: Record<WindowId, { title: string; icon: React.ReactNode; content: React.ReactNode }> = {
      about: { title: 'About Me', icon: <User className="w-4 h-4" />, content: <AboutWindow /> },
      projects: { title: 'Projects', icon: <Briefcase className="w-4 h-4" />, content: <ProjectsWindow /> },
      resume: { title: 'Resume', icon: <FileText className="w-4 h-4" />, content: <ResumeWindow /> },
      contact: { title: 'Contact', icon: <Mail className="w-4 h-4" />, content: <ContactWindow /> },
      calculator: { title: 'Calculator', icon: <Calculator className="w-4 h-4" />, content: <CalculatorWindow /> },
      notepad: { title: 'Notepad', icon: <StickyNote className="w-4 h-4" />, content: <NotepadWindow /> },
      settings: { title: 'Settings', icon: <Settings className="w-4 h-4" />, content: <SettingsWindow userName={userName} /> },
      game: { title: 'Memory Game', icon: <Gamepad2 className="w-4 h-4" />, content: <MemoryGame onClose={() => closeWindow('game')} /> },
      snake: { title: 'Snake Game', icon: <Joystick className="w-4 h-4" />, content: <SnakeGame onClose={() => closeWindow('snake')} /> },
    };
    return configs[id];
  };

  if (!isBooted) {
    return <BootScreen onComplete={handleBootComplete} />;
  }

  return (
    <div className="min-h-screen min-h-[100dvh] relative overflow-hidden select-none">
      {/* Wallpaper Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[2000ms]"
        style={{ backgroundImage: `url(${wallpaper})` }}
      />
      
      {/* Subtle wallpaper overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20" />

      {/* Desktop Icons - Grid layout on mobile */}
      <div className={cn(
        "relative z-0 pb-16 sm:pb-14",
        isMobile 
          ? "grid grid-cols-4 gap-2 p-3 pt-[env(safe-area-inset-top,12px)]" 
          : "p-4"
      )}>
        {desktopIcons.map((item, index) => (
          <DesktopIcon
            key={item.id}
            icon={item.icon}
            label={item.label}
            initialPosition={item.position}
            onClick={() => openWindow(item.id)}
            isMobile={isMobile}
            animationDelay={index * 50}
          />
        ))}
      </div>

      {/* Windows */}
      {(Object.keys(windows) as WindowId[]).map((id) => {
        const windowState = windows[id];
        const config = getWindowConfig(id);
        return (
          <Window
            key={id}
            title={config.title}
            icon={config.icon}
            isOpen={windowState.isOpen}
            isMinimized={windowState.isMinimized}
            isMaximized={windowState.isMaximized || isMobile}
            zIndex={windowState.zIndex}
            position={windowState.position}
            onClose={() => closeWindow(id)}
            onMinimize={() => minimizeWindow(id)}
            onMaximize={() => toggleMaximize(id)}
            onFocus={() => focusWindow(id)}
            onPositionChange={(pos) => updatePosition(id, pos)}
            isMobile={isMobile}
          >
            {config.content}
          </Window>
        );
      })}

      {/* Taskbar */}
      <Taskbar
        openWindows={getOpenWindows()}
        onWindowClick={focusWindow}
        onOpenApp={openWindow}
        userName={userName}
      />
    </div>
  );
}
