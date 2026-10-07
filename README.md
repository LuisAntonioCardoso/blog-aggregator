# blog-aggregator

To install dependencies:
```bash
bun install
```

To run:
```bash
bun run index.ts
```

This is a RSS feed aggregator called Gator.

Its a bootdev guided project.

During development, I'm both learning the tech from the courses, but also practicing
with other development tech like LLM agents, nvim, bun and jj.

The goal is not only learn 'hard development skills', like the concepts and technologies,
but also 'soft development skills', like other skills adjacent to the implementation itself.

I will also use the README almost like a journal to give another pass and revisit what I 
implemented, how I implemented it, and what where the problems faced along the way.

#### 1.3
This project will focus on SQL and CLI development, so no auth will be implemented.
It will also be development to be local only using an SQLite DB.

Added functions to interact with the config file, that will live in the home directory.
The config file file will hold the db url and current user.
Them main: setUser and readConfig; and support: getConfigFilePath, writeConfig, validateConfig and isConfig.

#### 1.4
This will be a CLI app, so it will support various commands.
For that there will be a simple and flexible system to be able to add and remove commands.
This system will be hand rolled, instead of using a framework like commander.js.
A 'CommandHandler' type will enforce a signature that all command handlers should follow: name and string[].

'handlerLogin' sets the user and receives 1 argument: username.

A 'CommandRegistry' type is defined for an object that has as keys all available commands with the respective
handlers as values.

I guess this is not a REPL, but in every cli command call we are building the command registry, and then run 
only the requested command. It doesn't seem the best approach, but since this is already my 4th guided project,
its likely that this will change further in the project.

So currently I have a way to read and write the config file, I have infra around commands so that the commands are 
developed and developed with, following the right structure, and the program itself registers the only command, login,
reads the given args, strips the first ones that are not relevant (we just need to know the command and the args), 
and then runs the command with the given args. Currently, if the command does not exist, nothing happens, its just ignored.
