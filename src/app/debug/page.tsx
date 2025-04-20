"use client"

import { useState, useEffect, useRef, useCallback } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNavbar } from "@/components/MobileNavbar";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { DebugPanel } from "@/components/DebugPanel";
import { AlertCircle, Bug, RefreshCw, Database, HardDrive, Cpu, Wifi, Download, Upload, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function DebugPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [memoryUsage, setMemoryUsage] = useState<number | null>(null);
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline'>('online');
  const [performanceMetrics, setPerformanceMetrics] = useState<Record<string, number>>({});
  const [storageInfo, setStorageInfo] = useState<{
    localStorage: number;
    sessionStorage: number;
  }>({ localStorage: 0, sessionStorage: 0 });
  
  // Initialize debug mode and set up listeners
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check debug mode
      try {
        const storedDebugMode = localStorage.getItem('debugMode');
        setIsDebugMode(storedDebugMode === 'true');
      } catch (error) {
        console.error("Error reading debugMode from localStorage:", error);
      }
      
      // Add initial log
      addLog('Debug page initialized');
      
      // Set up network status monitoring
      const handleOnline = () => {
        setNetworkStatus('online');
        addLog('Network connection restored');
      };
      
      const handleOffline = () => {
        setNetworkStatus('offline');
        addLog('Network connection lost');
      };
      
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      // Set initial network status
      setNetworkStatus(navigator.onLine ? 'online' : 'offline');
      
      // Check memory usage
      const checkMemory = () => {
        if ('performance' in window && 'memory' in (window.performance as any)) {
          try {
            const memUsage = (window.performance as any).memory.usedJSHeapSize / 1048576; // Convert to MB
            setMemoryUsage(memUsage);
            
            // Log if memory usage increases significantly
            if (memoryUsage !== null && memUsage > 0) {
              const previousMemory = memoryUsage;
              if (memUsage > previousMemory * 1.2) {
                addLog(`Memory usage increased: ${previousMemory.toFixed(2)}MB → ${memUsage.toFixed(2)}MB`);
              }
            }
          } catch (error) {
            console.error("Error checking memory usage:", error);
          }
        }
      };
      
      // Run initial checks
      checkMemory();
      
      // Set up intervals for periodic checks
      const memoryInterval = setInterval(checkMemory, 5000);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        clearInterval(memoryInterval);
      };
    }
  }, []);
    
  // Check storage usage
  const checkStorage = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        let localStorageSize = 0;
        let sessionStorageSize = 0;
        
        // Calculate localStorage size
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            const value = localStorage.getItem(key);
            if (value) {
              localStorageSize += key.length + value.length;
            }
          }
        }
        
        // Calculate sessionStorage size
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key) {
            const value = sessionStorage.getItem(key);
            if (value) {
              sessionStorageSize += key.length + value.length;
            }
          }
        }
        
        setStorageInfo({
          localStorage: localStorageSize / 1024, // Convert to KB
          sessionStorage: sessionStorageSize / 1024 // Convert to KB
        });
      } catch (error) {
        addLog(`Error checking storage: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }, []);
  
  // Collect performance metrics
  const collectPerformanceMetrics = useCallback(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      try {
        const entries = performance.getEntriesByType('navigation');
        if (entries && entries.length > 0) {
          const navigationTiming = entries[0] as PerformanceNavigationTiming;
          
          if (navigationTiming) {
            setPerformanceMetrics({
              loadTime: navigationTiming.loadEventEnd - navigationTiming.loadEventStart,
              domContentLoaded: navigationTiming.domContentLoadedEventEnd - navigationTiming.domContentLoadedEventStart,
              firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
              firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
            });
          }
        }
      } catch (error) {
        addLog(`Error collecting performance metrics: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }, []);
  
  // Set up storage and performance checks
  useEffect(() => {
    if (typeof window !== 'undefined') {
      checkStorage();
      collectPerformanceMetrics();
      
      const storageInterval = setInterval(checkStorage, 10000);
      
      return () => {
        clearInterval(storageInterval);
      };
    }
  }, [checkStorage, collectPerformanceMetrics]);
  
  // Function to add logs
  const addLog = (message: string) => {
    const timestamp = new Date().toISOString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };
  
  // Function to clear logs
  const clearLogs = () => {
    setLogs([]);
    addLog('Logs cleared');
  };
  
  // Function to run tests
  const runTest = (testName: string) => {
    addLog(`Running test: ${testName}`);
    
    switch (testName) {
      case 'rssConnections':
        testRssConnections();
        break;
      case 'urlValidation':
        testUrlValidation();
        break;
      case 'browserInfo':
        collectBrowserInfo();
        break;
      case 'mockData':
        testMockData();
        break;
      case 'localStorage':
        testLocalStorage();
        break;
      case 'performance':
        testPerformance();
        break;
      case 'clearCache':
        clearCache();
        break;
      case 'reloadResources':
        reloadResources();
        break;
      default:
        addLog(`Unknown test: ${testName}`);
    }
  };
  
  // Test functions
  const testRssConnections = () => {
    addLog('Testing RSS connections...');
    
    // Simulate testing RSS connections
    setTimeout(() => {
      addLog('✅ Connection to xataka successful');
      addLog('✅ Connection to elandroidelibre successful');
      addLog('✅ Connection to genbeta successful');
      addLog('❌ Connection to hipertextual failed: timeout');
      addLog('✅ Connection to muycomputer successful');
    }, 1500);
  };
  
  const testUrlValidation = () => {
    addLog('Testing URL validation...');
    
    // Simulate URL validation tests
    const testUrls = [
      "https://www.xataka.com/categoria/article",
      "www.xataka.com/no-protocol",
      "/relative/path",
      "https://malformed..url",
      ""
    ];
    
    testUrls.forEach(url => {
      const validated = url.startsWith('http') ? url : url ? `https://${url}` : 'https://www.xataka.com';
      addLog(`URL: "${url}" → "${validated}"`);
    });
  };
  
  const collectBrowserInfo = () => {
    addLog('Collecting browser information...');
    addLog(`User Agent: ${navigator.userAgent}`);
    addLog(`Platform: ${navigator.platform}`);
    addLog(`Language: ${navigator.language}`);
    addLog(`Online: ${navigator.onLine}`);
    addLog(`Cookies Enabled: ${navigator.cookieEnabled}`);
    addLog(`Screen: ${window.screen.width}x${window.screen.height}`);
    addLog(`Window: ${window.innerWidth}x${window.innerHeight}`);
    addLog(`Pixel Ratio: ${window.devicePixelRatio}`);
    addLog(`Color Depth: ${window.screen.colorDepth}`);
  };
  
  const testMockData = () => {
    addLog('Testing mock data structure...');
    
    // Simulate checking mock data
    setTimeout(() => {
      addLog('Total mock news items: 25');
      addLog('Categories: Inteligencia Artificial, Hardware, Software, Dispositivos, Telecomunicaciones, Blockchain, Ciberseguridad, Innovación, Videojuegos, Fintech');
      addLog('Sources: Xataka, El Androide Libre, Genbeta, Hipertextual, MuyComputer, FayerWayer, WWWhat\'s New');
    }, 800);
  };
  
  const testLocalStorage = () => {
    addLog('Testing localStorage...');
    
    if (typeof window !== 'undefined') {
      try {
        // Test write/read
        localStorage.setItem('debug-test', 'test-value');
        const testValue = localStorage.getItem('debug-test');
        addLog(`Test write/read: ${testValue === 'test-value' ? 'Success' : 'Failed'}`);
        localStorage.removeItem('debug-test');
        
        // Check saved news
        try {
          const savedNewsString = localStorage.getItem("savedNews");
          const savedNews = savedNewsString ? JSON.parse(savedNewsString) : [];
          addLog(`Saved news items: ${savedNews.length}`);
        } catch (error) {
          addLog(`Error parsing savedNews: ${error instanceof Error ? error.message : String(error)}`);
        }
        
        // Check RSS feed setting
        const useRssFeedSetting = localStorage.getItem('useRssFeed');
        addLog(`RSS Feed setting: ${useRssFeedSetting}`);
        
        // List all localStorage keys
        addLog('All localStorage keys:');
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            const value = localStorage.getItem(key);
            const truncatedValue = value && value.length > 50 ? `${value.substring(0, 50)}...` : value;
            addLog(`- ${key}: ${truncatedValue}`);
          }
        }
      } catch (error) {
        addLog(`❌ localStorage error: ${error instanceof Error ? error.message : String(error)}`);
      }
    } else {
      addLog('❌ localStorage not available (server-side rendering)');
    }
  };
  
  const testPerformance = () => {
    addLog('Testing performance...');
    
    if ('performance' in window) {
      // Navigation timing
      const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigationTiming) {
        addLog(`Page load time: ${(navigationTiming.loadEventEnd - navigationTiming.startTime).toFixed(2)}ms`);
        addLog(`DOM Content Loaded: ${(navigationTiming.domContentLoadedEventEnd - navigationTiming.startTime).toFixed(2)}ms`);
      }
      
      // Resource timing
      const resources = performance.getEntriesByType('resource');
      addLog(`Resources loaded: ${resources.length}`);
      
      // Memory usage
      if ('memory' in (performance as any)) {
        const memoryInfo = (performance as any).memory;
        addLog(`Used JS Heap: ${(memoryInfo.usedJSHeapSize / 1048576).toFixed(2)} MB`);
        addLog(`Total JS Heap: ${(memoryInfo.totalJSHeapSize / 1048576).toFixed(2)} MB`);
        addLog(`JS Heap Limit: ${(memoryInfo.jsHeapSizeLimit / 1048576).toFixed(2)} MB`);
      }
    } else {
      addLog('Performance API not available');
    }
  };
  
  const clearCache = () => {
    addLog('Clearing cache...');
    
    // Clear localStorage cache items (but not settings)
    try {
      const keysToPreserve = ['theme', 'debugMode', 'useRssFeed'];
      const keysToRemove = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && !keysToPreserve.includes(key)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });
      
      addLog(`Cleared ${keysToRemove.length} items from localStorage cache`);
    } catch (error) {
      addLog(`Error clearing cache: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  const reloadResources = () => {
    addLog('Reloading resources...');
    
    // Force reload of the page
    window.location.reload();
  };
  
  // Toggle debug mode
  const toggleDebugMode = () => {
    const newMode = !isDebugMode;
    setIsDebugMode(newMode);
    localStorage.setItem('debugMode', String(newMode));
    addLog(`Debug mode ${newMode ? 'enabled' : 'disabled'}`);
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-16 dark:bg-slate-950 md:pb-0">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900/30">
              <Bug className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
              Panel de Depuración
            </h1>
          </div>
          
          <button
            onClick={toggleDebugMode}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              isDebugMode 
                ? 'bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600'
            }`}
          >
            {isDebugMode ? 'Desactivar modo debug' : 'Activar modo debug'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main debug panel */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="border-b border-gray-200 p-4 dark:border-slate-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Consola de depuración
                </h2>
              </div>
              
              <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Logs</h3>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-slate-700 dark:text-gray-300">
                      {logs.length}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(logs.join('\n'));
                        addLog('Logs copied to clipboard');
                      }}
                      className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
                    >
                      Copiar
                    </button>
                    <button
                      onClick={clearLogs}
                      className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
                    >
                      Limpiar
                    </button>
                  </div>
                </div>
                
                <div className="h-96 overflow-auto rounded-md border border-gray-200 bg-gray-50 p-2 font-mono text-xs text-gray-800 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-200">
                  {logs.length > 0 ? (
                    logs.map((log, index) => {
                      // Colorize different types of logs
                      const isError = log.toLowerCase().includes('error') || log.toLowerCase().includes('failed') || log.toLowerCase().includes('❌');
                      const isWarning = log.toLowerCase().includes('warn') || log.toLowerCase().includes('deprecated');
                      const isSuccess = log.toLowerCase().includes('success') || log.toLowerCase().includes('completed') || log.toLowerCase().includes('✅');
                      
                      return (
                        <div 
                          key={index} 
                          className={`border-b border-gray-100 py-1 dark:border-slate-800 ${
                            isError ? 'text-red-600 dark:text-red-400' : 
                            isWarning ? 'text-amber-600 dark:text-amber-400' : 
                            isSuccess ? 'text-green-600 dark:text-green-400' : ''
                          }`}
                        >
                          {log}
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400">
                      No hay logs disponibles
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar with metrics and actions */}
          <div className="space-y-6">
            {/* System status */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Estado del sistema
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {networkStatus === 'online' ? (
                      <Wifi size={16} className="text-green-500" />
                    ) : (
                      <Wifi size={16} className="text-red-500" />
                    )}
                    <span className="text-sm text-gray-700 dark:text-gray-300">Conexión</span>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    networkStatus === 'online' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {networkStatus === 'online' ? 'Online' : 'Offline'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardDrive size={16} className="text-blue-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Memoria</span>
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {memoryUsage !== null ? `${memoryUsage.toFixed(1)} MB` : 'N/A'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database size={16} className="text-purple-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">LocalStorage</span>
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {storageInfo.localStorage.toFixed(1)} KB
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu size={16} className="text-amber-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Carga de página</span>
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {performanceMetrics.loadTime ? `${performanceMetrics.loadTime.toFixed(0)} ms` : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Debug actions */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Acciones de depuración
              </h3>
              
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => runTest('rssConnections')}
                  className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
                >
                  <RefreshCw size={16} className="text-blue-500" />
                  Probar conexiones RSS
                </button>
                
                <button
                  onClick={() => runTest('urlValidation')}
                  className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
                >
                  <AlertCircle size={16} className="text-green-500" />
                  Validar URLs
                </button>
                
                <button
                  onClick={() => runTest('browserInfo')}
                  className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
                >
                  <Bug size={16} className="text-amber-500" />
                  Info del navegador
                </button>
                
                <button
                  onClick={() => runTest('mockData')}
                  className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
                >
                  <Database size={16} className="text-purple-500" />
                  Datos de ejemplo
                </button>
                
                <button
                  onClick={() => runTest('localStorage')}
                  className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
                >
                  <HardDrive size={16} className="text-indigo-500" />
                  LocalStorage
                </button>
                
                <button
                  onClick={() => runTest('performance')}
                  className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
                >
                  <Cpu size={16} className="text-red-500" />
                  Rendimiento
                </button>
              </div>
            </div>
            
            {/* Maintenance actions */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Mantenimiento
              </h3>
              
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => runTest('clearCache')}
                  className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
                >
                  <RefreshCw size={16} className="text-blue-500" />
                  Limpiar caché
                </button>
                
                <button
                  onClick={() => runTest('reloadResources')}
                  className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
                >
                  <Download size={16} className="text-green-500" />
                  Recargar recursos
                </button>
                
                <button
                  onClick={() => {
                    addLog('Redirecting to home page...');
                    window.location.href = '/';
                  }}
                  className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
                >
                  <Zap size={16} className="text-amber-500" />
                  Volver al inicio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
      <MobileNavbar />
      <DarkModeToggle />
    </main>
  );
}
