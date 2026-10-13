import { XMLParser } from "fast-xml-parser";

export type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

export type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string) {

  const response = await fetch(feedURL, {
    headers: {
      'User-agent': 'gator',
      accept: "application/rss+xml",
    },
  });

  if (!response.ok)
    throw new Error(`Failed to fetch XML feed: ${response.status} ${response.statusText}`);

  const xml = await response.text();
  const parser = new XMLParser({ processEntities: false });
  const parsedXML = parser.parse(xml, true);
  const channel = parsedXML.rss?.channel;

  if (!channel)
    throw new Error("Invalid XML: 'channel' field required");

  for (const field of ['title', 'link', 'description'] as const) {
    if (!channel[field])
      throw new Error(`Invalid channel: '${field}' field required`);
  }

  const { title, link, description, item } = channel;

  const rawItems = Array.isArray(item) ? item
    : (typeof item === 'object') ? [item] : [];


  const items: RSSItem[] = [];
  for (const item of rawItems) {
    if (!item.title || !item.link || !item.description || !item.pubDate) continue;
    items.push(item);
  }

  const result: RSSFeed = {
    channel: {
      title,
      link,
      description,
      item: items,
    },
  };

  return result;
}

