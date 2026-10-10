import { User, Feed } from "./lib/db/schema";

export function printFeed(feed: Feed, user: User) {
  console.log(`Feed: '${feed.name}' '${feed.url} from ${user.name}`);
}
