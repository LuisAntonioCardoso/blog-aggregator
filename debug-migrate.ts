import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { readConfig } from "./src/config.js";

const client = postgres(readConfig().dbUrl, { max: 1 });

try {
  await migrate(drizzle(client), {
    migrationsFolder: "./src/lib/db/migrations",
  });
  console.log("Migrations applied");
} catch (error) {
  console.dir(error, { depth: null });
  process.exitCode = 1;
} finally {
  await client.end();
}
