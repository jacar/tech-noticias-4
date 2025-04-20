import { NextResponse } from "next/server";
import { db, isDatabaseConfigured } from "@/db";
import { news } from "@/db/schema";
import { eq } from "drizzle-orm";
import { mockDb } from "@/db/mock";

// In-memory storage for tracking when database is not available
const viewsTracker = new Map<string, number>();
const sharesTracker = new Map<string, number>();

export async function POST(request: Request) {
  try {
    const { newsId, action } = await request.json();
    
    if (!newsId) {
      return NextResponse.json(
        { error: "News ID is required" },
        { status: 400 }
      );
    }
    
    if (!['view', 'share'].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'view' or 'share'" },
        { status: 400 }
      );
    }
    
    // Check if database is configured
    if (!isDatabaseConfigured()) {
      // Use in-memory tracking when database is not available
      if (action === 'view') {
        const currentViews = viewsTracker.get(newsId) || 0;
        viewsTracker.set(newsId, currentViews + 1);
      } else if (action === 'share') {
        const currentShares = sharesTracker.get(newsId) || 0;
        sharesTracker.set(newsId, currentShares + 1);
      }
      
      return NextResponse.json({
        success: true,
        newsId,
        action,
        count: action === 'view' ? viewsTracker.get(newsId) : sharesTracker.get(newsId)
      });
    }
    
    try {
      // In a real implementation, we would update the views/shares count in the database
      // For now, we'll just return a success response
      return NextResponse.json({
        success: true,
        newsId,
        action,
        timestamp: new Date().toISOString()
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      // Fall back to in-memory tracking
      if (action === 'view') {
        const currentViews = viewsTracker.get(newsId) || 0;
        viewsTracker.set(newsId, currentViews + 1);
      } else if (action === 'share') {
        const currentShares = sharesTracker.get(newsId) || 0;
        sharesTracker.set(newsId, currentShares + 1);
      }
      
      return NextResponse.json({
        success: true,
        newsId,
        action,
        count: action === 'view' ? viewsTracker.get(newsId) : sharesTracker.get(newsId)
      });
    }
  } catch (error) {
    console.error("Error tracking news action:", error);
    return NextResponse.json(
      { error: "Failed to track news action" },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve tracking stats for a specific news item
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const newsId = searchParams.get('newsId');
    
    if (!newsId) {
      return NextResponse.json(
        { error: "News ID is required" },
        { status: 400 }
      );
    }
    
    // Check if database is configured
    if (!isDatabaseConfigured()) {
      // Use in-memory tracking when database is not available
      const views = viewsTracker.get(newsId) || 0;
      const shares = sharesTracker.get(newsId) || 0;
      
      return NextResponse.json({
        newsId,
        views,
        shares,
        popularity: views + (shares * 2) // Simple popularity formula: views + (shares * 2)
      });
    }
    
    try {
      // In a real implementation, we would query the database for views/shares
      // For now, we'll just return mock data
      const views = viewsTracker.get(newsId) || Math.floor(Math.random() * 1000);
      const shares = sharesTracker.get(newsId) || Math.floor(Math.random() * 200);
      
      return NextResponse.json({
        newsId,
        views,
        shares,
        popularity: views + (shares * 2)
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      // Fall back to in-memory tracking
      const views = viewsTracker.get(newsId) || 0;
      const shares = sharesTracker.get(newsId) || 0;
      
      return NextResponse.json({
        newsId,
        views,
        shares,
        popularity: views + (shares * 2)
      });
    }
  } catch (error) {
    console.error("Error retrieving tracking stats:", error);
    return NextResponse.json(
      { error: "Failed to retrieve tracking stats" },
      { status: 500 }
    );
  }
}
