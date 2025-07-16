import { readFileSync } from 'fs';
import { resolve } from 'path';
import { TokenizerConfig } from './types/config';

export function loadConfig(): TokenizerConfig {
    const configPath = resolve(process.cwd(), 'tokenizer.config.json');
    const raw = readFileSync(configPath, 'utf-8');
    const config = JSON.parse(raw);

    if (!isValidConfig(config)) {
        throw new Error('Invalid configuration format');
    }

    return config;
}

function isValidConfig(config: TokenizerConfig): config is TokenizerConfig {
    const allowedKeys = ['outputDir', 'tokens'];
    const configKeys = Object.keys(config);
    const extraKeys = configKeys.filter((key) => !allowedKeys.includes(key));

    if (extraKeys.length > 0) {
        throw new Error(
            `Invalid configuration: extra keys found: ${extraKeys.join(', ')}. Allowed keys are: ${allowedKeys.join(', ')}.`,
        );
    }

    return (
        typeof config === 'object' &&
        typeof config.outputDir === 'string' &&
        typeof config.tokens === 'object' &&
        config.tokens !== null
    );
}
