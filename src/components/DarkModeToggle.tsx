"use client"

import { useState, useEffect, useMemo } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export const DarkModeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Wait for component to mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  // Prepare icon element outside of return to avoid conditional rendering issues
  const ThemeIcon = useMemo(() => {
    if (!mounted) return <div className="h-5 w-5"></div>; // Placeholder to avoid layout shift
    
    if (theme === 'dark') {
      return <Sun className="h-5 w-5 text-amber-500" />;
    }
    return <Moon className="h-5 w-5 text-slate-700" />;
  }, [mounted, theme]);
  
  return (
    <motion.button
      onClick={toggleTheme}
      className="fixed bottom-20 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition-colors hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 md:bottom-6"
      aria-label="Cambiar tema"
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {ThemeIcon}
    </motion.button>
  );
};
