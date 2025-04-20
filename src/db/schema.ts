import { pgTable, serial, text, timestamp, integer, boolean, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

// News sources table
export const sources = pgTable('sources', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  url: text('url').notNull(),
  logo: text('logo').notNull(),
  rssUrl: text('rss_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Categories table
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// News items table
export const news = pgTable('news', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  content: text('content'),
  sourceId: integer('source_id').notNull().references(() => sources.id),
  imageUrl: text('image_url').notNull(),
  url: text('url').notNull(),
  publishedAt: timestamp('published_at').notNull(),
  categoryId: integer('category_id').references(() => categories.id),
  isRssFeed: boolean('is_rss_feed').default(false),
  originalLink: text('original_link'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// User saved news table
export const savedNews = pgTable('saved_news', {
  userId: text('user_id').notNull(),
  newsId: integer('news_id').notNull().references(() => news.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  primaryKey({ columns: [table.userId, table.newsId] }),
]);

// User preferences table
export const userPreferences = pgTable('user_preferences', {
  userId: text('user_id').primaryKey(),
  useRssFeed: boolean('use_rss_feed').default(true),
  theme: text('theme').default('system'),
  debugMode: boolean('debug_mode').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Define relations
export const sourcesRelations = relations(sources, ({ many }) => ({
  news: many(news),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  news: many(news),
}));

export const newsRelations = relations(news, ({ one }) => ({
  source: one(sources, {
    fields: [news.sourceId],
    references: [sources.id],
  }),
  category: one(categories, {
    fields: [news.categoryId],
    references: [categories.id],
  }),
}));

// Define types for select, insert, and update operations
export type Source = InferSelectModel<typeof sources>;
export type NewSource = InferInsertModel<typeof sources>;

export type Category = InferSelectModel<typeof categories>;
export type NewCategory = InferInsertModel<typeof categories>;

export type NewsItem = InferSelectModel<typeof news>;
export type NewNewsItem = InferInsertModel<typeof news>;

export type SavedNews = InferSelectModel<typeof savedNews>;
export type NewSavedNews = InferInsertModel<typeof savedNews>;

export type UserPreference = InferSelectModel<typeof userPreferences>;
export type NewUserPreference = InferInsertModel<typeof userPreferences>;
