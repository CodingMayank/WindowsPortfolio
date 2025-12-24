import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import { Monitor, Volume2, Wifi, Battery, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import profileAnimation from '@/assets/profile-avatar.json';

interface SettingsWindowProps {
  userName: string;
}

export function SettingsWindow({ userName }: SettingsWindowProps) {
  const [brightness, setBrightness] = useState(() => {
    const saved = localStorage.getItem('settings-brightness');
    return saved ? parseInt(saved) : 100;
  });
  
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('settings-volume');
    return saved ? parseInt(saved) : 75;
  });
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('settings-darkmode');
    return saved ? saved === 'true' : false;
  });

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const getBattery = async () => {
      try {
        const battery = await (navigator as any).getBattery?.();
        if (battery) {
          setBatteryLevel(Math.round(battery.level * 100));
          battery.addEventListener('levelchange', () => {
            setBatteryLevel(Math.round(battery.level * 100));
          });
        }
      } catch {
        setBatteryLevel(null);
      }
    };
    getBattery();
  }, []);

  useEffect(() => {
    localStorage.setItem('settings-brightness', brightness.toString());
    document.documentElement.style.filter = `brightness(${brightness / 100})`;
  }, [brightness]);

  useEffect(() => {
    localStorage.setItem('settings-volume', volume.toString());
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('settings-darkmode', isDarkMode.toString());
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="space-y-6">
      {/* User Profile */}
      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10">
          <Lottie 
            animationData={profileAnimation} 
            loop={true}
            className="w-full h-full scale-150"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">{userName}</h3>
          <p className="text-sm text-muted-foreground">Local Account</p>
        </div>
      </div>

      {/* Display Settings */}
      <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-3">
        <div className="flex items-center gap-3">
          <Monitor className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-foreground">Display Brightness</span>
          <span className="ml-auto text-xs text-muted-foreground">{brightness}%</span>
        </div>
        <Slider
          value={[brightness]}
          onValueChange={(value) => setBrightness(value[0])}
          min={30}
          max={100}
          step={5}
          className="w-full"
        />
      </div>

      {/* Sound Settings */}
      <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-3">
        <div className="flex items-center gap-3">
          <Volume2 className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-foreground">System Volume</span>
          <span className="ml-auto text-xs text-muted-foreground">{volume}%</span>
        </div>
        <Slider
          value={[volume]}
          onValueChange={(value) => setVolume(value[0])}
          min={0}
          max={100}
          step={5}
          className="w-full"
        />
      </div>

      {/* Network & Battery */}
      <div className="grid grid-cols-2 gap-3">
        <div className={cn(
          'flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border'
        )}>
          <Wifi className={cn("w-5 h-5", isOnline ? "text-green-500" : "text-destructive")} />
          <div>
            <p className="text-sm font-medium text-foreground">Network</p>
            <p className="text-xs text-muted-foreground">{isOnline ? 'Connected' : 'Offline'}</p>
          </div>
        </div>
        <div className={cn(
          'flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border'
        )}>
          <Battery className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">Battery</p>
            <p className="text-xs text-muted-foreground">
              {batteryLevel !== null ? `${batteryLevel}%` : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
        <div className="flex items-center gap-3">
          {isDarkMode ? (
            <Moon className="w-5 h-5 text-primary" />
          ) : (
            <Sun className="w-5 h-5 text-primary" />
          )}
          <span className="text-sm font-medium text-foreground">Dark Mode</span>
        </div>
        <Switch
          checked={isDarkMode}
          onCheckedChange={setIsDarkMode}
        />
      </div>
    </div>
  );
}
