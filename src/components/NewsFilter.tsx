"use client"

import { useState } from "react";
import { newsSources } from "@/lib/news-sources";
import Image from "next/image";
import { ChevronDown, Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  "Todas", "Inteligencia Artificial", "Hardware", "Software", 
  "Dispositivos", "Telecomunicaciones", "Blockchain", "Ciberseguridad", 
  "Innovación", "Videojuegos", "Fintech"
];

interface NewsFilterProps {
  onFilterChange: (source: string | null, category: string | null) => void;
}

export const NewsFilter = ({ onFilterChange }: NewsFilterProps) => {
  const [activeSource, setActiveSource] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>("Todas");
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'sources' | 'categories'>('sources');
  
  const handleSourceClick = (sourceId: string) => {
    const newSource = activeSource === sourceId ? null : sourceId;
    setActiveSource(newSource);
    onFilterChange(newSource, activeCategory === "Todas" ? null : activeCategory);
  };
  
  const handleCategoryClick = (category: string) => {
    const newCategory = category === "Todas" ? null : category;
    setActiveCategory(category);
    onFilterChange(activeSource, newCategory);
  };

  const clearFilters = () => {
    setActiveSource(null);
    setActiveCategory("Todas");
    onFilterChange(null, null);
  };

  // Count active filters
  const activeFiltersCount = (activeSource ? 1 : 0) + (activeCategory !== "Todas" ? 1 : 0);

  return (
    <div className="container mx-auto px-4 py-4">
      {/* Compact filter bar */}
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 rounded-md bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600"
          >
            <Filter size={16} />
            <span>Filtros</span>
            {activeFiltersCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-medium text-white">
                {activeFiltersCount}
              </span>
            )}
            <ChevronDown 
              size={16} 
              className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            />
          </button>
          
          {/* Active filters display */}
          <div className="flex flex-wrap items-center gap-2">
            {activeSource && (
              <div className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                <div className="relative h-3 w-3 overflow-hidden rounded-full">
                  <Image
                    src={newsSources.find(s => s.id === activeSource)?.logo || ""}
                    alt={newsSources.find(s => s.id === activeSource)?.name || ""}
                    width={12}
                    height={12}
                    className="object-contain"
                  />
                </div>
                <span>{newsSources.find(s => s.id === activeSource)?.name}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSourceClick(activeSource);
                  }}
                  className="ml-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            {activeCategory !== "Todas" && (
              <div className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                <span>{activeCategory}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCategoryClick("Todas");
                  }}
                  className="ml-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            {activeFiltersCount > 0 && (
              <button 
                onClick={clearFilters}
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expandable filter panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="border-b border-gray-200 dark:border-slate-700">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('sources')}
                  className={`px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'sources' 
                      ? 'border-b-2 border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400' 
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  Fuentes
                </button>
                <button
                  onClick={() => setActiveTab('categories')}
                  className={`px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'categories' 
                      ? 'border-b-2 border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400' 
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  Categorías
                </button>
              </div>
            </div>
            
            <div className="p-4">
              {activeTab === 'sources' && (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {newsSources.map(source => (
                    <button
                      key={source.id}
                      onClick={() => handleSourceClick(source.id)}
                      className={`flex items-center gap-2 rounded-md border px-3 py-2 text-left transition-colors
                        ${activeSource === source.id 
                          ? "border-blue-500 bg-blue-50 text-blue-600 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-400" 
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"}`}
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
                      <span className="text-sm font-medium">{source.name}</span>
                    </button>
                  ))}
                </div>
              )}
              
              {activeTab === 'categories' && (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => handleCategoryClick(category)}
                      className={`rounded-md border px-3 py-2 text-left text-sm font-medium transition-colors
                        ${activeCategory === category 
                          ? "border-blue-500 bg-blue-50 text-blue-600 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-400" 
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"}`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
