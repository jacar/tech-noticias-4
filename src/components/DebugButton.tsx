"use client"

import { useState, useEffect } from "react";
import { Bug } from "lucide-react";
import { motion } from "framer-motion";
import { DebugPanel } from "./DebugPanel";

interface DebugButtonProps {
  initialLogs?: string[];
  onRunTest?: (testName: string) => void;
}

export const DebugButton = ({ initialLogs = [], onRunTest }: DebugButtonProps) => {
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [logs, setLogs] = useState<string[]>(initialLogs);
  
  // Initialize debug mode from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedDebugMode = localStorage.getItem('debugMode');
      if (storedDebugMode === 'true') {
        setIsDebugMode(true);
      }
      
      // Listen for custom debug log events
      const handleDebugLog = (event: CustomEvent) => {
        if (event.detail && event.detail.message) {
          const timestamp = new Date().toISOString();
          const level = event.detail.level || 'INFO';
          const message = `[${timestamp}] [${level}] ${event.detail.message}`;
          setLogs(prev => [...prev, message]);
        }
      };
      
      window.addEventListener('debug-log' as any, handleDebugLog as EventListener);
      
      return () => {
        window.removeEventListener('debug-log' as any, handleDebugLog as EventListener);
      };
    }
  }, []);
  
  // Handle running tests
  const handleRunTest = (testName: string) => {
    if (onRunTest) {
      onRunTest(testName);
    } else {
      // Default test handler
      const timestamp = new Date().toISOString();
      setLogs(prev => [...prev, `[${timestamp}] Running test: ${testName}`]);
      
      // Simulate test running
      setTimeout(() => {
        setLogs(prev => [...prev, `[${new Date().toISOString()}] Test ${testName} completed`]);
      }, 1000);
    }
  };
  
  // Clear logs
  const clearLogs = () => {
    setLogs([]);
  };
  
  if (!isDebugMode) return null;
  
  return (
    <>
      <motion.button
        onClick={() => setShowPanel(!showPanel)}
        className="fixed bottom-4 right-4 z-40 flex items-center justify-center rounded-full bg-purple-600 p-3 text-white shadow-lg hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        title="Abrir panel de depuración"
      >
        <Bug size={24} />
      </motion.button>
      
      <DebugPanel 
        isOpen={showPanel}
        onClose={() => setShowPanel(false)}
        logs={logs}
        onClearLogs={clearLogs}
        onRunTest={handleRunTest}
      />
    </>
  );
};
