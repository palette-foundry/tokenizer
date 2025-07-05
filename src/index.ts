import { loadConfig } from "./config";
import { createTokens } from "./generator";

export function generateTokens() {
  const config = loadConfig();
  createTokens(config);
}
