import type { Tokens } from './types/tokens';

// Define TokenValue type as a union of string and object for token walking
type TokenValue = string | { [key: string]: TokenValue };

// --- Token to CSS function ---
function toCssVarName(pathArr: string[]): string {
    return `--${pathArr.join('-')}`;
}

function resolveRef(value: string, tokens: Tokens): string {
    const refMatch = value.match(/^\{(.+)\}$/);
    if (!refMatch) return value;
    const refPath = refMatch[1].split('.');
    let ref: Tokens = tokens;
    for (const key of refPath) {
        ref = ref?.[key] as Tokens;
        if (ref === undefined) return value;
    }
    return typeof ref === 'string' ? ref : '';
}

function walkTokens(
    obj: TokenValue,
    tokens: Tokens,
    pathArr: string[] = [],
    selector: string = ':root',
    output: string[] = [],
    featureFlag?: string,
    breakpoint?: string,
) {
    if (typeof obj === 'string') {
        const value = resolveRef(obj, tokens);
        const varName = toCssVarName(pathArr);
        let rule = `${selector} { ${varName}: ${value}; }`;
        if (breakpoint) {
            rule = `@media (min-width: ${breakpoint}) { ${selector} { ${varName}: ${value}; } }`;
        }
        output.push(rule);
    } else if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
            if (key.startsWith('.')) {
                walkTokens(
                    obj[key],
                    tokens,
                    pathArr,
                    key,
                    output,
                    key,
                    breakpoint,
                );
            } else if (key.startsWith('@')) {
                const minWidth = key.replace('@', '') + 'px';
                walkTokens(
                    obj[key],
                    tokens,
                    pathArr,
                    selector,
                    output,
                    featureFlag,
                    minWidth,
                );
            } else {
                walkTokens(
                    obj[key],
                    tokens,
                    [...pathArr, key],
                    selector,
                    output,
                    featureFlag,
                    breakpoint,
                );
            }
        }
    }
    return output;
}

export function tokensToCss(tokens: Tokens): string {
    const output: string[] = [];
    for (const key in tokens) {
        walkTokens(tokens[key] as TokenValue, tokens, [key], ':root', output);
    }
    return output.join('\n');
}
