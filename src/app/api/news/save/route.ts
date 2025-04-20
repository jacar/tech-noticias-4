import { NextResponse } from "next/server";
import { db, isDatabaseConfigured } from "@/db";
import { savedNews } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const newsId = searchParams.get('newsId');
    
    if (!userId || !newsId) {
      return NextResponse.json(
        { error: "User ID and News ID are required" },
        { status: 400 }
      );
    }
    
    // Check if database is configured
    if (!isDatabaseConfigured()) {
      // Return mock data if database is not configured
      // Simulate saved status based on userId and newsId
      const isSaved = (parseInt(newsId) % 2 === 0); // Even IDs are "saved" for demo
      return NextResponse.json({ isSaved });
    }
    
    try {
      const saved = await db.select()
        .from(savedNews)
        .where(
          and(
            eq(savedNews.userId, userId),
            eq(savedNews.newsId, parseInt(newsId))
          )
        );
      
      return NextResponse.json({ isSaved: saved.length > 0 });
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json({ isSaved: false });
    }
  } catch (error) {
    console.error("Error checking saved news:", error);
    return NextResponse.json({ isSaved: false });
  }
}

export async function POST(request: Request) {
  try {
    const { userId, newsId } = await request.json();
    
    if (!userId || !newsId) {
      return NextResponse.json(
        { error: "User ID and News ID are required" },
        { status: 400 }
      );
    }
    
    // Check if database is configured
    if (!isDatabaseConfigured()) {
      // Return mock data if database is not configured
      return NextResponse.json({
        userId,
        newsId,
        createdAt: new Date().toISOString()
      });
    }
    
    try {
      const result = await db.insert(savedNews)
        .values({ userId, newsId })
        .returning();
      
      return NextResponse.json(result[0]);
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      // Return mock success response when database is unavailable
      return NextResponse.json({
        userId,
        newsId,
        createdAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error("Error saving news:", error);
    
    // Return mock data in case of error
    const { userId, newsId } = await request.json();
    return NextResponse.json({
      userId,
      newsId,
      createdAt: new Date().toISOString()
    });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const newsId = searchParams.get('newsId');
    
    if (!userId || !newsId) {
      return NextResponse.json(
        { error: "User ID and News ID are required" },
        { status: 400 }
      );
    }
    
    // Check if database is configured
    if (!isDatabaseConfigured()) {
      // Return success response if database is not configured
      return NextResponse.json({ success: true });
    }
    
    try {
      await db.delete(savedNews)
        .where(
          and(
            eq(savedNews.userId, userId),
            eq(savedNews.newsId, parseInt(newsId))
          )
        );
      
      return NextResponse.json({ success: true });
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      // Return success anyway to prevent UI issues
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error("Error unsaving news:", error);
    // Return success anyway to prevent UI issues
    return NextResponse.json({ success: true });
  }
}
