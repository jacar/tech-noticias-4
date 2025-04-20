"use client"

import { motion } from "framer-motion";
import { ArrowRight, Code, Palette, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export const ServiceBanner = () => {
  // Animation variants for text - using useMemo to avoid recreating on each render
  const textVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  }), []);

  // Animation variants for icons - using useMemo to avoid recreating on each render
  const iconVariants = useMemo(() => ({
    hidden: { scale: 0, rotate: -45 },
    visible: (i: number) => ({
      scale: 1,
      rotate: 0,
      transition: {
        delay: i * 0.15 + 0.2,
        duration: 0.4,
        type: "spring",
        stiffness: 200
      }
    })
  }), []);

  return (
    <div className="w-full bg-blue-600 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Left side - Text content */}
          <div className="max-w-xl">
            <motion.h2 
              className="mb-2 text-2xl font-bold text-white md:text-3xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Servicios profesionales de diseño y desarrollo
            </motion.h2>
            
            <div className="mb-4 flex flex-wrap gap-3">
              <motion.div 
                className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm"
                custom={0}
                initial="hidden"
                animate="visible"
                variants={textVariants}
              >
                <motion.span custom={0} variants={iconVariants} initial="hidden" animate="visible">
                  <Code size={16} />
                </motion.span>
                Desarrollo Web
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm"
                custom={1}
                initial="hidden"
                animate="visible"
                variants={textVariants}
              >
                <motion.span custom={1} variants={iconVariants} initial="hidden" animate="visible">
                  <Palette size={16} />
                </motion.span>
                Diseño Gráfico
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm"
                custom={2}
                initial="hidden"
                animate="visible"
                variants={textVariants}
              >
                <motion.span custom={2} variants={iconVariants} initial="hidden" animate="visible">
                  <TrendingUp size={16} />
                </motion.span>
                Marketing Digital
              </motion.div>
            </div>
            
            <motion.p 
              className="mb-6 text-white/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Soluciones integrales para tu presencia digital. Diseño web moderno, identidad visual atractiva y estrategias de marketing efectivas para hacer crecer tu negocio.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              <Link 
                href="https://www.armandomi.space/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-blue-600 shadow-lg transition-all hover:bg-blue-50 hover:shadow-xl"
              >
                Contactar a Armando Ovalle Jácome
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
          
          {/* Right side - Animated elements */}
          <div className="hidden md:block">
            <motion.div 
              className="relative h-24 w-64"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {/* Animated text elements */}
              <motion.div 
                className="absolute left-0 top-0 rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <span className="text-sm font-medium text-white">Desarrollador Web Freelance</span>
              </motion.div>
              
              <motion.div 
                className="absolute bottom-0 right-0 rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.4 }}
              >
                <span className="text-sm font-medium text-white">Soluciones a medida</span>
              </motion.div>
              
              <motion.div 
                className="absolute left-1/4 top-1/2 -translate-y-1/2 rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.4 }}
              >
                <span className="text-sm font-medium text-white">Diseño profesional</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
