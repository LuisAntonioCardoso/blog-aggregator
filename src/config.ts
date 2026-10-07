import os from "os";
import path from "path";

type Config = {
  dbUrl: string,
  currentUserName: string
};

export async function setUser(userName:string){
  const currentConfig = await readConfig();
  currentConfig['currentUserName']=userName;
  const newConfig = validateConfig(currentConfig);
  await writeConfig(newConfig);
}

export async function readConfig(): Config{
  const configPath = getConfigFilePath();
  const config = await Bun.file(configPath).json();
  return validateConfig(config);
}

function getConfigFilePath(){
  return path.join(os.homedir(), '.gatorconfig.json');
}

async function writeConfig(config: Config){
  const configPath = getConfigFilePath();
  await Bun.write(configPath, JSON.stringify(config,null,2));
}

function validateConfig(rawConfig: any): Config{
  if(!isConfig(rawConfig)) throw new Error('Invalid Config');
  return rawConfig;
}

function isConfig(value: unknown): valus is Config{
  if(typeof value!=='object') return false;
  if(value===null) return false;
  if(!('dbUrl' in value) || typeof value['dbUrl'] !== 'string') return false;
  for(const key of Object.keys(value)) {
    if (key === 'dbUrl' || (key === 'currentUserName' && typeof value[key] === 'string')) continue;
    return false;
  }
  return true;
}
