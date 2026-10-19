import { desc } from "drizzle-orm";
import { db } from "..";
import { posts } from "../schema";

type NewPost = Omit<
  typeof posts.$inferInsert,
  "id" | "createdAt" | "updatedAt"
>;

export async function createPost(data: NewPost) {
  const [post] = await db.insert(posts).values(data).returning();
  return post;
}

export async function getPostForUser(postNumber: number = 5) {
  return await db.select().from(posts).orderBy(desc(posts.published_at)).limit(postNumber);
}
