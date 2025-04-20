import { db } from '@/db';
import { sources, categories, news } from '@/db/schema';
import { newsSources } from '@/lib/news-sources';
import { mockNews } from '@/lib/mock-news';

async function seedDatabase() {
  console.log('Seeding database...');
  
  try {
    // Insert sources
    console.log('Inserting sources...');
    const sourceInserts = await Promise.all(
      newsSources.map(async (source) => {
        return db.insert(sources).values({
          name: source.name,
          url: source.url,
          logo: source.logo,
          rssUrl: source.rssUrl,
        }).returning();
      })
    );
    
    // Create a map of source names to IDs
    const sourceMap = new Map<string, number>();
    sourceInserts.forEach(insertResult => {
      if (insertResult[0]) {
        sourceMap.set(insertResult[0].name, insertResult[0].id);
      }
    });
    
    // Insert categories
    console.log('Inserting categories...');
    const uniqueCategories = [...new Set(mockNews.map(item => item.category))];
    const categoryInserts = await Promise.all(
      uniqueCategories.map(async (categoryName) => {
        return db.insert(categories).values({
          name: categoryName,
        }).returning();
      })
    );
    
    // Create a map of category names to IDs
    const categoryMap = new Map<string, number>();
    categoryInserts.forEach(insertResult => {
      if (insertResult[0]) {
        categoryMap.set(insertResult[0].name, insertResult[0].id);
      }
    });
    
    // Insert news
    console.log('Inserting news...');
    await Promise.all(
      mockNews.map(async (item) => {
        const sourceId = sourceMap.get(item.source);
        const categoryId = categoryMap.get(item.category);
        
        if (!sourceId) {
          console.warn(`Source not found for: ${item.source}`);
          return;
        }
        
        return db.insert(news).values({
          title: item.title,
          description: item.description,
          sourceId: sourceId,
          imageUrl: item.imageUrl,
          url: item.url,
          publishedAt: new Date(item.publishedAt),
          categoryId: categoryId || null,
          isRssFeed: false,
          originalLink: item.url,
        });
      })
    );
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run the seed function
seedDatabase();
