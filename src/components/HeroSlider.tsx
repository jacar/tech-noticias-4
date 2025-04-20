"use client"

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NewsItem } from "@/types";
import { formatRelativeTime } from "@/lib/mock-news";
import { motion, AnimatePresence } from "framer-motion";

interface HeroSliderProps {
  news: NewsItem[];
}

export const HeroSlider = ({ news }: HeroSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  // Ensure we have valid news data
  const validNews = useMemo(() => {
    return news && news.length > 0 ? news : [];
  }, [news]);
  
  // Auto-advance the slider
  useEffect(() => {
    const interval = setInterval(() => {
      if (validNews.length > 1) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % validNews.length);
      }
    }, 5000);
    
    return () => {
      clearInterval(interval);
    };
  }, [validNews.length]);
  
  const goToNext = () => {
    if (validNews.length <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % validNews.length);
  };
  
  const goToPrev = () => {
    if (validNews.length <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + validNews.length) % validNews.length);
  };
  
  const goToSlide = (index: number) => {
    if (index >= 0 && index < validNews.length) {
      setCurrentIndex(index);
    }
  };
  
  // Handle touch events for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (validNews.length <= 1) return;
    
    if (touchStart - touchEnd > 50) {
      // Swipe left
      goToNext();
    }
    
    if (touchStart - touchEnd < -50) {
      // Swipe right
      goToPrev();
    }
  };
  
  // If no news, return null
  if (validNews.length === 0) {
    return null;
  }
  
  const currentNews = validNews[currentIndex];
  
  return (
    <div 
      className="relative h-[300px] w-full overflow-hidden md:h-[500px]"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background image with overlay */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIndex}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src={currentNews.imageUrl}
            alt={currentNews.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        </motion.div>
      </AnimatePresence>
      
      {/* Content */}
      <div className="container relative mx-auto flex h-full flex-col justify-end px-4 pb-16">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentIndex}
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-blue-600 px-3 py-1 text-sm font-medium text-white">
                {currentNews.category}
              </span>
              <span className="text-sm font-medium text-gray-300">
                {formatRelativeTime(currentNews.publishedAt)}
              </span>
              <span className="text-sm font-medium text-gray-300">
                {currentNews.source}
              </span>
            </div>
            
            <h1 className="mb-4 text-2xl font-bold text-white md:text-4xl">
              {currentNews.title}
            </h1>
            
            <p className="mb-6 hidden text-lg text-gray-200 md:block">
              {currentNews.description}
            </p>
            
            <button 
              onClick={() => {
                if (currentNews.url) {
                  window.open(currentNews.url, '_blank');
                }
              }}
              className="rounded-lg bg-white px-4 py-2 font-medium text-gray-900 transition-colors hover:bg-gray-100 md:px-6 md:py-3"
            >
              Leer artículo
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Navigation arrows - hidden on mobile */}
      {validNews.length > 1 && (
        <>
          <button 
            onClick={goToPrev}
            className="absolute left-4 top-1/2 hidden -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/70 md:block"
            aria-label="Anterior"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={goToNext}
            className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/70 md:block"
            aria-label="Siguiente"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
      
      {/* Indicators - only show if we have multiple slides */}
      {validNews.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {validNews.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 w-2 rounded-full transition-colors md:h-2 md:w-8 ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Ir a la noticia ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
