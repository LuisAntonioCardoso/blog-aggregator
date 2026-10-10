import { type CommandRegistry, registerCommand, runCommand, handlerLogin, handlerRegister, handlerReset, handlerUsers } from './commands.js';

async function main() {
  // register possible commands
  const cmdReg: CommandRegistry = {};
  registerCommand(cmdReg, 'login', handlerLogin);
  registerCommand(cmdReg, 'register', handlerRegister);
  registerCommand(cmdReg, 'reset', handlerReset);
  registerCommand(cmdReg, 'users', handlerUsers);

  // strip out unwanted arguments and ensure that command has been given 
  const cliArgs = Bun.argv.slice(2);
  if (cliArgs.length < 1) {
    throw new Error('you need at least 1 argument');
  }

  // run command
  const commandName = cliArgs[0];
  const args = cliArgs.slice(1);
  await runCommand(cmdReg, commandName, ...args);
  process.exit(0);
}

main();
