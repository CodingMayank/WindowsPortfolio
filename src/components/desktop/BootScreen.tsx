import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import profileAnimation from '@/assets/profile-avatar.json';

interface BootScreenProps {
  onComplete: (userName: string) => void;
}

const PHOTO_URL = '/photo/photo1.jpg';

export function BootScreen({ onComplete }: BootScreenProps) {
  const [phase, setPhase] = useState<'loading' | 'login'>('loading');
  const [userName, setUserName] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [photoError, setPhotoError] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setPhase('login'), 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      onComplete(userName.trim());
    }
  };

  const timeStr = currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const dateStr = currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[hsl(220,60%,20%)] via-[hsl(250,50%,25%)] to-[hsl(280,50%,20%)] flex items-center justify-center z-[100] overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px]" />
      </div>

      {phase === 'loading' ? (
        <div className="relative z-10 flex flex-col items-center gap-8 animate-fade-in">
          {/* Windows logo with glow */}
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 blur-xl rounded-lg scale-150" />
            <div className="relative grid grid-cols-2 gap-1.5 w-24 h-24">
              <div className="bg-white rounded-sm shadow-lg" />
              <div className="bg-white rounded-sm shadow-lg" />
              <div className="bg-white rounded-sm shadow-lg" />
              <div className="bg-white rounded-sm shadow-lg" />
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all duration-300',
                    loadingProgress > i * 20 ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'bg-white/30'
                  )}
                />
              ))}
            </div>
            <p className="text-white/60 text-sm">Getting things ready...</p>
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex flex-col items-center animate-fade-in w-full max-w-md px-6">
          {/* Time and Date */}
          <div className="text-center mb-8">
            <p className="text-6xl font-light text-white tracking-tight">{timeStr}</p>
            <p className="text-xl text-white/70 mt-2">{dateStr}</p>
          </div>

          {/* Profile Photo with Lottie Fallback */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-xl opacity-50 scale-110" />
            <div className="relative w-40 h-40 rounded-full overflow-hidden ring-4 ring-white/20 shadow-2xl bg-gradient-to-br from-blue-50 to-purple-50">
              {photoError ? (
                <Lottie 
                  animationData={profileAnimation} 
                  loop={true}
                  className="w-full h-full scale-150"
                />
              ) : (
                <img
                  src={PHOTO_URL}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={() => setPhotoError(true)}
                />
              )}
            </div>
          </div>

          {/* Welcome text */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-light text-white mb-2">Welcome</h1>
            <p className="text-white/60 text-sm">Enter your name to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full max-w-xs">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your name"
              autoFocus
              className={cn(
                'w-full px-5 py-3.5 rounded-full bg-white/10 backdrop-blur-sm',
                'border border-white/20 text-white placeholder:text-white/40',
                'focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/15',
                'transition-all duration-200 text-center text-lg'
              )}
            />

            <button
              type="submit"
              disabled={!userName.trim()}
              className={cn(
                'w-full py-3.5 rounded-full font-medium transition-all duration-200',
                'bg-white text-gray-900',
                'hover:bg-white/90 hover:shadow-lg hover:shadow-white/20',
                'active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed'
              )}
            >
              Sign In
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
