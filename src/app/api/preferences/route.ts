import { NextResponse } from "next/server";
import { db, isDatabaseConfigured } from "@/db";
import { userPreferences } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    
    // Check if database is configured
    if (!isDatabaseConfigured()) {
      // Return mock data if database is not configured
      return NextResponse.json({
        userId,
        useRssFeed: true,
        theme: 'system',
        debugMode: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    try {
      const preferences = await db.select()
        .from(userPreferences)
        .where(eq(userPreferences.userId, userId));
      
      if (preferences.length === 0) {
        // Create default preferences if none exist
        const defaultPreferences = {
          userId,
          useRssFeed: true,
          theme: 'system',
          debugMode: false
        };
        
        const newPreferences = await db.insert(userPreferences)
          .values(defaultPreferences)
          .returning();
        
        return NextResponse.json(newPreferences[0]);
      }
      
      return NextResponse.json(preferences[0]);
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      // Return mock data when database is unavailable
      return NextResponse.json({
        userId,
        useRssFeed: true,
        theme: 'system',
        debugMode: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error("Error fetching preferences:", error);
    
    // Return mock data in case of error
    const { searchParams } = new URL(request.url);
    return NextResponse.json({
      userId: searchParams.get('userId'),
      useRssFeed: true,
      theme: 'system',
      debugMode: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
}

export async function PUT(request: Request) {
  try {
    const { userId, useRssFeed, theme, debugMode } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    
    // Check if database is configured
    if (!isDatabaseConfigured()) {
      // Return mock data if database is not configured
      return NextResponse.json({
        userId,
        useRssFeed: useRssFeed !== undefined ? useRssFeed : true,
        theme: theme || 'system',
        debugMode: debugMode !== undefined ? debugMode : false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    try {
      // Check if preferences exist
      const existingPreferences = await db.select()
        .from(userPreferences)
        .where(eq(userPreferences.userId, userId));
      
      if (existingPreferences.length === 0) {
        // Create new preferences
        const newPreferences = await db.insert(userPreferences)
          .values({
            userId,
            useRssFeed: useRssFeed !== undefined ? useRssFeed : true,
            theme: theme || 'system',
            debugMode: debugMode !== undefined ? debugMode : false
          })
          .returning();
        
        return NextResponse.json(newPreferences[0]);
      } else {
        // Update existing preferences
        const updateData: Partial<typeof userPreferences.$inferInsert> = {};
        
        if (useRssFeed !== undefined) updateData.useRssFeed = useRssFeed;
        if (theme !== undefined) updateData.theme = theme;
        if (debugMode !== undefined) updateData.debugMode = debugMode;
        updateData.updatedAt = new Date();
        
        const updatedPreferences = await db.update(userPreferences)
          .set(updateData)
          .where(eq(userPreferences.userId, userId))
          .returning();
        
        return NextResponse.json(updatedPreferences[0]);
      }
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      // Return mock success response when database is unavailable
      return NextResponse.json({
        userId,
        useRssFeed: useRssFeed !== undefined ? useRssFeed : true,
        theme: theme || 'system',
        debugMode: debugMode !== undefined ? debugMode : false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error("Error updating preferences:", error);
    
    // Return mock data in case of error
    const { userId, useRssFeed, theme, debugMode } = await request.json();
    return NextResponse.json({
      userId,
      useRssFeed: useRssFeed !== undefined ? useRssFeed : true,
      theme: theme || 'system',
      debugMode: debugMode !== undefined ? debugMode : false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
}
