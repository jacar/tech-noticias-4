"use client"

import { useState } from "react";
import { Header } from "@/components/Header";
import { NewsFilter } from "@/components/NewsFilter";
import { NewsGrid } from "@/components/NewsGrid";
import { MobileNavbar } from "@/components/MobileNavbar";
import ErrorBoundary from "@/components/ErrorBoundary";
import { HeroSlider } from "@/components/HeroSlider";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { Footer } from "@/components/Footer";
import { mockNews } from "@/lib/mock-news";

export default function HomePage() {
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  // Use a simple slice for initial state
  const [featuredNews] = useState(() => mockNews.slice(0, 5));
  
  const handleFilterChange = (source: string | null, category: string | null) => {
    setSourceFilter(source);
    setCategoryFilter(category);
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-16 dark:bg-slate-950 md:pb-0">
      <Header />
      
      <HeroSlider news={featuredNews} />
      
      <section className="py-4">
        <div className="container mx-auto">
          <h1 className="px-4 text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
            Noticias de Tecnología
          </h1>
          <p className="px-4 text-gray-600 dark:text-gray-400">
            Las últimas novedades del mundo tecnológico en español
          </p>
        </div>
      </section>
      
      <NewsFilter onFilterChange={handleFilterChange} />
      <ErrorBoundary>
        <NewsGrid sourceFilter={sourceFilter} categoryFilter={categoryFilter} />
      </ErrorBoundary>
      <Footer />
      <MobileNavbar />
      <DarkModeToggle />
    </main>
  );
}
