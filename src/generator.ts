import { Tokens } from './types/tokens';

interface Context {
    selector: string; // e.g. ':root', '.featureFlag', or combined
    media?: string; // e.g. '@media (min-width: 800px)'
    colorMode?: 'light' | 'dark';
}

type RuleMap = Map<
    string, // media query or '' for none
    Map<
        string, // selector
        Map<string, string> // varName -> value
    >
>;

/**
 * Recursively resolve all `{path.to.token}` references in the tokens object.
 * Limits depth to avoid infinite loops.
 */
function deepResolveTokens<T>(obj: T, tokens: Tokens, depth = 10): T {
    if (depth <= 0) return obj;

    if (typeof obj === 'string') {
        const refMatch = obj.match(/^\{(.+)\}$/);
        if (refMatch) {
            const path = refMatch[1].split('.');
            let ref: unknown = tokens;
            for (const key of path) {
                if (typeof ref !== 'object' || ref === null) return obj;
                ref = (ref as Record<string, unknown>)[key];
                if (ref === undefined) return obj;
            }
            if (typeof ref === 'string') {
                // recursively resolve resolved string
                return deepResolveTokens(ref, tokens, depth - 1) as T;
            }
            return ref as T;
        }
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map((item) =>
            deepResolveTokens(item, tokens, depth),
        ) as unknown as T;
    }

    if (typeof obj === 'object' && obj !== null) {
        const res: Record<string, unknown> = {};
        for (const key in obj) {
            res[key] = deepResolveTokens(
                (obj as Record<string, unknown>)[key],
                tokens,
                depth,
            );
        }
        return res as T;
    }

    return obj;
}

/** Convert context to CSS selector string */
function contextToSelector(context: Context): string {
    let sel = context.selector;
    if (context.colorMode === 'dark') {
        sel = `[data-colormode="dark"] ${sel}`;
    }
    return sel;
}

/** Add CSS variable rule */
function addRule(
    rules: RuleMap,
    media: string,
    selector: string,
    varName: string,
    value: string,
) {
    if (!rules.has(media)) rules.set(media, new Map());
    const selMap = rules.get(media)!;
    if (!selMap.has(selector)) selMap.set(selector, new Map());
    selMap.get(selector)!.set(varName, value);
}

/**
 * Walk tokens recursively to generate CSS variable rules.
 * Supports nested colorMode, media queries, classes.
 */
function walkTokens(
    obj: unknown,
    path: string[] = [],
    context: Context = { selector: ':root' },
    rules: RuleMap = new Map(),
) {
    if (typeof obj === 'string') {
        // Leaf value: assign CSS variable
        const varName = `--${path.join('-')}`;
        const media = context.media ?? '';
        const selector = contextToSelector(context);
        addRule(rules, media, selector, varName, obj);
        return;
    }

    if (typeof obj !== 'object' || obj === null) return;

    // Handle 'default' key specially (apply default tokens first)
    if ('default' in obj) {
        walkTokens(
            (obj as Record<string, unknown>)['default'],
            path,
            context,
            rules,
        );
    }

    for (const key in obj) {
        if (key === 'default') continue;

        if (key === 'light' || key === 'dark') {
            // Color mode
            walkTokens(
                (obj as Record<string, unknown>)[key],
                path,
                { ...context, colorMode: key },
                rules,
            );
        } else if (key.startsWith('.')) {
            // Class selector - nest outside root
            const newSelector =
                context.selector === ':root'
                    ? key
                    : `${context.selector} ${key}`;
            walkTokens(
                (obj as Record<string, unknown>)[key],
                path,
                { ...context, selector: newSelector },
                rules,
            );
        } else if (key.startsWith('@')) {
            // Media query (only min-width px supported)
            const minWidthPx = key.slice(1);
            const mediaQuery = `@media (min-width: ${minWidthPx}px)`;
            const newMedia = context.media
                ? `${context.media} and ${mediaQuery}`
                : mediaQuery;
            walkTokens(
                (obj as Record<string, unknown>)[key],
                path,
                { ...context, media: newMedia },
                rules,
            );
        } else {
            // Normal key extends path
            walkTokens(
                (obj as Record<string, unknown>)[key],
                [...path, key],
                context,
                rules,
            );
        }
    }
}

/** Generate final CSS string from rules */
function generateCss(rules: RuleMap): string {
    let css = '';

    // Collect root variables for the base (no media, no class)
    const rootVars: string[] = [];
    const selMap = rules.get('') ?? new Map();

    // Only collect variables for the base :root selector (no colorMode, no class)
    if (selMap.has(':root')) {
        for (const [varName, value] of selMap.get(':root')!) {
            rootVars.push(`    ${varName}: ${value};`);
        }
    }

    // Output all root variables in a single :root block
    if (rootVars.length) {
        css += `:root {\n${rootVars.join('\n')}\n}\n`;
    }

    // Output all other selectors and media queries as before
    for (const [media, selMap] of rules) {
        if (media === '') {
            for (const [selector, vars] of selMap) {
                if (selector === ':root') continue; // already handled
                css += `${selector} {\n`;
                for (const [varName, value] of vars) {
                    css += `    ${varName}: ${value};\n`;
                }
                css += '}\n';
            }
        } else {
            css += `${media} {\n`;
            for (const [selector, vars] of selMap) {
                css += `  ${selector} {\n`;
                for (const [varName, value] of vars) {
                    css += `    ${varName}: ${value};\n`;
                }
                css += '  }\n';
            }
            css += '}\n';
        }
    }

    return css;
}

/** Main function to convert tokens to CSS string */
export function tokensToCss(tokens: Tokens): string {
    // First fully resolve all `{reference}` values in tokens
    const resolvedTokens = deepResolveTokens(tokens, tokens);

    // Walk resolved tokens to build rules
    const rules: RuleMap = new Map();
    walkTokens(resolvedTokens, [], { selector: ':root' }, rules);

    return generateCss(rules);
}
