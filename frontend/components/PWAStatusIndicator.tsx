'use client';

import { usePWA } from '../contexts/PWAContext';

export function PWAStatusIndicator() {
  const { isOnline, isInstalled } = usePWA();

  if (isInstalled) {
    return (
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-full text-green-300 text-xs">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span>App Installed</span>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs ${
        isOnline 
          ? 'bg-green-500/20 border border-green-500/30 text-green-300' 
          : 'bg-red-500/20 border border-red-500/30 text-red-300'
      }`}>
        <div className={`w-2 h-2 rounded-full ${
          isOnline ? 'bg-green-400 animate-pulse' : 'bg-red-400'
        }`}></div>
        <span>{isOnline ? 'Online' : 'Offline'}</span>
      </div>
    </div>
  );
}