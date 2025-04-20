import { NextResponse } from "next/server";
import { db, isDatabaseConfigured } from "@/db";
import { news, sources, categories } from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";
import { mockNews } from "@/lib/mock-news";
import { viewsTracker, sharesTracker } from "@/lib/popularity-tracker";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const offset = (page - 1) * limit;
    
    // Check if database is configured
    if (!isDatabaseConfigured()) {
      // Return mock data if database is not configured
      // Calculate popularity scores for mock news
      const popularNews = [...mockNews].map(item => {
        // Get real tracking data if available, otherwise generate random values
        const views = viewsTracker.get(item.id) || Math.floor(Math.random() * 1000);
        const shares = sharesTracker.get(item.id) || Math.floor(Math.random() * 200);
        
        // Calculate popularity score: views + (shares * 2) + recency factor
        const publishDate = new Date(item.publishedAt).getTime();
        const now = Date.now();
        const hoursAgo = (now - publishDate) / (1000 * 60 * 60);
        
        // Recency factor: more recent articles get a boost
        const recencyBoost = Math.max(0, 48 - hoursAgo) * 10;
        
        const popularityScore = views + (shares * 2) + recencyBoost;
        
        return {
          ...item,
          views,
          shares,
          popularityScore
        };
      });
      
      // Sort by popularity score (highest first)
      popularNews.sort((a, b) => b.popularityScore - a.popularityScore);
      
      // Apply pagination
      const paginatedNews = popularNews.slice(offset, offset + limit);
      
      return NextResponse.json({
        news: paginatedNews,
        pagination: {
          total: popularNews.length,
          page,
          limit,
          pages: Math.ceil(popularNews.length / limit)
        }
      });
    }
    
    try {
      // In a real implementation, we would query the database for news items
      // and join with a tracking table to get popularity metrics
      // For now, we'll just return mock data with simulated popularity
      
      // Calculate popularity scores for mock news
      const popularNews = [...mockNews].map(item => {
        // Get real tracking data if available, otherwise generate random values
        const views = viewsTracker.get(item.id) || Math.floor(Math.random() * 1000);
        const shares = sharesTracker.get(item.id) || Math.floor(Math.random() * 200);
        
        // Calculate popularity score: views + (shares * 2) + recency factor
        const publishDate = new Date(item.publishedAt).getTime();
        const now = Date.now();
        const hoursAgo = (now - publishDate) / (1000 * 60 * 60);
        
        // Recency factor: more recent articles get a boost
        const recencyBoost = Math.max(0, 48 - hoursAgo) * 10;
        
        const popularityScore = views + (shares * 2) + recencyBoost;
        
        return {
          ...item,
          views,
          shares,
          popularityScore
        };
      });
      
      // Sort by popularity score (highest first)
      popularNews.sort((a, b) => b.popularityScore - a.popularityScore);
      
      // Apply pagination
      const paginatedNews = popularNews.slice(offset, offset + limit);
      
      return NextResponse.json({
        news: paginatedNews,
        pagination: {
          total: popularNews.length,
          page,
          limit,
          pages: Math.ceil(popularNews.length / limit)
        }
      });
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      // Return mock data when database is unavailable
      return NextResponse.json({
        news: mockNews.slice(0, limit),
        pagination: {
          total: mockNews.length,
          page: 1,
          limit,
          pages: Math.ceil(mockNews.length / limit)
        }
      });
    }
  } catch (error) {
    console.error("Error fetching popular news:", error);
    
    // Return mock data in case of error
    return NextResponse.json({
      news: mockNews.slice(0, 10),
      pagination: {
        total: mockNews.length,
        page: 1,
        limit: 10,
        pages: Math.ceil(mockNews.length / 10)
      }
    });
  }
}
