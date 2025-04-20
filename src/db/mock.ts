import { mockNews } from "@/lib/mock-news";
import { newsSources } from "@/lib/news-sources";

// Mock database functions for when real database is unavailable
export const mockDb = {
  // Mock saved news data
  savedNews: new Map<string, Set<string>>(),
  
  // Mock user preferences
  userPreferences: new Map<string, any>(),
  
  // Get saved news for a user
  getSavedNews(userId: string): string[] {
    return Array.from(this.savedNews.get(userId) || new Set());
  },
  
  // Save news for a user
  saveNews(userId: string, newsId: string | number): void {
    if (!this.savedNews.has(userId)) {
      this.savedNews.set(userId, new Set());
    }
    this.savedNews.get(userId)?.add(String(newsId));
  },
  
  // Unsave news for a user
  unsaveNews(userId: string, newsId: string | number): void {
    if (this.savedNews.has(userId)) {
      this.savedNews.get(userId)?.delete(String(newsId));
    }
  },
  
  // Check if news is saved for a user
  isNewsSaved(userId: string, newsId: string | number): boolean {
    return this.savedNews.get(userId)?.has(String(newsId)) || false;
  },
  
  // Get user preferences
  getUserPreferences(userId: string): any {
    if (!this.userPreferences.has(userId)) {
      // Create default preferences
      const defaultPrefs = {
        userId,
        useRssFeed: true,
        theme: 'system',
        debugMode: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.userPreferences.set(userId, defaultPrefs);
      return defaultPrefs;
    }
    return this.userPreferences.get(userId);
  },
  
  // Update user preferences
  updateUserPreferences(userId: string, updates: any): any {
    const currentPrefs = this.getUserPreferences(userId);
    const updatedPrefs = {
      ...currentPrefs,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.userPreferences.set(userId, updatedPrefs);
    return updatedPrefs;
  },
  
  // Get news with filtering
  getNews(category?: string | null, source?: string | null): any[] {
    let filteredNews = [...mockNews];
    
    if (category) {
      filteredNews = filteredNews.filter(item => item.category === category);
    }
    
    if (source) {
      filteredNews = filteredNews.filter(item => item.source === source);
    }
    
    // Sort by most recent date
    filteredNews = filteredNews.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    
    return filteredNews;
  },
  
  // Get sources
  getSources(): any[] {
    return newsSources;
  },
  
  // Get categories
  getCategories(): string[] {
    return [...new Set(mockNews.map(item => item.category))];
  }
};
