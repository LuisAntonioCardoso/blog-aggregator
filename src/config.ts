import os from "os";
import path from "path";
import fs from "fs";

type Config = {
  dbUrl: string,
  currentUserName: string
};

export async function setUser(userName: string) {
  const currentConfig = readConfig();
  currentConfig.currentUserName = userName;
  await writeConfig(currentConfig);
}

export function readConfig(): Config {
  const configPath = getConfigFilePath();
  //const config = await Bun.file(configPath).json();     *** this is needed because I want to use this in drizzle.config and async calls there are not allowed
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  return validateConfig(config);
}

function getConfigFilePath() {
  return path.join(os.homedir(), '.gatorconfig.json');
}

async function writeConfig(config: Config) {
  const configPath = getConfigFilePath();
  await Bun.write(configPath, JSON.stringify(config, null, 2));
}

function validateConfig(rawConfig: any): Config {
  if (rawConfig === null || typeof rawConfig !== 'object' || rawConfig.dbUrl === null || typeof rawConfig.dbUrl !== 'string')
    throw new Error("db_url is required in config file");

  const config: Config = {
    dbUrl: rawConfig.dbUrl,
    currentUserName: rawConfig.currentUserName ?? '',
  };
  return config;
}

