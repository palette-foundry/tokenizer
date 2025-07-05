import { readFileSync } from "fs";
import { resolve } from "path";
import { Config } from "./types/config";

export function loadConfig(): Config {
  const configPath = resolve(process.cwd(), "token-generator.config.ts");
  const configFile = readFileSync(configPath, "utf-8");

  // Evaluate the configuration file to get the configuration object
  const config = eval(configFile);

  // Ensure the configuration adheres to the specified type
  if (!isValidConfig(config)) {
    throw new Error("Invalid configuration format");
  }

  return config;
}

function isValidConfig(config: any): config is Config {
  // Implement validation logic based on the expected structure of the Config type
  return true; // Placeholder for actual validation logic
}
