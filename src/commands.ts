import { printFeed } from './aux';
import { readConfig, setUser } from './config';
import { createFeed, getFeedByUser } from './lib/db/queries/feed';
import { createUser, getAllUsers, getUser, resetUsers } from './lib/db/queries/users';
import { fetchFeed } from './xml';

type CommandHandler = (commandName: string, ...agrs: string[]) => Promise<void>;
export type CommandRegistry = Record<string, CommandHandler>;

export function registerCommand(registry: CommandRegistry, commandName: string, handler: CommandHandler) {
  registry[commandName] = handler;
}

export async function runCommand(registry: CommandRegistry, commandName: string, ...args: string[]) {
  const handler = registry[commandName];
  if (!handler)
    throw new Error(`Unknown command: ${commandName}`);

  await handler(commandName, ...args);
}

export async function handlerLogin(commandName: string, ...args: string[]) {
  if (args.length !== 1)
    throw new Error(`${commandName} command usage: ${commandName} <name>`);
  const username = args[0];

  let user = await getUser(username);
  if (!user)
    throw new Error(`User ${username} not registered`);

  setUser(username);
  console.log(`User ${username} has been set`);
}

export async function handlerRegister(commandName: string, ...args: string[]) {
  if (args.length !== 1)
    throw new Error(`${commandName} command usage: ${commandName} <name>`);
  const username = args[0];

  let user = await getUser(username);
  if (user)
    throw new Error(`User ${username} already exist`);

  const newUser = await createUser(username);
  if (!newUser)
    throw new Error(`Failed creating user ${username}`);

  setUser(newUser.name);
  console.log(`User ${username} created successfully`);
}

export async function handlerReset(_: string) {
  await resetUsers();
  console.log('Database reset successfully!');
}

export async function handlerUsers(_: string) {
  const allUsers = await getAllUsers();
  const currentUser = readConfig().currentUserName;

  for (const user of allUsers) {
    if (user.name === currentUser) {
      console.log(`* ${user.name} (current)`);
      continue;
    }
    console.log(`* ${user.name}`);
  }
}

export async function handlerAgg(_: string) {
  console.log(JSON.stringify(await fetchFeed("https://www.wagslane.dev/index.xml"), null, 2));
}

export async function handlerAddFeed(commandName: string, ...args: string[]) {
  if (args.length !== 2)
    throw new Error(`${commandName} command usage: ${commandName} <name> <url>`);
  const [name, url] = args;

  const user = await getUser(readConfig().currentUserName);
  if (!user)
    throw new Error(`Failed to get current user from DB`);

  const feed = await createFeed(name, url, user.id);
  if (!feed)
    throw new Error(`Failed to create feed`);

  console.log(`Feed created successfully`);
  printFeed(feed, user);
}

export async function handlerListFeeds(_: string) {
  const users = await getAllUsers();
  let printed = false;
  for (const user of users) {
    const feeds = await getFeedByUser(user.id);
    for (const feed of feeds) {
      printed = true;
      printFeed(feed, user);
      console.log(`=====================================`);
    }
  }

  if (!printed)
    console.log("No feeds found");
}
