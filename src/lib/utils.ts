import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Verifica si una URL es válida
 * @param url URL a verificar
 * @returns URL validada o URL de respaldo
 */
export function validateUrl(url: string, fallbackUrl: string = ""): string {
  try {
    // Si la URL está vacía o es undefined, usar el fallback inmediatamente
    if (!url || url.trim() === '') {
      return fallbackUrl || 'https://www.google.com';
    }
    
    // Limpiar la URL de espacios en blanco
    url = url.trim();
    
    // Verificar si la URL comienza con http:// o https://
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    // Manejar URLs relativas que podrían causar errores
    if (url.startsWith('https:///') || url.startsWith('http:///')) {
      url = url.replace(/^(https?:\/\/)\/+/, '$1');
    }
    
    // Intentar crear un objeto URL para validar
    const urlObj = new URL(url);
    
    // Verificar si el dominio parece válido (tiene al menos un punto)
    if (!urlObj.hostname.includes('.')) {
      throw new Error('Dominio inválido');
    }
    
    // Verificar que no sea una URL interna o de protocolo especial
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      throw new Error('Protocolo no soportado');
    }
    
    return urlObj.toString();
  } catch (error) {
    // Si la URL no es válida, devolver la URL de respaldo
    console.error("URL inválida:", url, error);
    return fallbackUrl || 'https://www.google.com';
  }
}

/**
 * Verifica si una URL es accesible realizando una solicitud HEAD
 * @param url URL a verificar
 * @param debug Activa logs de depuración
 * @returns Promise que resuelve a true si la URL es accesible, false en caso contrario
 */
export async function checkUrlAccessibility(url: string, debug = false): Promise<boolean> {
  try {
    // Verificar que la URL es válida antes de intentar acceder
    if (!url || url === 'https://www.google.com') {
      if (debug) console.log(`[DEBUG] URL inválida o es fallback: ${url}`);
      return false;
    }
    
    if (debug) console.log(`[DEBUG] Verificando accesibilidad de: ${url}`);
    
    // Lista de proxies CORS para intentar
    const corsProxies = [
      'https://corsproxy.io/?',
      'https://api.allorigins.win/raw?url=',
      'https://cors-anywhere.herokuapp.com/'
    ];
    
    // Intentar cada proxy hasta que uno funcione
    for (const proxyUrl of corsProxies) {
      try {
        if (debug) console.log(`[DEBUG] Intentando con proxy: ${proxyUrl}`);
        
        const encodedUrl = encodeURIComponent(url);
        
        // Usar timeout para no esperar demasiado
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de timeout
        
        try {
          const response = await fetch(`${proxyUrl}${encodedUrl}`, { 
            method: 'HEAD', // Usar HEAD en lugar de GET para mayor eficiencia
            signal: controller.signal,
            headers: {
              'Accept': 'text/html,application/xhtml+xml,application/xml',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
          });
          
          clearTimeout(timeoutId);
          
          if (debug) console.log(`[DEBUG] Respuesta HEAD: ${response.status} ${response.statusText}`);
          
          // Verificar si la respuesta es exitosa
          if (response.ok) {
            return true;
          }
          
          // Si el servidor no soporta HEAD, intentar con GET
          if (response.status === 405) {
            if (debug) console.log(`[DEBUG] Método HEAD no soportado, intentando GET`);
            
            const controller2 = new AbortController();
            const timeoutId2 = setTimeout(() => controller2.abort(), 5000);
            
            const getResponse = await fetch(`${proxyUrl}${encodedUrl}`, { 
              method: 'GET',
              signal: controller2.signal,
              headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
              }
            });
            
            clearTimeout(timeoutId2);
            
            if (debug) console.log(`[DEBUG] Respuesta GET: ${getResponse.status} ${getResponse.statusText}`);
            
            if (getResponse.ok) {
              return true;
            }
          }
        } catch (fetchError) {
          if (debug) console.log(`[DEBUG] Error con proxy ${proxyUrl}: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`);
          // Continuar con el siguiente proxy
          continue;
        }
      } catch (proxyError) {
        if (debug) console.log(`[DEBUG] Error general con proxy ${proxyUrl}: ${proxyError instanceof Error ? proxyError.message : String(proxyError)}`);
        // Continuar con el siguiente proxy
        continue;
      }
    }
    
    // Si llegamos aquí, todos los proxies fallaron
    if (debug) console.log(`[DEBUG] Todos los proxies fallaron para: ${url}`);
    
    // Último intento: verificar si la URL responde sin proxy (solo funcionará para URLs que no tengan problemas de CORS)
    try {
      if (debug) console.log(`[DEBUG] Intentando verificar sin proxy (puede fallar por CORS)`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      // Usamos fetch con mode: 'no-cors' para evitar errores CORS
      // Esto siempre devuelve una respuesta "opaque" que no podemos inspeccionar
      // pero al menos podemos detectar si la solicitud se completa sin error
      await fetch(url, { 
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Si llegamos aquí sin error, asumimos que la URL es accesible
      if (debug) console.log(`[DEBUG] La URL parece responder sin proxy`);
      return true;
    } catch (directError) {
      if (debug) console.log(`[DEBUG] Error al verificar sin proxy: ${directError instanceof Error ? directError.message : String(directError)}`);
      return false;
    }
  } catch (error) {
    console.error("Error al verificar accesibilidad de URL:", url, error);
    if (debug) console.log(`[DEBUG] Error general: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

/**
 * Extrae el dominio de una URL
 * @param url URL completa
 * @returns Dominio de la URL (ej: 'example.com')
 */
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (error) {
    return '';
  }
}

/**
 * Verifica si dos URLs pertenecen al mismo dominio
 * @param url1 Primera URL
 * @param url2 Segunda URL
 * @returns true si ambas URLs pertenecen al mismo dominio
 */
export function isSameDomain(url1: string, url2: string): boolean {
  try {
    const domain1 = extractDomain(url1);
    const domain2 = extractDomain(url2);
    
    if (!domain1 || !domain2) return false;
    
    // Manejar casos especiales como subdomains.example.com vs example.com
    const getDomainParts = (domain: string) => {
      const parts = domain.split('.');
      // Si tiene al menos 3 partes (subdominio.dominio.tld)
      if (parts.length >= 3) {
        // Obtener las últimas 2 partes (dominio.tld)
        return parts.slice(-2).join('.');
      }
      return domain;
    };
    
    const baseDomain1 = getDomainParts(domain1);
    const baseDomain2 = getDomainParts(domain2);
    
    // Casos especiales para dominios comunes
    const specialCases: Record<string, string[]> = {
      'elespanol.com': ['elandroidelibre.elespanol.com'],
      'weblogssl.com': ['xataka.com', 'genbeta.com']
    };
    
    // Verificar casos especiales
    for (const [mainDomain, relatedDomains] of Object.entries(specialCases)) {
      if ((baseDomain1 === mainDomain && relatedDomains.includes(baseDomain2)) || 
          (baseDomain2 === mainDomain && relatedDomains.includes(baseDomain1))) {
        return true;
      }
    }
    
    return baseDomain1 === baseDomain2;
  } catch (error) {
    console.error("Error al comparar dominios:", error);
    return false;
  }
}
