import { readConfig, setUser } from './config.js';
import { createUser, getAllUsers, getUser, resetUsers } from './lib/db/queries/users.js';

export type CommandRegistry = {
  [key: string]: CommandHandler;
}
type CommandHandler = (commandName: string, ...agrs: string[]) => Promise<void>;

export function registerCommand(registry: CommandRegistry, commandName: string, handler: CommandHandler) {
  registry[commandName] = handler;
}

export async function runCommand(registry: CommandRegistry, commandName: string, ...args: string[]) {
  if (Object.hasOwn(registry, commandName))
    await registry[commandName](commandName, ...args);
}

export async function handlerLogin(commandName: string, ...args: string[]) {
  if (args.length === 0)
    throw new Error('username is required for login');
  const username = args[0];

  let user = await getUser(username);
  if (!user)
    throw new Error(`user ${username} not registered`);

  setUser(username);
  console.log(`User ${username} has been set`);
}

export async function handlerRegister(commandName: string, ...args: string[]) {
  if (args.length === 0)
    throw new Error('username is required to register new user');
  const username = args[0];

  let user = await getUser(username);
  if (user)
    throw new Error(`username ${username} already exist`);

  const newUser = await createUser(username);
  setUser(newUser.name);
  console.log(`User ${username} registered`);
}

export async function handlerReset(commandName: string, ...args: string[]) {
  await resetUsers();
  console.log('users table reseted');
}

export async function handlerUsers(commandName: string, ...args: string[]) {
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
