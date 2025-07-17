import type { Tokens } from './types/tokens';

type TokenValue = string | { [key: string]: TokenValue };

type OutputBuckets = {
    root: Map<string, string>;
    dark: Map<string, string>;
    breakpoints: Map<string, Map<string, string>>;
};

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
        if (ref === undefined) return '';
    }
    return typeof ref === 'string' ? ref : '';
}

function walkTokens(
    obj: TokenValue,
    tokens: Tokens,
    pathArr: string[],
    buckets: OutputBuckets,
    colorMode: 'light' | 'dark' | null = null,
    breakpoint: string | null = null,
) {
    if (typeof obj === 'string') {
        const value = resolveRef(obj, tokens);
        if (!value) return;

        const varName = toCssVarName(pathArr);
        const target =
            breakpoint != null
                ? buckets.breakpoints.get(breakpoint)!
                : colorMode === 'dark'
                  ? buckets.dark
                  : buckets.root;

        target.set(varName, value);
    } else if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
            if (key === 'light' || key === 'dark') {
                walkTokens(
                    obj[key],
                    tokens,
                    pathArr,
                    buckets,
                    key as 'light' | 'dark',
                    breakpoint,
                );
            } else if (key.startsWith('@')) {
                const minWidth = key.replace('@', '') + 'px';
                if (!buckets.breakpoints.has(minWidth)) {
                    buckets.breakpoints.set(minWidth, new Map());
                }
                walkTokens(
                    obj[key],
                    tokens,
                    pathArr,
                    buckets,
                    colorMode,
                    minWidth,
                );
            } else {
                walkTokens(
                    obj[key],
                    tokens,
                    [...pathArr, key],
                    buckets,
                    colorMode,
                    breakpoint,
                );
            }
        }
    }
}

export function tokensToOptimizedCss(tokens: Tokens): string {
    const buckets: OutputBuckets = {
        root: new Map(),
        dark: new Map(),
        breakpoints: new Map(),
    };

    for (const key in tokens) {
        walkTokens(tokens[key] as TokenValue, tokens, [key], buckets);
    }

    const blocks: string[] = [];

    function mapToBlock(selector: string, vars: Map<string, string>) {
        if (vars.size === 0) return;
        const lines = Array.from(vars.entries()).map(
            ([k, v]) => `  ${k}: ${v};`,
        );
        blocks.push(`${selector} {\n${lines.join('\n')}\n}`);
    }

    mapToBlock(':root', buckets.root);
    mapToBlock(`[data-colormode='dark']`, buckets.dark);

    for (const [breakpoint, vars] of buckets.breakpoints) {
        const lines = Array.from(vars.entries()).map(
            ([k, v]) => `    ${k}: ${v};`,
        );
        blocks.push(
            `@media (min-width: ${breakpoint}) {\n  :root {\n${lines.join('\n')}\n  }\n}`,
        );
    }

    return blocks.join('\n\n');
}
