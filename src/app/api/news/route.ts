import { NextResponse } from "next/server";
import { db, isDatabaseConfigured } from "@/db";
import { news, sources, categories } from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";
import { mockNews } from "@/lib/mock-news";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get('category');
    const sourceParam = searchParams.get('source');
    
    // Check if database is configured
    if (!isDatabaseConfigured()) {
      // Return mock data if database is not configured
      let filteredNews = [...mockNews];
      
      if (categoryParam) {
        filteredNews = filteredNews.filter(item => item.category === categoryParam);
      }
      
      if (sourceParam) {
        filteredNews = filteredNews.filter(item => item.source === sourceParam);
      }
      
      // Sort by most recent date
      filteredNews = filteredNews.sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
      
      return NextResponse.json(filteredNews.slice(0, 10));
    }
    
    try {
      // Build conditions array
      const conditions = [];
      
      if (categoryParam) {
        conditions.push(eq(categories.name, categoryParam));
      }
      
      if (sourceParam) {
        conditions.push(eq(sources.name, sourceParam));
      }
      
      // Build the query with filters
      let queryBuilder = db.select().from(news)
        .leftJoin(sources, eq(news.sourceId, sources.id))
        .leftJoin(categories, eq(news.categoryId, categories.id));
      
      // Apply all conditions if any exist
      if (conditions.length > 0) {
        const whereCondition = conditions.length === 1 ? conditions[0] : and(...conditions);
        // Use type assertion to help TypeScript understand the query builder type
        queryBuilder = (queryBuilder as any).where(whereCondition);
      }
      
      // Execute the query
      const newsItems = await queryBuilder.orderBy(desc(news.publishedAt)).limit(10);
      
      return NextResponse.json(newsItems);
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      // Return mock data when database is unavailable
      let filteredNews = [...mockNews];
      
      if (categoryParam) {
        filteredNews = filteredNews.filter(item => item.category === categoryParam);
      }
      
      if (sourceParam) {
        filteredNews = filteredNews.filter(item => item.source === sourceParam);
      }
      
      // Sort by most recent date
      filteredNews = filteredNews.sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
      
      return NextResponse.json(filteredNews.slice(0, 10));
    }
  } catch (error) {
    console.error("Error fetching news:", error);
    
    // Return mock data in case of error
    let filteredNews = [...mockNews];
    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get('category');
    const sourceParam = searchParams.get('source');
    
    if (categoryParam) {
      filteredNews = filteredNews.filter(item => item.category === categoryParam);
    }
    
    if (sourceParam) {
      filteredNews = filteredNews.filter(item => item.source === sourceParam);
    }
    
    // Sort by most recent date
    filteredNews = filteredNews.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    
    return NextResponse.json(filteredNews.slice(0, 10));
  }
}
