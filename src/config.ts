import Ajv from 'ajv';
import schema from './tokenizer.config.schema.json';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const ajv = new Ajv({
    strict: true,
    allowUnionTypes: true,
});
const validate = ajv.compile(schema);

export function loadConfig() {
    const configPath = resolve(process.cwd(), 'tokenizer.config.json');
    const raw = readFileSync(configPath, 'utf-8');
    const config = JSON.parse(raw);

    if (!validate(config)) {
        const extraProps = validate.errors
            ?.filter((e) => e.keyword === 'additionalProperties')
            .map((e) => e.params.additionalProperty);

        if (extraProps && extraProps.length > 0) {
            throw new Error(
                `Invalid config schema: extra properties found: ${extraProps.join(', ')}`,
            );
        }

        throw new Error(
            'Invalid config schema: ' + ajv.errorsText(validate.errors),
        );
    }

    return config;
}
