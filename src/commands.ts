import { setUser } from './config.js';

export type CommandRegistry = {
  [key:string]: CommandHandler;
}
type CommandHandler = (commandName: string, ...agrs: string[])=> void;

export function handlerLogin(commandName: string, ...args: string[]) {
  if (args.length === 0)
    throw new Error('username is required for login');
  
  setUser(args[0]);
  console.log(`User ${args[0]} has been set`);
}

export function registerCommand(registry: CommandRegistry, commandName:string, handler:CommandHandler){
  registry[commandName]=handler;
}

export function runCommand(registry:CommandRegistry, commandName:string, ...args:string[]) {
  if(Object.hasOwn(registry, commandName))
    registry[commandName](commandName, ...args);
}
