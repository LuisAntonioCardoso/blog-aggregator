import { getNextFeedToFetch, markFeedToFetch } from "./lib/db/queries/feed";
import { User, Feed } from "./lib/db/schema";
import { fetchFeed } from "./xml";

export function printFeed(feed: Feed, user: User) {
  console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.createdAt}`);
  console.log(`* Updated:       ${feed.updatedAt}`);
  console.log(`* name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
}

export async function scrapeFeeds() {
  const feed = await getNextFeedToFetch();
  if (!feed)
    throw new Error(`No feeds added to fetch`);

  const fetchedFeed = await fetchFeed(feed.url);
  if (!fetchedFeed) {
    console.error(`Failed attempt to fetch feed ${feed.name} at ${feed.url}`);
    return;
  }

  const marked = await markFeedToFetch(feed.id);
  if (!marked)
    throw new Error(`Failed to fetch feed "${feed.name}" at ${feed.url}`);

  for (const item of fetchedFeed.channel.item) {
    console.log(item.title);
  }
}

export function parseDuration(durationStr: string): [string, number] {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);

  if (!match)
    throw new Error(`Duration badly formated. usage: <value><unit>`);

  const captured = match[0];
  const value = Number(match[1]);
  const unit = match[2];

  switch (unit) {
    case 'ms':
      return [captured, value];
    case 's':
      return [captured, value * 1000];
    case 'm':
      return [captured, value * 1000 * 60];
    case 'h':
      return [captured, value * 1000 * 60 * 60];
  }
  throw new Error('Parse wrong unit');
}
