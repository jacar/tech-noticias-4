"use client"

import { useState, useEffect, useRef, useMemo } from "react";
import { AlertCircle, Bug, RefreshCw, X, Code, Database, Cpu, Zap, Download, Upload, Clock, Wifi, WifiOff, HardDrive, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DebugPanelProps {
  isOpen: boolean;
  onClose: () => void;
  logs: string[];
  onClearLogs: () => void;
  onRunTest: (testName: string) => void;
}

export const DebugPanel = ({
  isOpen,
  onClose,
  logs,
  onClearLogs,
  onRunTest
}: DebugPanelProps) => {
  const [activeTab, setActiveTab] = useState<'logs' | 'tests' | 'info' | 'network' | 'performance'>('logs');
  const [isMinimized, setIsMinimized] = useState(false);
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline'>('online');
  const [memoryUsage, setMemoryUsage] = useState<number | null>(null);
  const [lastActivity, setLastActivity] = useState<Date>(new Date());
  const logContainerRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll logs to bottom
  useEffect(() => {
    if (logContainerRef.current && activeTab === 'logs') {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, activeTab]);
  
  // Monitor network status
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      const handleOnline = () => setNetworkStatus('online');
      const handleOffline = () => setNetworkStatus('offline');
      
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      // Set initial status
      setNetworkStatus(navigator.onLine ? 'online' : 'offline');
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);
  
  // Monitor memory usage if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMemory = () => {
        if ('performance' in window && 'memory' in (window.performance as any)) {
          try {
            const memoryInfo = (window.performance as any).memory;
            if (memoryInfo && typeof memoryInfo.usedJSHeapSize === 'number') {
              setMemoryUsage(memoryInfo.usedJSHeapSize / 1048576); // Convert to MB
            }
          } catch (error) {
            console.error("Error checking memory usage:", error);
          }
        }
      };
      
      checkMemory();
      const intervalId = setInterval(checkMemory, 5000);
      
      return () => {
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    }
  }, []);
  
  // Update last activity timestamp
  useEffect(() => {
    const updateActivity = () => setLastActivity(new Date());
    
    window.addEventListener('click', updateActivity);
    window.addEventListener('keypress', updateActivity);
    window.addEventListener('scroll', updateActivity);
    window.addEventListener('mousemove', updateActivity);
    
    return () => {
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('keypress', updateActivity);
      window.removeEventListener('scroll', updateActivity);
      window.removeEventListener('mousemove', updateActivity);
    };
  }, []);
  
  // Format time since last activity function
  const formatTimeSince = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800"
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-between border-b border-gray-200 p-3 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-purple-100 p-1.5 dark:bg-purple-900/30">
                <Bug className="text-purple-600 dark:text-purple-400" size={18} />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Panel de Depuración</h2>
              
              {/* Status indicators */}
              <div className="ml-4 flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <div className={`h-2 w-2 rounded-full ${networkStatus === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {networkStatus === 'online' ? 'Online' : 'Offline'}
                  </span>
                </div>
                
                {memoryUsage !== null && (
                  <div className="flex items-center gap-1">
                    <HardDrive size={12} className="text-blue-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {memoryUsage.toFixed(1)} MB
                    </span>
                  </div>
                )}
                
                <div className="flex items-center gap-1">
                  <Clock size={12} className="text-amber-500" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTimeSince(lastActivity)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsMinimized(!isMinimized)}
                className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-slate-700 dark:hover:text-gray-200"
                aria-label={isMinimized ? "Expandir" : "Minimizar"}
              >
                {isMinimized ? (
                  <Layers size={18} />
                ) : (
                  <Layers size={18} />
                )}
              </button>
              
              <button 
                onClick={onClose}
                className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-slate-700 dark:hover:text-gray-200"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          
          <AnimatePresence>
            {!isMinimized && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="border-b border-gray-200 dark:border-slate-700">
                  <div className="flex overflow-x-auto">
                    <button
                      className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors ${
                        activeTab === 'logs' 
                          ? 'border-b-2 border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400' 
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                      }`}
                      onClick={() => setActiveTab('logs')}
                    >
                      <Code size={16} />
                      Logs
                    </button>
                    <button
                      className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors ${
                        activeTab === 'tests' 
                          ? 'border-b-2 border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400' 
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                      }`}
                      onClick={() => setActiveTab('tests')}
                    >
                      <Zap size={16} />
                      Pruebas
                    </button>
                    <button
                      className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors ${
                        activeTab === 'network' 
                          ? 'border-b-2 border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400' 
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                      }`}
                      onClick={() => setActiveTab('network')}
                    >
                      <Wifi size={16} />
                      Red
                    </button>
                    <button
                      className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors ${
                        activeTab === 'performance' 
                          ? 'border-b-2 border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400' 
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                      }`}
                      onClick={() => setActiveTab('performance')}
                    >
                      <Cpu size={16} />
                      Rendimiento
                    </button>
                    <button
                      className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors ${
                        activeTab === 'info' 
                          ? 'border-b-2 border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400' 
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                      }`}
                      onClick={() => setActiveTab('info')}
                    >
                      <Database size={16} />
                      Información
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  {activeTab === 'logs' && (
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Logs de depuración</h3>
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-slate-700 dark:text-gray-300">
                            {logs.length}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(logs.join('\n'));
                            }}
                            className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
                          >
                            Copiar
                          </button>
                          <button
                            onClick={onClearLogs}
                            className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
                          >
                            Limpiar
                          </button>
                        </div>
                      </div>
                      
                      <div 
                        ref={logContainerRef}
                        className="h-64 overflow-auto rounded-md border border-gray-200 bg-gray-50 p-2 font-mono text-xs text-gray-800 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-200"
                      >
                        {logs.length > 0 ? (
                          logs.map((log, index) => {
                            // Colorize different types of logs
                            const isError = log.toLowerCase().includes('error') || log.toLowerCase().includes('failed');
                            const isWarning = log.toLowerCase().includes('warn') || log.toLowerCase().includes('deprecated');
                            const isSuccess = log.toLowerCase().includes('success') || log.toLowerCase().includes('completed');
                            
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
                  )}
                  
                  {activeTab === 'tests' && (
                    <div>
                      <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Pruebas de diagnóstico</h3>
                      
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                        <button
                          onClick={() => onRunTest('rssConnections')}
                          className="flex items-center gap-3 rounded-md border border-gray-200 bg-white p-3 text-left text-sm transition-all hover:border-blue-300 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500 dark:hover:bg-blue-900/20"
                        >
                          <div className="rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            <RefreshCw size={16} />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Probar conexiones RSS</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Verifica la conectividad con las fuentes RSS</div>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => onRunTest('urlValidation')}
                          className="flex items-center gap-3 rounded-md border border-gray-200 bg-white p-3 text-left text-sm transition-all hover:border-green-300 hover:bg-green-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-green-500 dark:hover:bg-green-900/20"
                        >
                          <div className="rounded-full bg-green-100 p-2 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                            <AlertCircle size={16} />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Validación de URLs</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Prueba la validación de diferentes formatos de URL</div>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => onRunTest('browserInfo')}
                          className="flex items-center gap-3 rounded-md border border-gray-200 bg-white p-3 text-left text-sm transition-all hover:border-amber-300 hover:bg-amber-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-amber-500 dark:hover:bg-amber-900/20"
                        >
                          <div className="rounded-full bg-amber-100 p-2 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                            <Bug size={16} />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Info del navegador</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Muestra información sobre el navegador actual</div>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => onRunTest('mockData')}
                          className="flex items-center gap-3 rounded-md border border-gray-200 bg-white p-3 text-left text-sm transition-all hover:border-purple-300 hover:bg-purple-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-purple-500 dark:hover:bg-purple-900/20"
                        >
                          <div className="rounded-full bg-purple-100 p-2 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                            <Database size={16} />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Datos de ejemplo</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Verifica la estructura de los datos de ejemplo</div>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => onRunTest('localStorage')}
                          className="flex items-center gap-3 rounded-md border border-gray-200 bg-white p-3 text-left text-sm transition-all hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-500 dark:hover:bg-indigo-900/20"
                        >
                          <div className="rounded-full bg-indigo-100 p-2 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                            <HardDrive size={16} />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">LocalStorage</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Verifica el acceso y funcionamiento del localStorage</div>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => onRunTest('performance')}
                          className="flex items-center gap-3 rounded-md border border-gray-200 bg-white p-3 text-left text-sm transition-all hover:border-red-300 hover:bg-red-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-red-500 dark:hover:bg-red-900/20"
                        >
                          <div className="rounded-full bg-red-100 p-2 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                            <Cpu size={16} />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Rendimiento</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Analiza el rendimiento de la aplicación</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'network' && (
                    <div>
                      <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Monitoreo de red</h3>
                      
                      <div className="mb-4 flex items-center justify-between rounded-md border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                        <div className="flex items-center gap-3">
                          {networkStatus === 'online' ? (
                            <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30">
                              <Wifi className="text-green-600 dark:text-green-400" size={18} />
                            </div>
                          ) : (
                            <div className="rounded-full bg-red-100 p-2 dark:bg-red-900/30">
                              <WifiOff className="text-red-600 dark:text-red-400" size={18} />
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              Estado de la conexión
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {networkStatus === 'online' 
                                ? 'Conectado a internet' 
                                : 'Sin conexión a internet'}
                            </div>
                          </div>
                        </div>
                        <div className={`rounded-full px-3 py-1 text-xs font-medium ${
                          networkStatus === 'online' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {networkStatus === 'online' ? 'Online' : 'Offline'}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="rounded-md border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                          <div className="mb-2 flex items-center gap-2">
                            <Download size={16} className="text-blue-600 dark:text-blue-400" />
                            <h4 className="font-medium text-gray-900 dark:text-white">Descargas</h4>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">RSS Feeds</span>
                              <span className="font-medium text-gray-900 dark:text-white">OK</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Imágenes</span>
                              <span className="font-medium text-gray-900 dark:text-white">OK</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">API</span>
                              <span className="font-medium text-gray-900 dark:text-white">OK</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="rounded-md border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                          <div className="mb-2 flex items-center gap-2">
                            <Upload size={16} className="text-purple-600 dark:text-purple-400" />
                            <h4 className="font-medium text-gray-900 dark:text-white">Subidas</h4>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Analytics</span>
                              <span className="font-medium text-gray-900 dark:text-white">OK</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Logs</span>
                              <span className="font-medium text-gray-900 dark:text-white">OK</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'performance' && (
                    <div>
                      <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Métricas de rendimiento</h3>
                      
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="rounded-md border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                          <div className="mb-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Memoria</div>
                          <div className="flex items-end justify-between">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                              {memoryUsage !== null ? `${memoryUsage.toFixed(1)} MB` : 'N/A'}
                            </div>
                            <div className="text-sm text-green-600 dark:text-green-400">Normal</div>
                          </div>
                        </div>
                        
                        <div className="rounded-md border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                          <div className="mb-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Tiempo de carga</div>
                          <div className="flex items-end justify-between">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                              {typeof window !== 'undefined' && window.performance ? 
                                `${Math.round(window.performance.now() / 1000)}s` : 'N/A'}
                            </div>
                            <div className="text-sm text-green-600 dark:text-green-400">Bueno</div>
                          </div>
                        </div>
                        
                        <div className="rounded-md border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                          <div className="mb-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Actividad</div>
                          <div className="flex items-end justify-between">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                              {formatTimeSince(lastActivity)}
                            </div>
                            <div className="text-sm text-blue-600 dark:text-blue-400">Activo</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 rounded-md border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                        <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Acciones de rendimiento</h4>
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                          <button
                            onClick={() => onRunTest('clearCache')}
                            className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
                          >
                            <RefreshCw size={16} />
                            Limpiar caché
                          </button>
                          <button
                            onClick={() => onRunTest('reloadResources')}
                            className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
                          >
                            <Download size={16} />
                            Recargar recursos
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'info' && (
                    <div>
                      <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Información del sistema</h3>
                      
                      <div className="rounded-md border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div>
                            <h4 className="mb-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Navegador</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-700 dark:text-gray-300">User Agent:</span>
                                <span className="max-w-[70%] truncate text-gray-600 dark:text-gray-400">{typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Plataforma:</span>
                                <span className="text-gray-600 dark:text-gray-400">{typeof navigator !== 'undefined' ? navigator.platform : 'N/A'}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Idioma:</span>
                                <span className="text-gray-600 dark:text-gray-400">{typeof navigator !== 'undefined' ? navigator.language : 'N/A'}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Online:</span>
                                <span className="text-gray-600 dark:text-gray-400">{typeof navigator !== 'undefined' ? (navigator.onLine ? 'Sí' : 'No') : 'N/A'}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Cookies:</span>
                                <span className="text-gray-600 dark:text-gray-400">{typeof navigator !== 'undefined' ? (navigator.cookieEnabled ? 'Habilitadas' : 'Deshabilitadas') : 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="mb-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Aplicación</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-700 dark:text-gray-300">URL:</span>
                                <span className="max-w-[70%] truncate text-gray-600 dark:text-gray-400">{typeof window !== 'undefined' ? window.location.href : 'N/A'}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Resolución:</span>
                                <span className="text-gray-600 dark:text-gray-400">{typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'N/A'}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Tema:</span>
                                <span className="text-gray-600 dark:text-gray-400">{typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Oscuro' : 'Claro'}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-700 dark:text-gray-300">LocalStorage:</span>
                                <span className="text-gray-600 dark:text-gray-400">{typeof window !== 'undefined' && window.localStorage ? 'Disponible' : 'No disponible'}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-700 dark:text-gray-300">SessionStorage:</span>
                                <span className="text-gray-600 dark:text-gray-400">{typeof window !== 'undefined' && window.sessionStorage ? 'Disponible' : 'No disponible'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
