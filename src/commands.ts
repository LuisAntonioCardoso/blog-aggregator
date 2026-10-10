import { readConfig, setUser } from './config';
import { createUser, getAllUsers, getUser, resetUsers } from './lib/db/queries/users';

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
