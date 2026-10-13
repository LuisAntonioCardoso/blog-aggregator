import {
  CommandRegistry,
  registerCommand,
  runCommand,
  handlerLogin,
  handlerRegister,
  handlerReset,
  handlerUsers,
  handlerAgg,
  handlerAddFeed,
  handlerListFeeds
} from './commands.js';

async function main() {
  // strip out unwanted arguments and ensure that command has been given 
  const cliArgs = Bun.argv.slice(2);
  if (cliArgs.length < 1)
    throw new Error('usage: cli <command> [args...]');

  // register possible commands
  const cmdReg: CommandRegistry = {};
  registerCommand(cmdReg, 'login', handlerLogin);
  registerCommand(cmdReg, 'register', handlerRegister);
  registerCommand(cmdReg, 'reset', handlerReset);
  registerCommand(cmdReg, 'users', handlerUsers);
  registerCommand(cmdReg, 'agg', handlerAgg);
  registerCommand(cmdReg, 'addfeed', handlerAddFeed);
  registerCommand(cmdReg, 'feeds', handlerListFeeds);

  // run command
  const commandName = cliArgs[0];
  const args = cliArgs.slice(1);
  try {
    await runCommand(cmdReg, commandName, ...args);
  } catch (err) {
    if (err instanceof Error)
      console.error(`Error running command ${commandName}: ${err.message}`);
    else
      console.error(`Error running command ${commandName}: ${err}`);
    process.exit(1);
  }
  process.exit(0);
}

main();
