"use client";

import { NewsItem } from "@/types";
import Image from "next/image";
import { formatRelativeTime } from "@/lib/mock-news";
import { useState, useEffect } from "react";
import { Eye, Clock, ExternalLink, AlertCircle, CheckCircle, Share2 } from "lucide-react";
import { validateUrl, checkUrlAccessibility, isSameDomain } from "@/lib/utils";
interface NewsCardProps {
  news: NewsItem;
  showPopularityIndicator?: boolean;
  popularityRank?: number;
}
export const NewsCard = ({
  news,
  showPopularityIndicator = false,
  popularityRank
}: NewsCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [validUrl, setValidUrl] = useState(news.url);
  const [urlStatus, setUrlStatus] = useState<'unchecked' | 'valid' | 'invalid' | 'checking'>('unchecked');
  const [isCorrectDomain, setIsCorrectDomain] = useState<boolean | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Debug mode
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  // Render functions that might be causing issues
  const renderRssFeedTooltip = () => {
    if (!news.isRssFeed) return null;
    
    return (
      <div className="absolute bottom-16 left-1/2 z-10 w-64 -translate-x-1/2 rounded-md bg-white p-2 text-xs shadow-lg dark:bg-slate-800">
        <div className="flex items-center gap-1 font-medium text-green-600 dark:text-green-500">
          <CheckCircle size={12} />
          <span>Enlace RSS verificado</span>
        </div>
        <p className="mt-1 text-gray-600 dark:text-gray-300">
          Este enlace proviene directamente del feed RSS de la fuente y es confiable.
        </p>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setShowDebugInfo(!showDebugInfo);
          }}
          className="mt-1 text-blue-600 hover:underline dark:text-blue-400"
        >
          {showDebugInfo ? "Ocultar info debug" : "Mostrar info debug"}
        </button>
      </div>
    );
  };
  
  const renderWarningTooltip = () => {
    if (news.isRssFeed || (urlStatus !== 'invalid' && isCorrectDomain !== false)) return null;
    
    return (
      <div className="absolute bottom-16 left-1/2 z-10 w-64 -translate-x-1/2 rounded-md bg-white p-2 text-xs shadow-lg dark:bg-slate-800">
        <div className="flex items-center gap-1 font-medium text-amber-600 dark:text-amber-500">
          <AlertCircle size={12} />
          <span>Advertencia de enlace</span>
        </div>
        <p className="mt-1 text-gray-600 dark:text-gray-300">
          {urlStatus === 'invalid' && "Intentando abrir el artículo directamente. Si no es posible, se redirigirá al sitio de la fuente."}
          {urlStatus === 'valid' && isCorrectDomain === false && "El enlace del artículo no pertenece al dominio de la fuente declarada, pero se abrirá directamente."}
        </p>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setShowDebugInfo(!showDebugInfo);
          }}
          className="mt-1 text-blue-600 hover:underline dark:text-blue-400"
        >
          {showDebugInfo ? "Ocultar info debug" : "Mostrar info debug"}
        </button>
      </div>
    );
  };
  
  const renderDebugPanel = () => {
    if (!showDebugInfo) return null;
    
    return (
      <div 
        className="absolute left-0 right-0 top-0 z-20 overflow-auto rounded-t-xl bg-black/90 p-3 text-xs text-white backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between">
          <h4 className="mb-2 font-bold">Información de depuración</h4>
          <button 
            onClick={(e) => {
              e.preventDefault();
              setShowDebugInfo(false);
            }}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        <div className="space-y-1">
          <p><span className="font-semibold">ID:</span> {news.id}</p>
          <p><span className="font-semibold">URL Original:</span> {news.originalLink || 'N/A'}</p>
          <p><span className="font-semibold">URL Validada:</span> {validUrl}</p>
          <p><span className="font-semibold">URL Fuente:</span> {news.sourceUrl}</p>
          <p><span className="font-semibold">Estado URL:</span> {urlStatus}</p>
          <p><span className="font-semibold">Mismo dominio:</span> {isCorrectDomain ? 'Sí' : 'No'}</p>
          <p><span className="font-semibold">Es RSS:</span> {news.isRssFeed ? 'Sí' : 'No'}</p>
          <p><span className="font-semibold">Fecha publicación:</span> {news.publishedAt}</p>
        </div>
      </div>
    );
  };

  // Check if the news is saved when component mounts
  useEffect(() => {
    const checkIfSaved = async () => {
      try {
        if (typeof window !== 'undefined') {
          // Get user ID from localStorage
          const userId = localStorage.getItem('userId') || 'anonymous';

          // Check if this news is saved for this user
          const response = await fetch(`/api/news/save?userId=${userId}&newsId=${news.id}`, {
            method: 'GET'
          });
          if (response.ok) {
            const data = await response.json();
            setIsSaved(data.isSaved || false);
          }
        }
      } catch (error) {
        console.error("Error checking if news is saved:", error);
      }
    };
    checkIfSaved();
  }, [news.id]);

  // Verificar si la URL es válida al cargar el componente
  useEffect(() => {
    // Asegurarse de que tenemos una URL de fuente válida como respaldo
    const safeSourceUrl = validateUrl(news.sourceUrl, 'https://www.google.com');

    // Usar la URL de la fuente como respaldo si la URL de la noticia no es válida
    const formattedUrl = validateUrl(news.url, safeSourceUrl);
    setValidUrl(formattedUrl);

    // Verificar si la URL pertenece al mismo dominio que la fuente
    const sameSourceDomain = isSameDomain(formattedUrl, safeSourceUrl);
    setIsCorrectDomain(sameSourceDomain);

    // Verificar accesibilidad de la URL
    const checkUrl = async () => {
      setUrlStatus('checking');
      try {
        // Si es una URL de RSS, asumimos que es válida para evitar problemas de CORS
        if (news.isRssFeed) {
          setUrlStatus('valid');
          return;
        }
        const isAccessible = await checkUrlAccessibility(formattedUrl);
        setUrlStatus(isAccessible ? 'valid' : 'invalid');
      } catch (error) {
        console.error("Error al verificar URL:", error);
        setUrlStatus('invalid');
      }
    };
    checkUrl();
  }, [news.id, news.url, news.sourceUrl, news.isRssFeed]);
  const handleSaveClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Update local state immediately for better UX
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);

    // Get user ID from localStorage or use a default for anonymous users
    const userId = localStorage.getItem('userId') || 'anonymous';
    try {
      if (newSavedState) {
        // Save the news
        await fetch('/api/news/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId,
            newsId: news.id
          })
        });
      } else {
        // Unsave the news
        await fetch(`/api/news/save?userId=${userId}&newsId=${news.id}`, {
          method: 'DELETE'
        });
      }
    } catch (error) {
      console.error("Error saving/unsaving news:", error);
      // Revert state if API call fails
      setIsSaved(!newSavedState);
    }
  };
  
  // Function to share the article
  const handleShareClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Track the share
    try {
      await fetch('/api/news/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          newsId: news.id,
          action: 'share'
        })
      });
    } catch (error) {
      console.error("Error tracking share:", error);
    }
    
    // Use Web Share API if available
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: news.title,
          text: news.description,
          url: news.url
        });
      } catch (error) {
        console.error("Error sharing:", error);
        // Fallback to clipboard
        copyToClipboard();
      }
    } else {
      // Fallback to clipboard
      copyToClipboard();
    }
  };
  
  // Helper function to copy article URL to clipboard
  const copyToClipboard = () => {
    if (typeof navigator !== 'undefined') {
      const url = news.url;
      navigator.clipboard.writeText(url).then(() => {
        // Show a notification
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 transform rounded-md bg-green-600 px-4 py-2 text-sm text-white shadow-lg z-50';
        notification.textContent = 'Enlace copiado al portapapeles';
        document.body.appendChild(notification);
        setTimeout(() => {
          if (notification && notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 3000);
      }).catch(err => {
        console.error('Error copying to clipboard:', err);
      });
    }
  };
  const openNews = () => {
    try {
      // Track the view
      if (typeof window !== 'undefined') {
        // Send view tracking to API
        fetch('/api/news/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            newsId: news.id,
            action: 'view'
          })
        }).catch(error => {
          console.error("Error tracking view:", error);
        });
      }
      
      // Verificar si tenemos una URL original guardada (desde RSS)
      const originalLink = (news as any).originalLink;

      // Intentar usar la URL original primero si existe
      let articleUrl = originalLink ? validateUrl(originalLink, '') : '';

      // Si no hay URL original o no es válida, usar la URL del artículo
      if (!articleUrl) {
        articleUrl = validateUrl(news.url, '');
      }

      // Solo si la URL del artículo es completamente inválida, usar la URL de la fuente como respaldo
      const safeSourceUrl = validateUrl(news.sourceUrl, 'https://www.google.com');

      // Determinar la URL final a usar
      let finalUrl = articleUrl || safeSourceUrl;

      // Si la URL es completamente inválida (ni artículo ni fuente válidos)
      if (!finalUrl || finalUrl.trim() === '') {
        finalUrl = 'https://www.google.com';
      }
      if (typeof window !== 'undefined') {
        // Verificar si la URL es accesible antes de abrirla
        try {
          fetch(finalUrl, {
            method: 'HEAD',
            mode: 'no-cors'
          }).then(() => {
            // La URL parece ser accesible, abrirla
            openUrlInNewTab(finalUrl);
          }).catch(error => {
            console.error("Error verificando URL:", error);
            // Si hay un error al verificar, intentar abrir directamente
            openUrlInNewTab(finalUrl);
          });
        } catch (fetchError) {
          console.error("Error al hacer fetch:", fetchError);
          // Si hay un error con fetch, intentar abrir directamente
          openUrlInNewTab(finalUrl);
        }
      }
    } catch (error) {
      console.error("Error al abrir la URL:", error);
      // Intentar abrir la URL de la fuente como respaldo, o Google como última opción
      try {
        const safeSourceUrl = validateUrl(news.sourceUrl, 'https://www.google.com');
        openUrlInNewTab(safeSourceUrl);
      } catch (finalError) {
        // Si todo falla, abrir Google
        openUrlInNewTab('https://www.google.com');
      }
    }
  };

  // Función auxiliar para abrir URL en nueva pestaña
  const openUrlInNewTab = (url: string) => {
    if (typeof window !== 'undefined') {
      // Mostrar notificación si estamos usando la URL de la fuente como respaldo
      if (url === validateUrl(news.sourceUrl, '') && url !== validateUrl(news.url, '')) {
        try {
          const notification = document.createElement('div');
          notification.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 transform rounded-md bg-amber-600 px-4 py-2 text-sm text-white shadow-lg z-50';
          notification.textContent = 'Enlace del artículo no disponible. Redirigiendo al sitio de la fuente.';
          document.body.appendChild(notification);
          setTimeout(() => {
            if (notification && notification.parentNode) {
              notification.parentNode.removeChild(notification);
            }
          }, 3000);
        } catch (error) {
          console.error("Error showing notification:", error);
        }
      }

      // Abrir la URL en una nueva pestaña
      try {
        window.open(url, '_blank', 'noopener,noreferrer');
      } catch (error) {
        console.error("Error opening URL:", error);
      }
    }
  };
  return <div className="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg dark:bg-slate-800" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={openNews}>
      <div className="relative h-40 w-full overflow-hidden">
        <Image src={news.imageUrl} alt={news.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70"></div>
        
        {showPopularityIndicator && popularityRank !== undefined && (
          <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 font-bold text-white shadow-lg">
            #{popularityRank + 1}
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 w-full p-3">
          <div className="flex items-center gap-2">
            <span className="rounded bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">
              {news.category}
            </span>
            <span className="flex items-center gap-1 text-xs font-medium text-white">
              <Clock size={12} />
              {formatRelativeTime(news.publishedAt)}
            </span>
            {news.isRssFeed && <span className="rounded bg-green-600 px-2 py-0.5 text-xs font-medium text-white">
                RSS
              </span>}
          </div>
        </div>
        
        {/* Removed floating action buttons (save and share) as requested */}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-2">
          <div className="relative h-5 w-5 overflow-hidden rounded-full">
            <Image src={news.source === "Xataka" ? "https://i.imgur.com/8JeVY0z.png" : news.source === "El Androide Libre" ? "https://i.imgur.com/JYzkPaQ.png" : news.source === "Genbeta" ? "https://picsum.photos/200" : news.source === "Hipertextual" ? "https://i.imgur.com/Yp3Qbch.png" : news.source === "MuyComputer" ? "https://i.imgur.com/kHFQS6l.png" : news.source === "FayerWayer" ? "https://i.imgur.com/3sJnJLJ.png" : "https://i.imgur.com/nLLiJXj.png"} alt={news.source} width={20} height={20} className="object-contain" />
          </div>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{news.source}</span>
        </div>

        <h2 className="mb-2 line-clamp-2 flex-1 text-lg font-bold leading-tight text-gray-900 dark:text-white">
          {news.title}
        </h2>

        <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
          {news.description}
        </p>

        <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Eye size={14} />
              <span>{news.views || Math.floor(Math.random() * 1000) + 100}</span>
            </div>
            <button 
              onClick={handleShareClick}
              className="flex items-center gap-1 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
              aria-label="Compartir"
            >
              <Share2 size={14} />
              <span>{news.shares || Math.floor(Math.random() * 100)}</span>
            </button>
          </div>
          <button className={`flex items-center gap-1 ${news.isRssFeed ? 'text-green-600 dark:text-green-500' : urlStatus === 'invalid' || isCorrectDomain === false ? 'text-amber-600 dark:text-amber-500' : 'text-blue-600 dark:text-blue-400'} hover:underline`} onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          openNews();
        }}>
            {!news.isRssFeed && urlStatus === 'checking' && <span className="mr-1 h-3 w-3 animate-pulse rounded-full bg-gray-300 dark:bg-gray-600"></span>}
            {news.isRssFeed && <CheckCircle size={14} className="text-green-600 dark:text-green-500" />}
            {!news.isRssFeed && urlStatus === 'invalid' && <AlertCircle size={14} className="text-amber-600 dark:text-amber-500" />}
            {!news.isRssFeed && urlStatus === 'valid' && isCorrectDomain === false && <AlertCircle size={14} className="text-amber-600 dark:text-amber-500" />}
            {!news.isRssFeed && urlStatus === 'valid' && isCorrectDomain === true && <CheckCircle size={14} className="text-green-600 dark:text-green-500" />}
            <span>Ver artículo</span>
          </button>
        </div>
      </div>
      
      {/* Efecto hover */}
      <div className={`absolute inset-0 bg-black/5 transition-opacity duration-300 dark:bg-white/5 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
      
      {/* Tooltip de estado del enlace - Moved to separate functions to avoid conditional hooks */}
      {isHovered && (
        <>
          {renderRssFeedTooltip()}
          {renderWarningTooltip()}
          {renderDebugPanel()}
        </>
      )}
    </div>;
};
