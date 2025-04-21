import Parser from 'rss-parser';
import { NewsItem } from '@/types';
import { validateUrl } from './utils';
import { newsSources } from './news-sources';
import { ApiError } from './api-error';

// Define custom fields for the RSS parser
type CustomFeed = {
  title: string;
  description: string;
  link: string;
  image: {
    url: string;
  };
};

type CustomItem = {
  title: string;
  link: string;
  content: string;
  contentSnippet: string;
  pubDate: string;
  creator?: string;
  'media:content'?: {
    $: {
      url: string;
      medium: string;
    };
  };
  enclosure?: {
    url: string;
  };
  'media:thumbnail'?: {
    $: {
      url: string;
    };
  };
};

// Create a new parser instance with custom fields
const parser = new Parser<CustomFeed, CustomItem>({
  customFields: {
    item: [
      'media:content',
      'media:thumbnail',
      'enclosure',
      'creator',
      'content',
      'contentSnippet',
    ],
  },
  timeout: 10000, // Increase timeout to 10 seconds
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml, text/html, */*'
  },
  defaultRSS: 2.0,
  maxRedirects: 5,
});

// RSS feed URLs for each source
const rssFeedUrls: Record<string, string> = {
  xataka: 'https://feeds.weblogssl.com/xataka2',
  elandroidelibre: 'https://feeds.weblogssl.com/elandroidelibre',
  genbeta: 'https://feeds.weblogssl.com/genbeta',
  hipertextual: 'https://hipertextual.com/feed',
  muycomputer: 'https://www.muycomputer.com/feed/',
  fayerwayer: 'https://www.fayerwayer.com/feed/',
  wwwhatsnew: 'https://wwwhatsnew.com/feed/',
  wired: 'https://es.wired.com/feed/gadgets/rss',
  'eltiempo-tecnosfera': 'https://www.eltiempo.com/rss/tecnosfera.xml',
  'eltiempo-novedades': 'https://www.eltiempo.com/rss/tecnosfera_novedades-tecnologia.xml',
  'eltiempo-videojuegos': 'https://www.eltiempo.com/rss/tecnosfera_videojuegos.xml',
  techcrunch: 'https://techcrunch.com/feed/',
  'engadget-es': 'https://es.engadget.com/rss.xml',
  computerhoy: 'https://computerhoy.com/rss',
  'xataka-mexico': 'https://www.xataka.com.mx/sitemap-news',
  muycomputerpro: 'https://www.muycomputerpro.com/feed',
  cincodias: 'https://cincodias.elpais.com/seccion/rss/tecnologia/',
  arstechnica: 'https://feeds.arstechnica.com/arstechnica/index',
  applesfera: 'https://feeds.weblogssl.com/applesfera',
  microsiervos: 'https://www.microsiervos.com/index.xml',
  adslzone: 'https://www.adslzone.net/feed/',
};

/**
 * Normalize image URLs (handle protocol-relative URLs)
 */
function normalizeImageUrl(url: string): string {
  if (url.startsWith('//')) return 'https:' + url;
  return url;
}

/**
 * Extract image URL from various RSS feed formats
 */
function extractImageUrl(item: CustomItem): string {
  // Try to get image from media:content
  if (item['media:content'] && item['media:content'].$.url) {
    return normalizeImageUrl(item['media:content'].$.url);
  }
  
  // Try to get image from media:thumbnail
  if (item['media:thumbnail'] && item['media:thumbnail'].$.url) {
    return normalizeImageUrl(item['media:thumbnail'].$.url);
  }
  
  // Try to get image from enclosure
  if (item.enclosure && item.enclosure.url) {
    return normalizeImageUrl(item.enclosure.url);
  }
  
  // Try to extract first image from content if available
  if (item.content) {
    const imgRegex = /<img[^>]+src="([^">]+)"/;
    const match = item.content.match(imgRegex);
    if (match && match[1]) {
      return normalizeImageUrl(match[1]);
    }
  }
  
  // Default image if nothing found
  return normalizeImageUrl('https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop');
}

/**
 * Extract a description from the content
 */
function extractDescription(item: CustomItem): string {
  // Use contentSnippet if available
  if (item.contentSnippet) {
    return item.contentSnippet.substring(0, 150) + '...';
  }
  
  // Otherwise try to extract text from content
  if (item.content) {
    const textContent = item.content
      .replace(/<[^>]+>/g, ' ') // Remove HTML tags
      .replace(/\s+/g, ' ')     // Normalize whitespace
      .trim();
    
    return textContent.substring(0, 150) + '...';
  }
  
  return 'No description available';
}

/**
 * Determine category based on content analysis
 */
function determineCategory(item: CustomItem): string {
  const content = (item.title + ' ' + (item.contentSnippet || '')).toLowerCase();
  
  const categoryMap: Record<string, string[]> = {
    'Inteligencia Artificial': ['ia', 'inteligencia artificial', 'machine learning', 'ml', 'ai', 'chatgpt', 'gpt', 'llm'],
    'Hardware': ['hardware', 'procesador', 'cpu', 'gpu', 'chip', 'memoria', 'ram', 'ssd'],
    'Software': ['software', 'aplicación', 'app', 'programa', 'windows', 'macos', 'linux', 'android', 'ios'],
    'Dispositivos': ['móvil', 'smartphone', 'tablet', 'portátil', 'laptop', 'gadget', 'wearable', 'reloj'],
    'Telecomunicaciones': ['5g', '4g', 'wifi', 'internet', 'red', 'telecomunicaciones', 'fibra'],
    'Blockchain': ['blockchain', 'bitcoin', 'ethereum', 'criptomoneda', 'crypto', 'nft'],
    'Ciberseguridad': ['seguridad', 'ciberseguridad', 'hacker', 'malware', 'virus', 'ransomware', 'phishing'],
    'Innovación': ['innovación', 'startup', 'emprendimiento', 'investigación', 'desarrollo'],
    'Videojuegos': ['juego', 'videojuego', 'gaming', 'consola', 'playstation', 'xbox', 'nintendo'],
    'Fintech': ['fintech', 'finanzas', 'banco', 'pago', 'transferencia', 'economía']
  };
  
  for (const [category, keywords] of Object.entries(categoryMap)) {
    if (keywords.some(keyword => content.includes(keyword))) {
      return category;
    }
  }
  
  return 'Tecnología';
}

/**
 * Fetch news from RSS feeds
 */
// Export rssFeedUrls for use in other components
export { rssFeedUrls };

export async function fetchRssNews(sourceId?: string, debugMode = false): Promise<NewsItem[]> {
  try {
    const sources = sourceId 
      ? [sourceId] 
      : Object.keys(rssFeedUrls);
    
    const allNews: NewsItem[] = [];
    const errors: Error[] = [];
    
    if (debugMode) {
      console.log(`[DEBUG] Fetching RSS feeds for sources: ${sources.join(', ')}`);
    }
    
    // Try multiple CORS proxies in case one fails
    const corsProxies = [
      'https://corsproxy.io/?',
      'https://api.allorigins.win/raw?url='
    ];
    
    for (const source of sources) {
      if (!rssFeedUrls[source]) {
        if (debugMode) console.log(`[DEBUG] No RSS URL found for source: ${source}`);
        continue;
      }
      
      let success = false;
      let lastError: Error | null = null;
      
      // Try each proxy until one works
      for (const proxyUrl of corsProxies) {
        if (success) break;
        
        try {
          if (debugMode) {
            console.log(`[DEBUG] Trying to fetch ${source} with proxy: ${proxyUrl}`);
          }
          
          const feedUrl = rssFeedUrls[source];
          
          // Add cache-busting parameters
          const timestamp = Date.now();
          const urlWithTimestamp = `${feedUrl}${feedUrl.includes('?') ? '&' : '?'}_t=${timestamp}`;
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
          
          const response = await fetch(`${proxyUrl}${urlWithTimestamp}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml, text/html, */*',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            signal: controller.signal,
            cache: 'no-store',
            next: { revalidate: 300 } // Revalidate every 5 minutes
          });
          
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            throw ApiError.fromResponse(response);
          }
          
          const xmlText = await response.text();
          if (!xmlText || xmlText.trim() === '') {
            throw new ApiError(`Empty response from ${source} RSS feed`, 500);
          }
          
          if (debugMode) {
            console.log(`[DEBUG] Successfully fetched XML for ${source}, length: ${xmlText.length} chars`);
          }
          
          const feed = await parser.parseString(xmlText);
          
          if (debugMode) {
            console.log(`[DEBUG] Parsed feed for ${source}, found ${feed.items.length} items`);
          }
          
          const sourceInfo = newsSources.find(s => s.id === source);
          if (!sourceInfo) {
            if (debugMode) console.log(`[DEBUG] No source info found for: ${source}`);
            continue;
          }
          
          const sourceNews = feed.items.map((item, index) => {
            const imageUrl = extractImageUrl(item);
            const description = extractDescription(item);
            const category = determineCategory(item);
            
            // Ensure the link is valid and handle relative URLs
            let itemLink = item.link || '';
            
            if (debugMode && !itemLink) {
              console.log(`[DEBUG] No link found for item ${index} in ${source}`);
            }
            
            // Handle relative URLs
            if (itemLink && !itemLink.startsWith('http')) {
              // If it's an absolute path starting with /
              if (itemLink.startsWith('/')) {
                const sourceUrlObj = new URL(sourceInfo.url);
                itemLink = `${sourceUrlObj.protocol}//${sourceUrlObj.host}${itemLink}`;
                if (debugMode) console.log(`[DEBUG] Converted absolute path to: ${itemLink}`);
              } else {
                // If it's a relative path
                try {
                  itemLink = new URL(itemLink, sourceInfo.url).toString();
                  if (debugMode) console.log(`[DEBUG] Converted relative path to: ${itemLink}`);
                } catch (e) {
                  console.error(`Invalid URL: ${itemLink} relative to ${sourceInfo.url}`);
                  itemLink = sourceInfo.url; // Fallback to source URL
                  if (debugMode) console.log(`[DEBUG] Invalid URL, using fallback: ${itemLink}`);
                }
              }
            }
            
            const validatedUrl = validateUrl(itemLink, sourceInfo.url);
            
            if (debugMode && validatedUrl !== itemLink) {
              console.log(`[DEBUG] URL validation changed: ${itemLink} -> ${validatedUrl}`);
            }
            
            return {
              id: `${source}-${index}-${Date.now()}`,
              title: item.title || 'Sin título',
              description,
              source: sourceInfo.name,
              sourceUrl: sourceInfo.url,
              imageUrl,
              url: validatedUrl,
              publishedAt: item.pubDate || new Date().toISOString(),
              category,
              originalLink: itemLink // Save original link for debugging
            };
          });
          
          allNews.push(...sourceNews);
          success = true;
          
          if (debugMode) {
            console.log(`[DEBUG] Successfully added ${sourceNews.length} items from ${source}`);
          }
          
          // Break the proxy loop since we succeeded
          break;
          
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(`Unknown error fetching ${source}`);
          console.error(`Error fetching RSS for ${source} with proxy ${proxyUrl}:`, error);
          
          if (debugMode) {
            console.log(`[DEBUG] Failed to fetch ${source} with proxy ${proxyUrl}: ${lastError.message}`);
          }
          
          // Continue to the next proxy
        }
      }
      
      // If all proxies failed, add the error
      if (!success && lastError) {
        errors.push(lastError);
      }
    }
    
    // If we couldn't fetch any news and have errors, throw the first error
    if (allNews.length === 0 && errors.length > 0) {
      if (debugMode) {
        console.log(`[DEBUG] No news fetched. Errors: ${errors.map(e => e.message).join(', ')}`);
      }
      
      if (errors[0] instanceof ApiError) {
        throw errors[0];
      } else {
        throw new ApiError('Error al obtener noticias RSS', 500);
      }
    }
    
    // Sort by date (newest first)
    const sortedNews = allNews.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    
    if (debugMode) {
      console.log(`[DEBUG] Returning ${sortedNews.length} total news items`);
    }
    
    return sortedNews;
  } catch (error) {
    console.error('Error fetching RSS feeds:', error);
    
    if (debugMode) {
      console.log(`[DEBUG] Fatal error in fetchRssNews: ${error instanceof Error ? error.message : String(error)}`);
      console.log(`[DEBUG] Stack trace: ${error instanceof Error ? error.stack : 'No stack trace'}`);
    }
    
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw new ApiError('Error al obtener noticias RSS', 500);
    }
  }
}
