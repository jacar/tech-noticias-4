"use client"

import { useState, useEffect, useRef, useMemo } from "react";
import type { NewsItem } from '@/types';
import { Menu, Moon, Sun, Search, Laptop, ChevronDown, X } from "lucide-react";
import { newsSources } from "@/lib/news-sources";
import Image from "next/image";
import { useTheme } from "next-themes";
import { SearchBox } from "./SearchBox";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isPopularOpen, setIsPopularOpen] = useState(false);
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const popularRef = useRef<HTMLDivElement>(null);
  const savedRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [popularItems, setPopularItems] = useState<NewsItem[]>([]);
  const [savedItems, setSavedItems] = useState<NewsItem[]>([]);

  // Wait for component to mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Cerrar los menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }

      if (popularRef.current && !popularRef.current.contains(event.target as Node)) {
        setIsPopularOpen(false);
      }

      if (savedRef.current && !savedRef.current.contains(event.target as Node)) {
        setIsSavedOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef, themeMenuRef, popularRef, savedRef]);

  // Enfocar el campo de búsqueda cuando se abre
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const fetchHeaderPopular = async () => {
    try {
      const res = await fetch('/api/news/popular?limit=5');
      if (res.ok) {
        const { news } = await res.json();
        setPopularItems(news);
      }
    } catch (e) {
      console.error('Error fetching header popular:', e);
    }
  };

  useEffect(() => {
    if (isPopularOpen && popularItems.length === 0) fetchHeaderPopular();
  }, [isPopularOpen]);

  const fetchHeaderSaved = async () => {
    try {
      const userId = localStorage.getItem('userId') || 'anonymous';
      const res = await fetch(`/api/news/save?userId=${userId}`);
      if (res.ok) {
        const { saved } = await res.json();
        setSavedItems(saved);
      }
    } catch (e) {
      console.error('Error fetching header saved:', e);
    }
  };

  useEffect(() => {
    if (isSavedOpen && savedItems.length === 0) fetchHeaderSaved();
  }, [isSavedOpen]);

  // Prepare theme-dependent elements to avoid conditional rendering issues
  const logoSrc = useMemo(() => {
    const darkLogo = "https://www.webcincodev.com/blog/wp-content/uploads/2025/04/lofoweb2-1s.png";
    const lightLogo = "https://www.webcincodev.com/blog/wp-content/uploads/2025/04/lofoweb2-1e.png";
    
    if (!mounted) return lightLogo;
    return theme === 'dark' ? darkLogo : lightLogo;
  }, [mounted, theme]);
  
  const ThemeIcon = useMemo(() => {
    if (!mounted) return <Laptop size={20} />;
    
    if (theme === 'dark') return <Moon size={20} />;
    if (theme === 'light') return <Sun size={20} />;
    return <Laptop size={20} />;
  }, [mounted, theme]);

  return (
    <header className="sticky top-0 z-10 bg-white shadow dark:bg-slate-900 dark:shadow-slate-800/20">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo y nombre */}
        <div className="flex items-center">
          <button 
            className="mr-4 block rounded-full p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            <Menu size={20} />
          </button>
          
          <div className="flex items-center">
            <Link href="/">
              <div className="h-10 w-auto">
                <Image 
                  src={logoSrc}
                  alt="webcincodev Logo"
                  width={140}
                  height={40}
                  className="h-10 w-auto"
                />
              </div>
            </Link>
          </div>
        </div>

        {/* Navegación en escritorio - Organizada por categorías */}
        <nav className="hidden md:block">
          <ul className="flex items-center space-x-6">
            <li><Link href="#" className="font-medium text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400">Inicio</Link></li>
            
            {/* Categorías - Dropdown */}
            <li className="relative group">
              <button className="flex items-center gap-1 font-medium text-gray-500 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                Categorías
                <ChevronDown size={16} className="transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute left-0 top-full z-20 mt-1 hidden w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 group-hover:block dark:bg-slate-800 dark:ring-slate-700">
                <Link href="/?category=Inteligencia%20Artificial" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700">Inteligencia Artificial</Link>
                <Link href="/?category=Hardware" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700">Hardware</Link>
                <Link href="/?category=Software" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700">Software</Link>
                <Link href="/?category=Dispositivos" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700">Dispositivos</Link>
                <Link href="/?category=Blockchain" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700">Blockchain</Link>
              </div>
            </li>
            
            {/* Fuentes - Dropdown */}
            <li className="relative group">
              <button className="flex items-center gap-1 font-medium text-gray-500 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                Fuentes
                <ChevronDown size={16} className="transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute left-0 top-full z-20 mt-1 hidden w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 group-hover:block dark:bg-slate-800 dark:ring-slate-700">
                {newsSources.map(source => (
                  <Link 
                    key={source.id} 
                    href={`/?source=${source.id}`} 
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700"
                  >
                    <div className="relative h-4 w-4 overflow-hidden rounded-full">
                      <Image
                        src={source.logo}
                        alt={source.name}
                        width={16}
                        height={16}
                        className="object-contain"
                      />
                    </div>
                    <span>{source.name}</span>
                  </Link>
                ))}
              </div>
            </li>
            
            <li
              className="relative"
              onMouseEnter={() => setIsPopularOpen(true)}
              onMouseLeave={() => setIsPopularOpen(false)}
            >
              <Link href="/popular/" className="font-medium text-gray-500 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                Popular
              </Link>
              {isPopularOpen && (
                <div 
                  ref={popularRef}
                  className="absolute left-0 top-full z-20 mt-1 w-64 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-slate-800 dark:ring-slate-700"
                >
                  {popularItems.map(item => (
                    <Link
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}
            </li>

            <li
              className="relative"
              onMouseEnter={() => setIsSavedOpen(true)}
              onMouseLeave={() => setIsSavedOpen(false)}
            >
              <Link href="#" className="font-medium text-gray-500 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                Guardados
              </Link>
              {isSavedOpen && (
                <div
                  ref={savedRef}
                  className="absolute left-0 top-full z-20 mt-1 w-64 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-slate-800 dark:ring-slate-700"
                >
                  {savedItems.length ? savedItems.map(item => (
                    <Link
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700"
                    >
                      {item.title}
                    </Link>
                  )) : (
                    <span className="block px-4 py-2 text-sm text-gray-500">No hay guardados</span>
                  )}
                </div>
              )}
            </li>
            
            {mounted && (
              <>
                {typeof window !== 'undefined' && localStorage.getItem('debugMode') === 'true' && (
                  <li><Link href="/debug/" className="font-medium text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-500">Debug</Link></li>
                )}
              </>
            )}
          </ul>
        </nav>

        {/* Acciones */}
        <div className="flex items-center gap-2">
          <button
            className="rounded-full p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Buscar"
          >
            <Search size={20} />
          </button>

          <div className="relative">
            <button 
              className="rounded-full p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800"
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              aria-label="Opciones de tema"
            >
              {ThemeIcon}
            </button>
            
            {/* Menú de temas */}
            {isThemeMenuOpen && (
              <div 
                ref={themeMenuRef}
                className="absolute right-0 top-full z-20 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-slate-800 dark:ring-slate-700"
              >
                <button 
                  className={`flex w-full items-center px-4 py-2 text-sm ${theme === 'light' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700'}`}
                  onClick={() => setTheme('light')}
                >
                  <Sun size={16} className="mr-2" />
                  Modo claro
                </button>
                <button 
                  className={`flex w-full items-center px-4 py-2 text-sm ${theme === 'dark' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700'}`}
                  onClick={() => setTheme('dark')}
                >
                  <Moon size={16} className="mr-2" />
                  Modo oscuro
                </button>
                <button 
                  className={`flex w-full items-center px-4 py-2 text-sm ${theme === 'system' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700'}`}
                  onClick={() => setTheme('system')}
                >
                  <Laptop size={16} className="mr-2" />
                  Usar tema del sistema
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Componente de búsqueda avanzada */}
      <SearchBox isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Menú móvil */}
      <div 
        ref={menuRef}
        className={`absolute left-0 top-16 z-20 h-screen w-64 transform bg-white p-4 shadow-lg transition-transform dark:bg-slate-900 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex justify-end mb-4">
          <button onClick={() => setIsMenuOpen(false)} aria-label="Cerrar menú" className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-800 rounded">
            <X size={20} />
          </button>
        </div>
        <p className="mb-3 text-sm text-gray-500">Se recomienda actualizar los RSS en el botón</p>
        <nav>
          <ul className="space-y-4">
            <li><Link href="/" className="block font-medium text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400">Inicio</Link></li>
            <li><Link href="/popular/" className="block font-medium text-gray-500 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Popular</Link></li>
            <li><Link href="/saved" className="block font-medium text-gray-500 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Guardados</Link></li>
            <li><Link href="/categories" className="block font-medium text-gray-500 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Categorías</Link></li>
          </ul>
          
          <div className="my-6 border-t border-gray-200 pt-4 dark:border-slate-700">
            <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">Fuentes</h3>
            <ul className="space-y-3">
              {newsSources.map(source => (
                <li key={source.id}>
                  <Link 
                    href={`/?source=${source.id}`} 
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                  >
                    <div className="relative h-5 w-5 overflow-hidden rounded-full">
                      <Image
                        src={source.logo}
                        alt={source.name}
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                    </div>
                    <span>{source.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};
