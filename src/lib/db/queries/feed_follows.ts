import { eq, and } from "drizzle-orm";
import { db } from "..";
import { feed_follows, users, feeds } from "../schema";

export async function createFeedFollow(user_id: string, feed_id: string) {
  const [newFeedFollow] = await db.insert(feed_follows).values({ user_id, feed_id }).returning();
  const [result] = await db.select({
    id: feed_follows.id,
    createdAt: feed_follows.createdAt,
    updatedAt: feed_follows.updatedAt,
    userName: users.name,
    feedName: feeds.name,
  }).from(feed_follows)
    .innerJoin(users, eq(feed_follows.user_id, users.id))
    .innerJoin(feeds, eq(feed_follows.feed_id, feeds.id))
    .where(eq(feed_follows.id, newFeedFollow.id));
  return result;
}

export async function deleteFeedFollow(user_id: string, feed_id: string) {
  const result = await db.delete(feed_follows).where(and(eq(feed_follows.user_id, user_id), eq(feed_follows.feed_id, feed_id))).returning();
  return result;
}

export async function getFeedFollowsForUser(user_id: string) {
  const result = await db.select({
    userName: users.name,
    feedName: feeds.name,
  }).from(feed_follows)
    .innerJoin(users, eq(feed_follows.user_id, users.id))
    .innerJoin(feeds, eq(feed_follows.feed_id, feeds.id))
    .where(eq(feed_follows.user_id, user_id));
  return result;
}

