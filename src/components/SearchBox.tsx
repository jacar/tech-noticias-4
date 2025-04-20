"use client"

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import Image from "next/image";
import { mockNews } from "@/lib/mock-news";
import { NewsItem } from "@/types";

interface SearchBoxProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchBox = ({ isOpen, onClose }: SearchBoxProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Focus input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);
  
  // Reset search when closed
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [isOpen]);
  
  // Handle search in real-time
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    // Simulate loading state
    setIsLoading(true);
    
    // Simulate network delay for real-time search
    setTimeout(() => {
      // Filter news based on query
      const results = mockNews.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()) ||
        item.source.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8);
      
      setSearchResults(results);
      setIsLoading(false);
    }, 300);
  };
  
  // Handle item click
  const handleResultClick = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
    onClose();
  };
  
  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm dark:bg-slate-900/80">
      <div className="container mx-auto px-4 pt-16">
        <div className="mx-auto max-w-2xl rounded-xl bg-white shadow-2xl dark:bg-slate-800">
          {/* Search header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-slate-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Búsqueda</h2>
            <button 
              onClick={onClose}
              className="rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-700"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Search input */}
          <div className="relative p-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Buscar noticias, fuentes, temas..."
                className="w-full rounded-full border border-gray-300 bg-gray-50 py-3 pl-10 pr-10 text-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-center p-4">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
            </div>
          )}
          
          {/* Search results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {searchResults.length > 0 ? (
              <div className="divide-y divide-gray-100 dark:divide-slate-700">
                {searchResults.map((result) => (
                  <div 
                    key={result.id} 
                    className="flex cursor-pointer items-start gap-4 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-slate-700"
                    onClick={() => handleResultClick(result.url)}
                  >
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={result.imageUrl}
                        alt={result.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-1 line-clamp-2 font-medium text-gray-900 dark:text-white">{result.title}</h4>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">{result.category}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{result.source}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchQuery.trim() !== '' && !isLoading ? (
              <div className="p-8 text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700">
                  <Search size={24} className="text-gray-500 dark:text-gray-400" />
                </div>
                <h3 className="mb-1 text-lg font-medium text-gray-900 dark:text-white">No se encontraron resultados</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  No hay coincidencias para "{searchQuery}". Intenta con otros términos.
                </p>
              </div>
            ) : null}
          </div>
          
          {/* Search tips */}
          {searchQuery.trim() === '' && (
            <div className="p-4">
              <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Búsquedas populares</h3>
              <div className="flex flex-wrap gap-2">
                {['Inteligencia Artificial', 'Apple', 'Bitcoin', 'Android', 'Windows'].map((term) => (
                  <button
                    key={term}
                    className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-700"
                    onClick={() => handleSearch(term)}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
