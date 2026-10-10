import { eq } from "drizzle-orm";
import { db } from "..";
import { feeds } from "../schema";

export async function createFeed(name: string, url: string, user_id: string) {
  const [result] = await db.insert(feeds).values({ name, url, user_id }).returning();
  return result;
}

export async function getFeedByUser(userId: string) {
  return await db.query.feeds.findMany({
    where: eq(feeds.user_id, userId),
  });
}
