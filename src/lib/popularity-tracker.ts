// In-memory storage for tracking article views and shares
export const viewsTracker = new Map<string, number>();
export const sharesTracker = new Map<string, number>();

// Function to track a view
export function trackView(newsId: string): void {
  const currentViews = viewsTracker.get(newsId) || 0;
  viewsTracker.set(newsId, currentViews + 1);
}

// Function to track a share
export function trackShare(newsId: string): void {
  const currentShares = sharesTracker.get(newsId) || 0;
  sharesTracker.set(newsId, currentShares + 1);
}

// Function to get popularity score for a news item
export function getPopularityScore(newsId: string): number {
  const views = viewsTracker.get(newsId) || 0;
  const shares = sharesTracker.get(newsId) || 0;
  
  // Simple popularity formula: views + (shares * 2)
  return views + (shares * 2);
}

// Function to get all popularity metrics for a news item
export function getPopularityMetrics(newsId: string): { views: number; shares: number; score: number } {
  const views = viewsTracker.get(newsId) || 0;
  const shares = sharesTracker.get(newsId) || 0;
  const score = views + (shares * 2);
  
  return { views, shares, score };
}

// Function to get top news IDs by popularity
export function getTopNewsByPopularity(limit: number = 10): string[] {
  // Create an array of [newsId, score] pairs
  const newsScores: [string, number][] = [];
  
  // Process views
  viewsTracker.forEach((views, newsId) => {
    const shares = sharesTracker.get(newsId) || 0;
    const score = views + (shares * 2);
    newsScores.push([newsId, score]);
  });
  
  // Add news items that have shares but no views
  sharesTracker.forEach((shares, newsId) => {
    if (!viewsTracker.has(newsId)) {
      const score = shares * 2;
      newsScores.push([newsId, score]);
    }
  });
  
  // Sort by score (descending)
  newsScores.sort((a, b) => b[1] - a[1]);
  
  // Return the top N news IDs
  return newsScores.slice(0, limit).map(([newsId]) => newsId);
}
