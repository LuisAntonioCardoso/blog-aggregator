import { setUser } from './config.js';
import { createUser } from './lib/db/queries/users.js';

export type CommandRegistry = {
  [key: string]: CommandHandler;
}
type CommandHandler = (commandName: string, ...agrs: string[]) => Promise<void>;

export function registerCommand(registry: CommandRegistry, commandName: string, handler: CommandHandler) {
  registry[commandName] = handler;
}

export async function runCommand(registry: CommandRegistry, commandName: string, ...args: string[]) {
  if (Object.hasOwn(registry, commandName))
    registry[commandName](commandName, ...args);
}

export async function handlerLogin(commandName: string, ...args: string[]) {
  if (args.length === 0)
    throw new Error('username is required for login');

  setUser(args[0]);
  console.log(`User ${args[0]} has been set`);
}

export async function handlerRegister(commandName: string, ...args: string[]) {
  if (args.length === 0)
    throw new Error('username is required to register new user');

  await createUser(args[0]);
  console.log(`User ${args[0]} registered`);
}
