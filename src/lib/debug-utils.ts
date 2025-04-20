"use client"

import { useState, useEffect } from 'react';

// Debug levels
export enum LogLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success',
  DEBUG = 'debug'
}

// Interface for log entry
export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  data?: any;
}

// Maximum number of logs to keep in memory
const MAX_LOGS = 1000;

// Global logs array
let logs: LogEntry[] = [];

// Add a log entry
export function addLog(level: LogLevel, message: string, data?: any): void {
  const logEntry: LogEntry = {
    timestamp: new Date(),
    level,
    message,
    data
  };
  
  logs = [logEntry, ...logs].slice(0, MAX_LOGS);
  
  // Also log to console with appropriate styling
  const styles = {
    [LogLevel.INFO]: 'color: #3B82F6',
    [LogLevel.WARNING]: 'color: #F59E0B',
    [LogLevel.ERROR]: 'color: #EF4444',
    [LogLevel.SUCCESS]: 'color: #10B981',
    [LogLevel.DEBUG]: 'color: #8B5CF6'
  };
  
  console.log(
    `%c[${level.toUpperCase()}] ${logEntry.timestamp.toISOString()}`,
    styles[level],
    message,
    data || ''
  );
  
  // Dispatch custom event for log listeners
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('debug-log', { detail: logEntry });
    window.dispatchEvent(event);
  }
}

// Convenience methods for different log levels
export const logInfo = (message: string, data?: any) => addLog(LogLevel.INFO, message, data);
export const logWarning = (message: string, data?: any) => addLog(LogLevel.WARNING, message, data);
export const logError = (message: string, data?: any) => addLog(LogLevel.ERROR, message, data);
export const logSuccess = (message: string, data?: any) => addLog(LogLevel.SUCCESS, message, data);
export const logDebug = (message: string, data?: any) => addLog(LogLevel.DEBUG, message, data);

// Get all logs
export function getLogs(): LogEntry[] {
  return logs;
}

// Clear all logs
export function clearLogs(): void {
  logs = [];
  
  // Dispatch custom event for log listeners
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('debug-logs-cleared');
    window.dispatchEvent(event);
  }
}

// Hook to use logs in components
export function useLogs() {
  const [localLogs, setLocalLogs] = useState<LogEntry[]>(logs);
  
  useEffect(() => {
    const handleNewLog = () => {
      setLocalLogs([...logs]);
    };
    
    const handleClearLogs = () => {
      setLocalLogs([]);
    };
    
    window.addEventListener('debug-log', handleNewLog);
    window.addEventListener('debug-logs-cleared', handleClearLogs);
    
    return () => {
      window.removeEventListener('debug-log', handleNewLog);
      window.removeEventListener('debug-logs-cleared', handleClearLogs);
    };
  }, []);
  
  return {
    logs: localLogs,
    addLog,
    clearLogs,
    logInfo,
    logWarning,
    logError,
    logSuccess,
    logDebug
  };
}

// Performance monitoring
export function measurePerformance(label: string, callback: () => void): void {
  if (typeof window !== 'undefined' && window.performance) {
    const start = performance.now();
    callback();
    const end = performance.now();
    const duration = end - start;
    logInfo(`Performance [${label}]: ${duration.toFixed(2)}ms`);
  } else {
    callback();
  }
}

// Network request monitoring
export async function monitorFetch(url: string, options?: RequestInit): Promise<Response> {
  const startTime = performance.now();
  let response: Response;
  
  try {
    response = await fetch(url, options);
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    if (response.ok) {
      logSuccess(`Fetch success: ${url} (${duration.toFixed(2)}ms)`, {
        status: response.status,
        duration
      });
    } else {
      logWarning(`Fetch failed: ${url} (${duration.toFixed(2)}ms)`, {
        status: response.status,
        statusText: response.statusText,
        duration
      });
    }
    
    return response;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    logError(`Fetch error: ${url} (${duration.toFixed(2)}ms)`, {
      error: error instanceof Error ? error.message : String(error),
      duration
    });
    
    throw error;
  }
}

// Memory usage monitoring
export function getMemoryUsage(): number | null {
  if (typeof window !== 'undefined' && 
      'performance' in window && 
      'memory' in (window.performance as any)) {
    return (window.performance as any).memory.usedJSHeapSize / 1048576; // Convert to MB
  }
  return null;
}

// Debug mode state management
let isDebugMode = false;

export function enableDebugMode(): void {
  isDebugMode = true;
  if (typeof window !== 'undefined') {
    localStorage.setItem('debugMode', 'true');
    logInfo('Debug mode enabled');
  }
}

export function disableDebugMode(): void {
  isDebugMode = false;
  if (typeof window !== 'undefined') {
    localStorage.setItem('debugMode', 'false');
    logInfo('Debug mode disabled');
  }
}

export function isDebugModeEnabled(): boolean {
  if (typeof window !== 'undefined') {
    const storedValue = localStorage.getItem('debugMode');
    if (storedValue !== null) {
      isDebugMode = storedValue === 'true';
    }
  }
  return isDebugMode;
}

// Initialize debug mode from localStorage
let initialized = false;

// This will run only on the client side
const initializeDebugMode = () => {
  if (typeof window !== 'undefined' && !initialized) {
    try {
      const storedDebugMode = localStorage.getItem('debugMode');
      if (storedDebugMode === 'true') {
        isDebugMode = true;
      }
      initialized = true;
    } catch (error) {
      console.error('Failed to initialize debug mode:', error);
    }
  }
};

// Call initialization function
initializeDebugMode();
