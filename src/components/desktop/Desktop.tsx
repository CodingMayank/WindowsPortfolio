import React, { useState } from 'react';
import { User, Briefcase, FileText, Mail, Calculator, StickyNote, Settings, Gamepad2 } from 'lucide-react';
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
import { useWindowManager, WindowId } from '@/hooks/useWindowManager';
import wallpaper from '@/assets/wallpaper-light.jpg';

const desktopIcons = [
  { id: 'about' as WindowId, icon: <User className="w-10 h-10" />, label: 'About Me', position: { x: 20, y: 20 } },
  { id: 'projects' as WindowId, icon: <Briefcase className="w-10 h-10" />, label: 'Projects', position: { x: 20, y: 110 } },
  { id: 'resume' as WindowId, icon: <FileText className="w-10 h-10" />, label: 'Resume', position: { x: 20, y: 200 } },
  { id: 'contact' as WindowId, icon: <Mail className="w-10 h-10" />, label: 'Contact', position: { x: 20, y: 290 } },
  { id: 'calculator' as WindowId, icon: <Calculator className="w-10 h-10" />, label: 'Calculator', position: { x: 20, y: 380 } },
  { id: 'notepad' as WindowId, icon: <StickyNote className="w-10 h-10" />, label: 'Notepad', position: { x: 20, y: 470 } },
  { id: 'game' as WindowId, icon: <Gamepad2 className="w-10 h-10" />, label: 'Memory Game', position: { x: 110, y: 20 } },
];

export function Desktop() {
  const [isBooted, setIsBooted] = useState(false);
  const [userName, setUserName] = useState('');

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
    };
    return configs[id];
  };

  if (!isBooted) {
    return <BootScreen onComplete={handleBootComplete} />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Wallpaper Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${wallpaper})` }}
      />

      {/* Desktop Icons */}
      <div className="relative z-10 inset-0 pb-12">
        {desktopIcons.map((item) => (
          <DesktopIcon
            key={item.id}
            icon={item.icon}
            label={item.label}
            initialPosition={item.position}
            onClick={() => openWindow(item.id)}
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
            isMaximized={windowState.isMaximized}
            zIndex={windowState.zIndex}
            position={windowState.position}
            onClose={() => closeWindow(id)}
            onMinimize={() => minimizeWindow(id)}
            onMaximize={() => toggleMaximize(id)}
            onFocus={() => focusWindow(id)}
            onPositionChange={(pos) => updatePosition(id, pos)}
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
