export interface NewsItem {
  id: string;
  title: string;
  description: string;
  content?: string;
  source: string;
  sourceUrl: string;
  imageUrl: string;
  url: string;
  publishedAt: string;
  category: string;
  isRssFeed?: boolean;
  originalLink?: string; // Campo adicional para guardar la URL original sin procesar
  views?: number;        // Number of views
  shares?: number;       // Number of shares
  popularityScore?: number; // Calculated popularity score
}

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  logo: string;
  rssUrl?: string;
}
