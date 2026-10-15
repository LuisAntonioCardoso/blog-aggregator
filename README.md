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

#### 2.1
I guess that we are not using SQLite, its actually PostgreSQL instead.
Just installed PostgreSQL and used the psql client to create a new db.

#### 2.2
To interact with the db we are using drizzle orm.
Started by adding the users schema to the schema.ts on the project root folder, with: id(uuid), createdAt and updatedAt
(timestamp defaulted to now, and updateAt change on entry update) and name(text).
Changed the config to use the db connection instead of the placeholder: 
'postgres://postgres:<pass>@localhost:5432/gator?sslmode=disable'
sslmode is disable so that the application code does not try to use it locally.

#### 2.3
I had to change the readConfig to use the sync file read from node instead of the async one from but to be able to use
it in the drizzle.config. But now there is no way to run from the async functions without having to deal with potentially
infinite nested callbacks, so commandHandler will now return Promise<void>.
Now we create a DB object to interact with db using drizzle.
The syntax is conceptually similar with SQL, but nauseating. I hope it gives some type checking benefits, else this
is horrible.
Then create a new registerHandler that has as command 'register' and takes 1 argument(name), and it register new users.
It creates a new user in the db and set current user to be the one created and logs that the user was created.
Test with a random user to check if it worked fine and then check the config and the db if it persisted.

#### 3.1
For the RSS feed, I'm using a XML structure for the data, and program will have RSSFeed and RSSItem types. Since we are not
in the browser, instead of the DOMParser I'm using the fast-xml-parser to parse the XML.
Learned about the 'User-Agent' header, that identifies "who" is doing the request, in this case, which app/program. I guess
it is common practice to let the server know "who" is requesting.

#### 4.1
Completely forgot about journaling the section 3.
TLDR, implemented the rss feed parser, implemented a aux feedPrinter, created a db table to save the feeds with cascade delete
from users to feeds, created commands to add a feed and to list all feeds.
Now going to add functionality for users to also be able to follow feeds added by other users (currently impossible because
feeds are unique). Going to create a relation table between users and feeds with unique pairs, with cascade delete from both
the user side and the feed side.

#### 4.2
Now that we reached a point where multiple commands always start by doing the exact same things (for example getting the user),
we want to extract/abstract that logic to its own function. In this case, given its nature, it has a special name: middleware.
As the name suggests, middleware is code that act as a pre-fix of the code that we actually want to run, very commonly used 
for things like authentication/authorization.
In this case, we are using it as a higher order function that will wrap the command that need to access the user, turning
'UserCommandHandler's to normal 'CommandHandler's.

#### 4.3
Added functionality to unfollow feeds.

#### 5.1
Now lets get back to the aggregate command and complete it by fetching the posts from the feeds.
To do that, first we are adding a mutation feeds, to track when was the last time it was fetched (fetched_at).
Create a query to mark feed as fetched by updating fetched_at with current time stamp.
Now the agg(agregate) command will get a time duration as argument that will set a timer to run 'scrapeFeeds'.
Save the timer id and stop it when the program is killed.
