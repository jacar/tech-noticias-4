"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LogLevel, LogEntry, addLog as addLogUtil, clearLogs as clearLogsUtil, getLogs } from '@/lib/debug-utils';

interface DebugContextType {
  isDebugMode: boolean;
  logs: LogEntry[];
  toggleDebugMode: () => void;
  addLog: (level: LogLevel, message: string, data?: any) => void;
  clearLogs: () => void;
  showDebugPanel: boolean;
  setShowDebugPanel: (show: boolean) => void;
}

const DebugContext = createContext<DebugContextType | undefined>(undefined);

export const DebugProvider = ({ children }: { children: ReactNode }) => {
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showDebugPanel, setShowDebugPanel] = useState(false);

  // Initialize debug mode from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedDebugMode = localStorage.getItem('debugMode');
      setIsDebugMode(storedDebugMode === 'true');
      
      // Listen for debug log events
      const handleLogEvent = () => {
        setLogs(getLogs());
      };
      
      window.addEventListener('debug-log', handleLogEvent);
      window.addEventListener('debug-logs-cleared', handleLogEvent);
      
      // Initial logs
      setLogs(getLogs());
      
      return () => {
        window.removeEventListener('debug-log', handleLogEvent);
        window.removeEventListener('debug-logs-cleared', handleLogEvent);
      };
    }
  }, []);

  // Toggle debug mode with proper error handling
  const toggleDebugMode = () => {
    const newMode = !isDebugMode;
    setIsDebugMode(newMode);
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('debugMode', String(newMode));
        
        addLogUtil(
          newMode ? LogLevel.SUCCESS : LogLevel.INFO,
          newMode ? 'Debug mode enabled' : 'Debug mode disabled'
        );
      } catch (error) {
        console.error('Failed to save debug mode to localStorage:', error);
      }
    }
  };

  const addLog = (level: LogLevel, message: string, data?: any) => {
    addLogUtil(level, message, data);
  };

  const clearLogs = () => {
    clearLogsUtil();
  };

  return (
    <DebugContext.Provider
      value={{
        isDebugMode,
        logs,
        toggleDebugMode,
        addLog,
        clearLogs,
        showDebugPanel,
        setShowDebugPanel
      }}
    >
      {children}
    </DebugContext.Provider>
  );
};

export const useDebug = (): DebugContextType => {
  const context = useContext(DebugContext);
  if (context === undefined) {
    throw new Error('useDebug must be used within a DebugProvider');
  }
  return context;
};
