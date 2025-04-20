"use client";

import { Home, Bookmark, Compass, User, Menu, X, Bug } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";
export const MobileNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    theme
  } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Wait for component to mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prepare theme-dependent elements to avoid conditional rendering issues
  const logoSrc = useMemo(() => {
    const darkLogo = "https://www.webcincodev.com/blog/wp-content/uploads/2025/04/lofoweb2-1s.png";
    const lightLogo = "https://www.webcincodev.com/blog/wp-content/uploads/2025/04/lofoweb2-1e.png";
    if (!mounted) return lightLogo;
    return theme === 'dark' ? darkLogo : lightLogo;
  }, [mounted, theme]);
  return <>
      {/* Mobile App-like Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-gray-200 bg-white shadow dark:border-slate-700 dark:bg-slate-900 md:hidden">
        <nav className="flex justify-around">
          <a href="#" className="flex flex-1 flex-col items-center justify-center py-3 text-blue-600 dark:text-blue-400">
            <Home size={20} />
            <span className="mt-1 text-xs">Inicio</span>
          </a>
          <a href="/popular" className="flex flex-1 flex-col items-center justify-center py-3 text-gray-500 dark:text-gray-400">
            <Compass size={20} />
            <span className="mt-1 text-xs">Popular</span>
          </a>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex flex-1 flex-col items-center justify-center py-3 text-gray-500 dark:text-gray-400">
            <Menu size={20} />
            <span className="mt-1 text-xs">Menú</span>
          </button>
          <a href="#" className="flex flex-1 flex-col items-center justify-center py-3 text-gray-500 dark:text-gray-400">
            <Bookmark size={20} />
            <span className="mt-1 text-xs">Guardados</span>
          </a>
          <a href="#" className="flex flex-1 flex-col items-center justify-center py-3 text-gray-500 dark:text-gray-400">
            <User size={20} />
            <span className="mt-1 text-xs">Perfil</span>
          </a>
        </nav>
      </div>

      {/* Mobile App Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && <motion.div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-slate-900 md:hidden" initial={{
        y: "100%"
      }} animate={{
        y: 0
      }} exit={{
        y: "100%"
      }} transition={{
        type: "spring",
        damping: 30,
        stiffness: 300
      }}>
            <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-slate-700">
              <div className="flex items-center">
                <Image src={logoSrc} alt="webcincodev Logo" width={140} height={40} className="h-10 w-auto" />
                <span className="ml-2 text-xl font-bold text-blue-600 dark:text-blue-500">webcincodev</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">New</span>
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <nav className="space-y-6">
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">Navegación</h3>
                  <ul className="space-y-3">
                    <li>
                      <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-slate-800">
                        <Home size={20} />
                        <span>Inicio</span>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-slate-800">
                        <Compass size={20} />
                        <span>Explorar</span>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-slate-800">
                        <Bookmark size={20} />
                        <span>Guardados</span>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-slate-800">
                        <User size={20} />
                        <span>Perfil</span>
                      </a>
                    </li>
                    {mounted && (
                      <>
                        {typeof window !== 'undefined' && localStorage.getItem('debugMode') === 'true' && (
                          <li>
                            <a href="/debug" className="flex items-center gap-3 rounded-lg px-3 py-2 text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20">
                              <Bug size={20} />
                              <span>Debug</span>
                            </a>
                          </li>
                        )}
                      </>
                    )}
                  </ul>
                </div>
                
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">Categorías</h3>
                  <ul className="space-y-1">
                    <li><a href="#" className="block rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-slate-800">Inteligencia Artificial</a></li>
                    <li><a href="#" className="block rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-slate-800">Hardware</a></li>
                    <li><a href="#" className="block rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-slate-800">Software</a></li>
                    <li><a href="#" className="block rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-slate-800">Dispositivos</a></li>
                    <li><a href="#" className="block rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-slate-800">Blockchain</a></li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">Fuentes</h3>
                  <ul className="grid grid-cols-2 gap-2">
                    <li>
                      <a href="#" className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-slate-800">
                        <div className="relative h-5 w-5 overflow-hidden rounded-full">
                          <Image src="https://picsum.photos/200" alt="Xataka" width={20} height={20} className="object-contain" />
                        </div>
                        <span>Xataka</span>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-slate-800">
                        <div className="relative h-5 w-5 overflow-hidden rounded-full">
                          <Image src="https://picsum.photos/200" alt="El Androide Libre" width={20} height={20} className="object-contain" />
                        </div>
                        <span>El Androide Libre</span>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-slate-800">
                        <div className="relative h-5 w-5 overflow-hidden rounded-full">
                          <Image src="https://i.imgur.com/2ItpWDc.png" alt="Genbeta" width={20} height={20} className="object-contain" />
                        </div>
                        <span>Genbeta</span>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-slate-800">
                        <div className="relative h-5 w-5 overflow-hidden rounded-full">
                          <Image src="https://i.imgur.com/Yp3Qbch.png" alt="Hipertextual" width={20} height={20} className="object-contain" />
                        </div>
                        <span>Hipertextual</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </nav>
            </div>
            
            <div className="border-t border-gray-200 p-4 dark:border-slate-700">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">© 2025 webcincodev</span>
                <a href="#" className="text-sm text-blue-600 dark:text-blue-400">Términos y condiciones</a>
              </div>
            </div>
          </motion.div>}
      </AnimatePresence>
    </>;
};
