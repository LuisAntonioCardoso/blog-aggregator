import { pgTable, unique, timestamp, uuid, text } from "drizzle-orm/pg-core";

export type User = typeof users.$inferSelect;
export type Feed = typeof feeds.$inferSelect;

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  name: text("name").unique().notNull(),
});

export const feeds = pgTable("feeds", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  name: text("name").notNull(),
  url: text("url").unique().notNull(),
  user_id: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  last_fetched_at: timestamp("lastFetchedAt"),
});

export const feed_follows = pgTable("feed_follows", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  user_id: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  feed_id: uuid("feed_id").notNull().references(() => feeds.id, { onDelete: "cascade" }),
},
  (entry) => [
    unique("unique_user_feed_pair").on(entry.user_id, entry.feed_id),
  ],
);

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  title: text("title").notNull(),
  url: text("url").unique().notNull(),
  description: text("description"),
  published_at: timestamp("publishedAt").notNull(),
  feed_id: uuid("feed_id").notNull().references(() => feeds.id, { onDelete: "cascade" }),
});
