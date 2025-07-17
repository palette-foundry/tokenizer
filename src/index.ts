import path from 'path';
import fs from 'fs';
import { loadConfig } from './config';
import { tokensToCss } from './generator';
import { Tokens, TokenizerConfig } from './types/tokens';

const config = loadConfig();
console.log('Loaded config:', config);

// --- Run and write CSS file ---
const css = tokensToCss(config.tokens as Tokens);
const outPath = path.join(
    process.cwd(),
    config.outputDir as TokenizerConfig['outputDir'],
    'tokens.css',
);
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, css);

console.log(`CSS variables written to ${outPath}`);
