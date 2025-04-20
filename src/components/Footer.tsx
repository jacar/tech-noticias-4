"use client"

import { Github, Globe, Linkedin, Mail, Heart } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-gray-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">webcincodevNew</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Noticias y actualidad tecnológica en español. Mantente al día con las últimas novedades del mundo tech.
            </p>
            <div className="flex space-x-4">
              <motion.a 
                href="https://x.com/WebcincoDevco" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 transition-colors hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Twitter/X"
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="sr-only">Twitter/X</span>
              </motion.a>
              <motion.a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 transition-colors hover:text-blue-700 dark:text-gray-400 dark:hover:text-blue-400"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </motion.a>
              <motion.a 
                href="mailto:info@webcincodev.com" 
                className="text-gray-500 transition-colors hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail size={20} />
                <span className="sr-only">Email</span>
              </motion.a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Enlaces rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/categorias" className="text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                  Categorías
                </Link>
              </li>
              <li>
                <Link href="/fuentes" className="text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                  Fuentes
                </Link>
              </li>
              <li>
                <Link href="/guardados" className="text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                  Guardados
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terminos-y-condiciones" className="text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link href="/politica-de-privacidad" className="text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link href="/politica-de-cookies" className="text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                  Política de cookies
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Author */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Autor</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Desarrollado por Armando Ovalle Jacome
            </p>
            <div className="flex space-x-4">
              <motion.a 
                href="https://github.com/jacar" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github size={20} />
                <span className="sr-only">GitHub</span>
              </motion.a>
              <motion.a 
                href="https://www.armandomi.space/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 transition-colors hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Globe size={20} />
                <span className="sr-only">Portfolio</span>
              </motion.a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 pt-8 dark:border-slate-800">
          <div className="flex flex-col items-center justify-between space-y-4 text-sm text-gray-600 dark:text-gray-400 md:flex-row md:space-y-0">
            <p>© {currentYear} webcincodevNew. Todos los derechos reservados.</p>
            <p className="flex items-center">
              Hecho con <Heart size={16} className="mx-1 text-red-500" /> en Colombia
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
