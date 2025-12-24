import { useState, useCallback } from 'react';

export type WindowId = 'about' | 'projects' | 'resume' | 'contact' | 'calculator' | 'notepad' | 'settings' | 'game';

export interface WindowState {
  id: WindowId;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
}

const initialWindows: Record<WindowId, WindowState> = {
  about: { id: 'about', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, position: { x: 100, y: 50 } },
  projects: { id: 'projects', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, position: { x: 150, y: 80 } },
  resume: { id: 'resume', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, position: { x: 200, y: 110 } },
  contact: { id: 'contact', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, position: { x: 250, y: 140 } },
  calculator: { id: 'calculator', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, position: { x: 300, y: 100 } },
  notepad: { id: 'notepad', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, position: { x: 350, y: 120 } },
  settings: { id: 'settings', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, position: { x: 180, y: 90 } },
  game: { id: 'game', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0, position: { x: 280, y: 80 } },
};

export function useWindowManager() {
  const [windows, setWindows] = useState<Record<WindowId, WindowState>>(initialWindows);
  const [topZIndex, setTopZIndex] = useState(1);

  const openWindow = useCallback((id: WindowId) => {
    setTopZIndex((prev) => prev + 1);
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isOpen: true, isMinimized: false, zIndex: topZIndex + 1 },
    }));
  }, [topZIndex]);

  const closeWindow = useCallback((id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false, isMinimized: false, isMaximized: false },
    }));
  }, []);

  const minimizeWindow = useCallback((id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: true },
    }));
  }, []);

  const toggleMaximize = useCallback((id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMaximized: !prev[id].isMaximized },
    }));
  }, []);

  const focusWindow = useCallback((id: WindowId) => {
    setTopZIndex((prev) => prev + 1);
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: false, zIndex: topZIndex + 1 },
    }));
  }, [topZIndex]);

  const updatePosition = useCallback((id: WindowId, position: { x: number; y: number }) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], position },
    }));
  }, []);

  const getOpenWindows = useCallback(() => {
    return Object.values(windows).filter((w) => w.isOpen);
  }, [windows]);

  return {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    toggleMaximize,
    focusWindow,
    updatePosition,
    getOpenWindows,
  };
}
