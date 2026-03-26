import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const links = pgTable('links', {
  id:        uuid('id').primaryKey().defaultRandom(),
  slug:      varchar('slug', { length: 128 }).notNull().unique(),
  targetUrl: text('target_url').notNull(),
  title:     varchar('title', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const telemetry = pgTable('telemetry', {
  id:        uuid('id').primaryKey().defaultRandom(),
  slug:      varchar('slug', { length: 128 }).notNull(),
  ip:        varchar('ip', { length: 64 }),
  country:   varchar('country', { length: 8 }),
  city:      varchar('city', { length: 128 }),
  ua:        text('ua'),
  clickedAt: timestamp('clicked_at').defaultNow().notNull(),
});
