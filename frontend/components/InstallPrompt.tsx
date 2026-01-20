'use client';

import { useState, useEffect } from 'react';
import { usePWA } from '../contexts/PWAContext';
import Button from './Button';

export function InstallPrompt() {
  const { deferredPrompt, isInstalled, installApp } = usePWA();
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Show install prompt after user has been using the app for a while
    const timer = setTimeout(() => {
      if (deferredPrompt && !isInstalled) {
        setShowPrompt(true);
      }
    }, 30000); // Show after 30 seconds

    return () => clearTimeout(timer);
  }, [deferredPrompt, isInstalled]);

  const handleInstall = () => {
    installApp();
    setShowPrompt(false);
  };

  const handleClose = () => {
    setShowPrompt(false);
    // Don't show again in this session
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Don't show if already installed or prompt dismissed
  if (isInstalled || !showPrompt || localStorage.getItem('pwa-prompt-dismissed')) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 left-4 md:left-auto md:w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 animate-fade-in-up">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-white">Install App</h3>
              <p className="text-sm text-slate-300">Get the full experience</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <p className="text-sm text-slate-300 mb-4">
          Install the SES Survey app for faster access, offline capability, and native app experience.
        </p>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleInstall}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
          >
            Install
          </Button>
          <Button 
            onClick={handleClose}
            variant="secondary"
            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Later
          </Button>
        </div>
      </div>
    </div>
  );
}