import {setUser, readConfig} from './config.js';
import {type CommandRegistry, registerCommand, runCommand, handlerLogin} from './commands.js';

async function main() {
  const cmdReg:CommandRegistry = {};
  registerCommand(cmdReg, 'login', handlerLogin);
  const cliArgs = Bun.argv.slice(2);
  if(cliArgs.length<1) {
    throw new Error('you need at least 1 argument');
  }
  const commandName = cliArgs[0];
  const args = cliArgs.slice(1);
  runCommand(cmdReg, commandName, ...args);
}

main();
