import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Monitor } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    
    if (isStandalone || isInWebAppiOS) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowButton(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowButton(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Show button after a delay if not installed
    const timer = setTimeout(() => {
      if (!isInstalled && !deferredPrompt) {
        setShowButton(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(timer);
    };
  }, [isInstalled, deferredPrompt]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowButton(false);
      }
    } else {
      setShowInstallPrompt(true);
    }
  };

  const handleDismiss = () => {
    setShowButton(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already installed or user dismissed
  if (isInstalled || localStorage.getItem('pwa-install-dismissed')) {
    return null;
  }

  if (!showButton) {
    return null;
  }

  return (
    <>
      {/* Install Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 max-w-sm animate-slide-up">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Download className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  Install FocusFlow OS
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Get the app experience
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <button
            onClick={handleInstallClick}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2.5 px-4 rounded-xl font-medium text-sm hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Install App</span>
          </button>
          
          <div className="flex items-center justify-center space-x-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Smartphone className="w-3 h-3" />
              <span>Mobile</span>
            </div>
            <div className="flex items-center space-x-1">
              <Monitor className="w-3 h-3" />
              <span>Desktop</span>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Install Instructions Modal */}
      {showInstallPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Install FocusFlow OS
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Add to your home screen for the best experience
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  <Smartphone className="w-4 h-4 mr-2" />
                  On Mobile
                </h4>
                <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>1. Tap the share button in your browser</li>
                  <li>2. Select "Add to Home Screen"</li>
                  <li>3. Tap "Add" to install</li>
                </ol>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  <Monitor className="w-4 h-4 mr-2" />
                  On Desktop
                </h4>
                <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>1. Look for the install icon in your address bar</li>
                  <li>2. Click it and select "Install"</li>
                  <li>3. Or use browser menu → "Install FocusFlow OS"</li>
                </ol>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowInstallPrompt(false)}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Maybe Later
              </button>
              <button
                onClick={() => {
                  setShowInstallPrompt(false);
                  handleDismiss();
                }}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}