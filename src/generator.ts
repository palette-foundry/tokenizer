import fs from "fs";
import path from "path";
import { Config } from "./types/config";

export function createTokens(config: Config) {
  const cssOutputPath = path.resolve(config.outputDir, "tokens.css");
  const jsOutputPath = path.resolve(config.outputDir, "tokens.js");

  let cssContent = "";
  let jsContent = "const tokens = {\n";

  for (const [name, value] of Object.entries(config.tokens)) {
    cssContent += `--${name}: ${value};\n`;
    jsContent += `  ${name}: "${value}",\n`;
  }

  jsContent += "};\nexport default tokens;\n";

  fs.writeFileSync(cssOutputPath, cssContent);
  fs.writeFileSync(jsOutputPath, jsContent);
}
