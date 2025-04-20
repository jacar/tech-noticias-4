"use client"

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { NewsGrid } from "@/components/NewsGrid";
import { MobileNavbar } from "@/components/MobileNavbar";
import ErrorBoundary from "@/components/ErrorBoundary";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { Footer } from "@/components/Footer";
import { NewsItem } from "@/types";
import { Zap, TrendingUp, RefreshCw } from "lucide-react";

export default function PopularPage() {
  const [popularNews, setPopularNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch popular news from the API
  const fetchPopularNews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/news/popular?limit=12');
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data && data.news && Array.isArray(data.news)) {
        setPopularNews(data.news);
        setLastUpdated(new Date());
      } else {
        throw new Error('Invalid data format received from API');
      }
    } catch (error) {
      console.error("Error fetching popular news:", error);
      setError(error instanceof Error ? error.message : 'Error desconocido al cargar noticias populares');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch popular news on component mount
  useEffect(() => {
    fetchPopularNews();
    
    // Set up auto-refresh every 5 minutes
    const refreshInterval = setInterval(() => {
      fetchPopularNews();
    }, 5 * 60 * 1000);
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  // Function to manually refresh the data
  const handleRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    fetchPopularNews();
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-16 dark:bg-slate-950 md:pb-0">
      <Header />
      
      <section className="py-8">
        <div className="container mx-auto">
          <div className="mb-8 flex flex-col gap-4 px-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900/30">
                <TrendingUp className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Noticias Populares
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Las noticias más leídas y compartidas del momento
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {lastUpdated && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Última actualización: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
              
              <button
                onClick={handleRefresh}
                disabled={refreshing || loading}
                className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
                {refreshing ? "Actualizando..." : "Actualizar"}
              </button>
            </div>
          </div>
          
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400">
              <p className="flex items-center gap-2">
                <Zap size={18} />
                <span>{error}</span>
              </p>
            </div>
          )}
          
          <ErrorBoundary>
            <NewsGrid 
              sourceFilter={null} 
              categoryFilter={null} 
              initialNews={popularNews}
              loading={loading}
              showPopularityIndicator={true}
            />
          </ErrorBoundary>
        </div>
      </section>
      
      <Footer />
      <MobileNavbar />
      <DarkModeToggle />
    </main>
  );
}
