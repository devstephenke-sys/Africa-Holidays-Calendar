import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Define the 'users' table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  role: text('role').notNull().default('user'), // 'user' or 'admin'
  createdAt: timestamp('created_at').defaultNow(),
});

// Define relationships for the 'users' table
export const usersRelations = relations(users, ({ many }) => ({
  holidays: many(holidays),
}));

// Define the 'countries' table
export const countries = pgTable('countries', {
  id: serial('id').primaryKey(),
  countryName: text('country_name').notNull().unique(),
  code: text('code').notNull().unique(), // ISO 2-letter country code, e.g. KE, NG
  flag: text('flag'), // Can store an emoji or flag URL or SVG code
  createdAt: timestamp('created_at').defaultNow(),
});

// Define relationships for the 'countries' table
export const countriesRelations = relations(countries, ({ many }) => ({
  holidays: many(holidays),
}));

// Define the 'holidays' table
export const holidays = pgTable('holidays', {
  id: serial('id').primaryKey(),
  countryId: integer('country_id')
    .references(() => countries.id, { onDelete: 'cascade' })
    .notNull(),
  holidayName: text('holiday_name').notNull(),
  date: text('date').notNull(), // Exact date representation, e.g. "2026-10-20" or "20"
  month: text('month').notNull(), // Month name, e.g. "October", or "10"
  year: integer('year').notNull(), // e.g. 2026
  day: text('day').notNull(), // Day of week, e.g. "Monday"
  description: text('description').notNull(), // Description / Reason
  type: text('type').notNull(), // Public, Religious, National, etc.
  isPublic: boolean('is_public').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define relationships for the 'holidays' table
export const holidaysRelations = relations(holidays, ({ one }) => ({
  country: one(countries, {
    fields: [holidays.countryId],
    references: [countries.id],
  }),
}));

// Define the 'ads_positions' table to manage Google Ads positions
export const adsPositions = pgTable('ads_positions', {
  id: serial('id').primaryKey(),
  positionKey: text('position_key').notNull().unique(), // e.g., 'top_banner', 'results_between', 'sidebar', 'footer'
  displayName: text('display_name').notNull(), // e.g., "Top Banner Ad"
  isActive: boolean('is_active').notNull().default(true),
  adClient: text('ad_client').notNull().default('ca-pub-1234567890123456'), // AdSense Client ID
  adSlot: text('ad_slot').notNull().default('1234567890'), // AdSense Slot ID
  adFormat: text('ad_format').notNull().default('auto'), // 'auto', 'rectangle', etc.
  updatedAt: timestamp('updated_at').defaultNow(),
});
