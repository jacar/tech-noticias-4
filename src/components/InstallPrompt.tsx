"use client"

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export const InstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      
      try {
        // Check if the user has already dismissed the prompt
        const promptDismissed = localStorage.getItem('pwaPromptDismissed');
        
        if (!promptDismissed) {
          // Show the install prompt
          setShowPrompt(true);
        }
      } catch (error) {
        console.error("Error checking prompt dismissed state:", error);
      }
    };

    // Check if the user has already installed the app
    const isAppInstalled = () => {
      try {
        // Check if the app is in standalone mode or if it's installed
        return window.matchMedia('(display-mode: standalone)').matches || 
              // Safari on iOS specific property
              (window.navigator as any).standalone === true;
      } catch (error) {
        console.error("Error checking if app is installed:", error);
        return false;
      }
    };

    // Add event listener regardless, and check inside the handler
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const choiceResult = await deferredPrompt.userChoice;
    
    // Reset the deferred prompt variable
    setDeferredPrompt(null);
    setShowPrompt(false);
    
    // Track the outcome
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Store in localStorage that the user dismissed the prompt
    localStorage.setItem('pwaPromptDismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-lg bg-white p-4 shadow-lg dark:bg-slate-800"
      >
        <div className="flex items-start">
          <div className="mr-4 flex-shrink-0">
            <Image
              src="https://www.webcincodev.com/blog/wp-content/uploads/2025/04/ico.png"
              alt="webcincodevNew"
              width={48}
              height={48}
              className="rounded-lg"
            />
          </div>
          <div className="flex-1">
            <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
              Instalar webcincodevNew
            </h3>
            <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
              Instala nuestra app para acceder más rápido y disfrutar de una mejor experiencia.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={handleDismiss}
                className="rounded-md px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Ahora no
              </button>
              <button
                onClick={handleInstallClick}
                className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Instalar
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="ml-2 flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-slate-700 dark:hover:text-gray-300"
          >
            <X size={16} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
