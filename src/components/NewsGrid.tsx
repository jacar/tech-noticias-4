"use client"

import { useEffect, useState } from "react";
import { NewsCard } from "./NewsCard";
import { Skeleton } from "./ui/skeleton";
import { mockNews } from "@/lib/mock-news";
import { NewsItem } from "@/types";
import { useInView } from "react-intersection-observer";
import { checkUrlAccessibility, isSameDomain, validateUrl } from "@/lib/utils";
import { LinkValidationSummary } from "./LinkValidationSummary";
import { fetchRssNews, rssFeedUrls } from "@/lib/rss-utils";
import { AlertCircle, Bug, RefreshCw } from "lucide-react";
import { ApiError } from "@/lib/api-error";
import { ErrorPage } from "./ErrorPage";
import { DebugPanel } from "./DebugPanel";

interface NewsGridProps {
  sourceFilter: string | null;
  categoryFilter: string | null;
  initialNews?: NewsItem[];
  loading?: boolean;
  showPopularityIndicator?: boolean;
}

export const NewsGrid = ({ 
  sourceFilter, 
  categoryFilter, 
  initialNews = [], 
  loading: externalLoading = false,
  showPopularityIndicator = false
}: NewsGridProps) => {
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [loading, setLoading] = useState(initialNews.length === 0 && !externalLoading);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [urlValidationStatus, setUrlValidationStatus] = useState<Record<string, {valid: boolean, sameDomain: boolean}>>({});
  const [isValidating, setIsValidating] = useState(false);
  const [validationStats, setValidationStats] = useState({
    totalLinks: 0,
    validLinks: 0,
    invalidLinks: 0,
    sameDomainLinks: 0,
    differentDomainLinks: 0
  });
  const [useRssFeed, setUseRssFeed] = useState<boolean>(false);
  const [rssError, setRssError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<ApiError | null>(null);
  
  // Initialize useRssFeed from API or localStorage
  useEffect(() => {
    const initializePreferences = async () => {
      if (typeof window !== 'undefined') {
        try {
          // Get user ID from localStorage or generate one
          const userId = localStorage.getItem('userId') || `anon_${Math.random().toString(36).substring(2, 15)}`;
          
          // Save user ID if it was just generated
          if (!localStorage.getItem('userId')) {
            localStorage.setItem('userId', userId);
          }
          
          // Try to get preferences from API
          const response = await fetch(`/api/preferences?userId=${userId}`);
          
          if (response.ok) {
            const preferences = await response.json();
            setUseRssFeed(preferences.useRssFeed);
            
            // Also set debug mode if available
            if (preferences.debugMode !== undefined) {
              setDebugMode(preferences.debugMode);
              localStorage.setItem('debugMode', String(preferences.debugMode));
            }
          } else {
            // Fallback to localStorage
            const savedValue = localStorage.getItem('useRssFeed');
            if (savedValue !== null) {
              setUseRssFeed(savedValue === 'true');
            }
          }
        } catch (error) {
          console.error("Error initializing preferences:", error);
          
          // Fallback to localStorage
          const savedValue = localStorage.getItem('useRssFeed');
          if (savedValue !== null) {
            setUseRssFeed(savedValue === 'true');
          }
        }
      }
    };
    
    initializePreferences();
  }, []);
  
  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  // Toggle RSS feed usage and save to API
  const toggleRssFeed = async () => {
    const newValue = !useRssFeed;
    setUseRssFeed(newValue);
    
    // Save to localStorage as fallback
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('useRssFeed', String(newValue));
      } catch (error) {
        console.error("Error saving useRssFeed to localStorage:", error);
      }
    }
    
    // Save to API
    try {
      const userId = localStorage.getItem('userId') || 'anonymous';
      
      await fetch('/api/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          useRssFeed: newValue,
        }),
      });
    } catch (error) {
      console.error("Error saving preferences to API:", error);
    }
    
    // Reload news with new source
    setLoading(true);
    setPage(1);
    setRssError(null); // Clear previous errors
    loadNews(newValue, sourceFilter, categoryFilter);
  };

  // Debug mode state
  const [debugMode, setDebugMode] = useState<boolean>(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [showDebugPanel, setShowDebugPanel] = useState<boolean>(false);
  
  // Initialize debug mode from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedDebugMode = localStorage.getItem('debugMode');
        if (storedDebugMode === 'true') {
          setDebugMode(true);
        }
      } catch (error) {
        console.error("Error reading debugMode from localStorage:", error);
      }
    }
  }, []);
  
  // Function to add debug logs
  const addDebugLog = (message: string) => {
    if (debugMode) {
      const timestamp = new Date().toISOString();
      setDebugLogs(prev => [...prev, `[${timestamp}] ${message}`]);
      
      // Also log to console for easier debugging
      console.log(`[DEBUG] ${message}`);
    }
  };
  
  // Function to run debug tests
  const runDebugTest = (testName: string) => {
    addDebugLog(`Ejecutando prueba: ${testName}`);
    
    switch (testName) {
      case 'rssConnections': {
        addDebugLog("Testing RSS feed connections...");
        Object.keys(rssFeedUrls).forEach(async (source) => {
          try {
            addDebugLog(`Testing connection to ${source}...`);
            await fetchRssNews(source, true);
            addDebugLog(`✅ Connection to ${source} successful`);
          } catch (error) {
            addDebugLog(`❌ Connection to ${source} failed: ${error instanceof Error ? error.message : String(error)}`);
          }
        });
        break;
      }
        
      case 'urlValidation': {
        addDebugLog("Checking URL validation...");
        const testUrls = [
          "https://www.xataka.com/categoria/article",
          "www.xataka.com/no-protocol",
          "/relative/path",
          "https://malformed..url",
          ""
        ];
        
        testUrls.forEach(url => {
          const validated = validateUrl(url, "https://www.xataka.com");
          addDebugLog(`URL: "${url}" → "${validated}"`);
        });
        break;
      }
        
      case 'browserInfo': {
        addDebugLog("Checking browser capabilities...");
        addDebugLog(`User Agent: ${navigator.userAgent}`);
        addDebugLog(`Online: ${navigator.onLine}`);
        addDebugLog(`Language: ${navigator.language}`);
        addDebugLog(`Cookies Enabled: ${navigator.cookieEnabled}`);
        addDebugLog(`Platform: ${navigator.platform}`);
        addDebugLog(`Screen: ${window.screen.width}x${window.screen.height}`);
        break;
      }
        
      case 'mockData': {
        addDebugLog("Checking mock data structure...");
        addDebugLog(`Total mock news items: ${mockNews.length}`);
        const categories = [...new Set(mockNews.map(item => item.category))];
        addDebugLog(`Categories: ${categories.join(', ')}`);
        const sources = [...new Set(mockNews.map(item => item.source))];
        addDebugLog(`Sources: ${sources.join(', ')}`);
        break;
      }
        
      case 'localStorage': {
        addDebugLog("Checking localStorage...");
        try {
          localStorage.setItem('debug-test', 'test-value');
          const testValue = localStorage.getItem('debug-test');
          addDebugLog(`Test write/read: ${testValue === 'test-value' ? 'Success' : 'Failed'}`);
          localStorage.removeItem('debug-test');
          
          const savedNews = JSON.parse(localStorage.getItem("savedNews") || "[]");
          addDebugLog(`Saved news items: ${savedNews.length}`);
          
          const useRssFeedSetting = localStorage.getItem('useRssFeed');
          addDebugLog(`RSS Feed setting: ${useRssFeedSetting}`);
        } catch (error) {
          addDebugLog(`❌ localStorage error: ${error instanceof Error ? error.message : String(error)}`);
        }
        break;
      }
    }
  };
  
  // Function to load news from API, RSS, or mock data
  const loadNews = async (useRss: boolean, source: string | null, category: string | null) => {
    setRssError(null);
    setApiError(null);
    
    if (debugMode) {
      addDebugLog(`Loading news - RSS: ${useRss}, Source: ${source || 'all'}, Category: ${category || 'all'}`);
    }
    
    try {
      // First try to load from database API
      setLoading(true);
      try {
        addDebugLog("Fetching news from database...");
        
        // Build API URL with query parameters
        let apiUrl = '/api/news';
        const params = new URLSearchParams();
        if (source) params.append('source', source);
        if (category) params.append('category', category);
        if (params.toString()) apiUrl += `?${params.toString()}`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new ApiError(`Error fetching news: ${response.status}`, response.status);
        }
        
        const dbNews = await response.json();
        
        // Check if we have news from the database
        if (dbNews && dbNews.length > 0) {
          addDebugLog(`Fetched ${dbNews.length} news items from database`);
          
          setNews(dbNews.slice(0, 6)); // First 6 news
          setHasMore(dbNews.length > 6);
          setLoading(false);
          
          // Verify URLs of loaded news
          validateNewsUrls(dbNews.slice(0, 6));
          addDebugLog("News loaded successfully from database");
          return;
        } else {
          addDebugLog("No news found in database, falling back to RSS or mock data");
        }
      } catch (error) {
        console.error("Error loading news from database:", error);
        addDebugLog(`Error loading news from database: ${error instanceof Error ? error.message : String(error)}`);
        // Continue to fallback methods
      }
      
      // If database fetch failed or returned no results, try RSS or mock data
      if (useRss) {
        // Load from RSS feeds
        try {
          addDebugLog("Fetching RSS news...");
          const rssNews = await fetchRssNews(source || undefined, debugMode);
          
          // Verify we have valid news
          if (!rssNews || rssNews.length === 0) {
            addDebugLog("No RSS news returned");
            throw new ApiError("No se pudieron cargar noticias desde RSS", 500);
          }
          
          addDebugLog(`Fetched ${rssNews.length} RSS news items`);
          
          let filteredNews = [...rssNews];
          
          if (category) {
            addDebugLog(`Filtering by category: ${category}`);
            filteredNews = filteredNews.filter(item => 
              item.category === category
            );
            addDebugLog(`After category filter: ${filteredNews.length} items`);
          }
          
          // If no results with filters, show empty message
          if (filteredNews.length === 0 && (source || category)) {
            addDebugLog("No results after filtering");
            filteredNews = [];
          }
          
          // Verify each news has a valid URL
          addDebugLog("Validating news URLs");
          filteredNews = filteredNews.map(item => {
            if (!item.url || item.url === 'https://www.google.com') {
              addDebugLog(`Invalid URL for item: ${item.title}, using source URL`);
              return {
                ...item,
                url: validateUrl(item.sourceUrl, 'https://www.google.com')
              };
            }
            return item;
          });
          
          setNews(filteredNews.slice(0, 6)); // First 6 news
          setHasMore(filteredNews.length > 6);
          setLoading(false);
          
          // Verify URLs of loaded news
          validateNewsUrls(filteredNews.slice(0, 6));
          addDebugLog("News loaded successfully from RSS");
        } catch (error) {
          console.error("Error loading RSS news:", error);
          addDebugLog(`Error loading RSS news: ${error instanceof Error ? error.message : String(error)}`);
          
          if (error instanceof ApiError) {
            setApiError(error);
            addDebugLog(`API Error: ${error.statusCode} - ${error.message}`);
          } else {
            setApiError(new ApiError("Error al cargar noticias RSS", 500));
            addDebugLog("Created generic API error");
          }
          
          // Don't fallback to mock data immediately, show the error
          setLoading(false);
          throw error; // Re-throw to prevent further processing
        }
      } else {
        // Load from mock data
        let filteredNews = [...mockNews];
        
        // Verify each news has a valid URL
        filteredNews = filteredNews.map(item => {
          if (!item.url || item.url === 'https://www.google.com') {
            return {
              ...item,
              url: validateUrl(item.sourceUrl, 'https://www.google.com')
            };
          }
          return item;
        });
        
        if (source) {
          filteredNews = filteredNews.filter(item => 
            item.source.toLowerCase() === source.toLowerCase()
          );
        }
        
        if (category) {
          filteredNews = filteredNews.filter(item => 
            item.category === category
          );
        }
        
        // If no results with filters, show empty message
        if (filteredNews.length === 0 && (source || category)) {
          filteredNews = [];
        } else {
          // Sort by most recent date
          filteredNews = filteredNews.sort((a, b) => 
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
          );
        }
        
        setNews(filteredNews.slice(0, 6)); // First 6 news
        setHasMore(filteredNews.length > 6);
        setLoading(false);
        
        // Verify URLs of loaded news
        validateNewsUrls(filteredNews.slice(0, 6));
        addDebugLog("News loaded successfully from mock data");
      }
    } catch (error) {
      console.error("Error loading news:", error);
      
      // Only set rssError if we don't have an ApiError
      if (!apiError) {
        setRssError("Error al cargar noticias. Usando datos de respaldo.");
        
        // Fallback to mock data
        let filteredNews = [...mockNews];
        
        // Verify each news has a valid URL
        filteredNews = filteredNews.map(item => {
          if (!item.url || item.url === 'https://www.google.com') {
            return {
              ...item,
              url: validateUrl(item.sourceUrl, 'https://www.google.com')
            };
          }
          return item;
        });
        
        if (source) {
          filteredNews = filteredNews.filter(item => 
            item.source.toLowerCase() === source.toLowerCase()
          );
        }
        
        if (category) {
          filteredNews = filteredNews.filter(item => 
            item.category === category
          );
        }
        
        filteredNews = filteredNews.sort((a, b) => 
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
        
        setNews(filteredNews.slice(0, 6));
        setHasMore(filteredNews.length > 6);
        setLoading(false);
        
        validateNewsUrls(filteredNews.slice(0, 6));
        addDebugLog("News loaded successfully from mock data (fallback)");
      }
    }
  };

  // Cargar noticias iniciales
  useEffect(() => {
    // If initialNews is provided, don't load news automatically
    if (initialNews.length > 0) {
      return;
    }
    
    setLoading(true);
    setPage(1);
    loadNews(useRssFeed, sourceFilter, categoryFilter);
  }, [sourceFilter, categoryFilter, useRssFeed, initialNews.length]);
  
  // Función para validar URLs de noticias
  const validateNewsUrls = async (newsItems: NewsItem[]) => {
    if (newsItems.length === 0) return;
    
    setIsValidating(true);
    const validationResults: Record<string, {valid: boolean, sameDomain: boolean}> = {};
    
    let validCount = 0;
    let invalidCount = 0;
    let sameDomainCount = 0;
    let differentDomainCount = 0;
    
    for (const item of newsItems) {
      try {
        // Verificar accesibilidad
        const isAccessible = await checkUrlAccessibility(item.url);
        
        // Verificar si pertenece al mismo dominio que la fuente
        const isSameDomainResult = isSameDomain(item.url, item.sourceUrl);
        
        validationResults[item.id] = {
          valid: isAccessible,
          sameDomain: isSameDomainResult
        };
        
        // Actualizar contadores
        if (isAccessible) validCount++;
        else invalidCount++;
        
        if (isSameDomainResult) sameDomainCount++;
        else differentDomainCount++;
        
      } catch (error) {
        validationResults[item.id] = {
          valid: false,
          sameDomain: false
        };
        invalidCount++;
        differentDomainCount++;
      }
    }
    
    setUrlValidationStatus(prev => ({...prev, ...validationResults}));
    
    // Actualizar estadísticas de validación
    setValidationStats(prev => ({
      totalLinks: prev.totalLinks + newsItems.length,
      validLinks: prev.validLinks + validCount,
      invalidLinks: prev.invalidLinks + invalidCount,
      sameDomainLinks: prev.sameDomainLinks + sameDomainCount,
      differentDomainLinks: prev.differentDomainLinks + differentDomainCount
    }));
    
    setIsValidating(false);
  };

  // Efecto para cargar más noticias al hacer scroll
  useEffect(() => {
    if (inView && !loading && hasMore) {
      loadMoreNews();
    }
  }, [inView]);

  const loadMoreNews = async () => {
    setLoading(true);
    
    try {
      if (useRssFeed) {
        // Load more from RSS feeds
        const rssNews = await fetchRssNews(sourceFilter || undefined);
        
        let filteredNews = [...rssNews];
        
        if (categoryFilter) {
          filteredNews = filteredNews.filter(item => 
            item.category === categoryFilter
          );
        }
        
        const nextPage = page + 1;
        const moreNews = filteredNews.slice(0, nextPage * 6);
        
        // Obtener solo las nuevas noticias que se cargarán
        const currentNewsIds = news.map(item => item.id);
        const newNewsItems = moreNews.filter(item => !currentNewsIds.includes(item.id));
        
        setNews(moreNews);
        setPage(nextPage);
        setHasMore(moreNews.length < filteredNews.length);
        setLoading(false);
        
        // Validar URLs de las nuevas noticias
        validateNewsUrls(newNewsItems);
      } else {
        // Load more from mock data
        let filteredNews = [...mockNews];
        
        if (sourceFilter) {
          filteredNews = filteredNews.filter(item => 
            item.source.toLowerCase() === sourceFilter.toLowerCase()
          );
        }
        
        if (categoryFilter) {
          filteredNews = filteredNews.filter(item => 
            item.category === categoryFilter
          );
        }
        
        // Ordenar por fecha más reciente
        filteredNews = filteredNews.sort((a, b) => 
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
        
        const nextPage = page + 1;
        const moreNews = filteredNews.slice(0, nextPage * 6);
        
        // Obtener solo las nuevas noticias que se cargarán
        const currentNewsIds = news.map(item => item.id);
        const newNewsItems = moreNews.filter(item => !currentNewsIds.includes(item.id));
        
        setNews(moreNews);
        setPage(nextPage);
        setHasMore(moreNews.length < filteredNews.length);
        setLoading(false);
        
        // Validar URLs de las nuevas noticias
        validateNewsUrls(newNewsItems);
      }
    } catch (error) {
      console.error("Error loading more news:", error);
      setRssError("Error al cargar más noticias desde RSS.");
      setLoading(false);
    }
  };

  // Handle retry
  const handleRetry = async () => {
    setApiError(null);
    await loadNews(useRssFeed, sourceFilter, categoryFilter);
  };

  // If there's an API error, show the error page
  if (apiError) {
    return (
      <ErrorPage 
        title="Error al cargar noticias"
        message={apiError.message}
        code={apiError.statusCode}
        retry={apiError.isRetryable ? handleRetry : undefined}
      />
    );
  }

  // Show skeletons while loading
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Skeleton key={idx} className="h-64 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (news.length === 0 && !loading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-6 text-center dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">No se encontraron noticias</h3>
        <p className="text-gray-600 dark:text-gray-400">
          No hay resultados que coincidan con los filtros seleccionados.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-16 pt-6 md:pb-6">
      {/* RSS Feed Toggle and Debug Controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleRssFeed}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              useRssFeed 
                ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600'
            }`}
          >
            <RefreshCw size={16} className={loading && useRssFeed ? 'animate-spin' : ''} />
            {useRssFeed ? 'Usando RSS en vivo' : 'Usar fuentes RSS'}
          </button>
          
          <button
            onClick={async () => {
              const newDebugMode = !debugMode;
              setDebugMode(newDebugMode);
              localStorage.setItem('debugMode', String(newDebugMode));
              addDebugLog(newDebugMode ? 'Debug mode enabled' : 'Debug mode disabled');
                  
              // Save to API
              try {
                const userId = localStorage.getItem('userId') || 'anonymous';
                    
                await fetch('/api/preferences', {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    userId,
                    debugMode: newDebugMode,
                  }),
                });
              } catch (error) {
                console.error("Error saving debug mode to API:", error);
              }
            }}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              debugMode 
                ? 'bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600'
            }`}
          >
            <AlertCircle size={16} />
            {debugMode ? 'Modo Debug ON' : 'Modo Debug OFF'}
          </button>
          
          {rssError && (
            <div className="flex items-center gap-1 text-sm text-amber-600 dark:text-amber-500">
              <AlertCircle size={16} />
              <span>{rssError}</span>
            </div>
          )}
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {useRssFeed ? 'Noticias actualizadas en tiempo real' : 'Usando datos de ejemplo'}
        </div>
        
        {/* Botón para recargar noticias */}
        <button
          onClick={() => {
            setLoading(true);
            setRssError(null);
            setDebugLogs([]);
            addDebugLog("Manual reload triggered");
            loadNews(useRssFeed, sourceFilter, categoryFilter);
          }}
          className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
          disabled={loading}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Recargar
        </button>
      </div>
      
      {/* Debug Button */}
      {debugMode && (
        <div className="fixed bottom-4 right-4 z-40">
          <button
            onClick={() => setShowDebugPanel(!showDebugPanel)}
            className="flex items-center gap-2 rounded-full bg-purple-600 p-3 text-white shadow-lg hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
            title="Abrir panel de depuración"
          >
            <Bug size={20} />
          </button>
        </div>
      )}
      
      {/* Debug Panel */}
      <DebugPanel 
        isOpen={showDebugPanel && debugMode}
        onClose={() => setShowDebugPanel(false)}
        logs={debugLogs}
        onClearLogs={() => setDebugLogs([])}
        onRunTest={runDebugTest}
      />
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {news.map((item, index) => (
          <NewsCard 
            key={item.id} 
            news={{
              ...item, 
              isRssFeed: useRssFeed,
              views: item.views,
              shares: item.shares
            }}
            showPopularityIndicator={showPopularityIndicator}
            popularityRank={index}
          />
        ))}
        
        {loading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}
      </div>
      
      {/* Indicador de carga para scroll infinito */}
      {hasMore && (
        <div ref={ref} className="mt-8 flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
        </div>
      )}
      
      {/* Notificación de verificación de enlaces */}
      {isValidating && (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-white p-3 shadow-lg dark:bg-slate-800">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500"></div>
            <span className="text-xs text-gray-600 dark:text-gray-300">
              Verificando enlaces de noticias
            </span>
          </div>
        </div>
      )}
      
      {/* Resumen de validación de enlaces */}
      {!isValidating && validationStats.totalLinks > 0 && (
        <LinkValidationSummary 
          totalLinks={validationStats.totalLinks}
          validLinks={validationStats.validLinks}
          invalidLinks={validationStats.invalidLinks}
          sameDomainLinks={validationStats.sameDomainLinks}
          differentDomainLinks={validationStats.differentDomainLinks}
        />
      )}
    </div>
  );
};

const SkeletonCard = () => (
  <div className="flex flex-col overflow-hidden rounded-xl bg-white shadow dark:bg-slate-800">
    <Skeleton className="h-40 w-full" />
    <div className="p-4">
      <Skeleton className="mb-2 h-4 w-20" />
      <Skeleton className="mb-4 h-6 w-full" />
      <Skeleton className="mb-2 h-6 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  </div>
);
