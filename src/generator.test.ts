import { tokensToCss } from './generator';
import type { Tokens } from './types/tokens';

const baseTokens: Tokens = {
    palette: {
        red: {
            '50': { light: '#fef2f2', dark: '#7f1d1d' },
        },
    },
    color: {
        primary: {
            default: '{palette.red.50.light}',
            '.featureFlag': '{palette.red.50.dark}',
            '@800': '{palette.red.50.dark}',
        },
        secondary: '{palette.red.50.dark}',
    },
    space: {
        '0': '0px',
        '100': '{space.0}',
    },
    borderRadius: {
        '100': '4px',
        '200': '{space.100}',
    },
    font: {
        h1: {
            default: "1.5rem/2rem 'Inter', sans-serif 700",
            '@800': "2rem/2.5rem 'Inter', sans-serif 700",
            '.featureFlag': "3rem/3.5rem 'Inter', sans-serif 700",
        },
    },
};

describe('tokensToCss', () => {
    it('generates :root block with variables', () => {
        const css = tokensToCss(baseTokens);
        expect(css).toContain(':root {');
        expect(css).toContain('--palette-red-50: #fef2f2;');
        expect(css).toContain('--color-secondary: #7f1d1d;');
        expect(css).toContain('--space-0: 0px;');
        expect(css).toContain('--borderRadius-100: 4px;');
        expect(css).toContain(
            "--font-h1: 1.5rem/2rem 'Inter', sans-serif 700;",
        );
    });

    it('resolves references recursively', () => {
        const css = tokensToCss(baseTokens);
        expect(css).toContain('--color-primary: #fef2f2;');
        expect(css).toContain('--borderRadius-200: 0px;');
    });

    it('handles feature flag selectors', () => {
        const css = tokensToCss(baseTokens);
        expect(css).toContain('.featureFlag {');
        expect(css).toContain('--color-primary: #7f1d1d;');
        expect(css).toContain(
            "--font-h1: 3rem/3.5rem 'Inter', sans-serif 700;",
        );
    });

    it('handles breakpoints with media queries', () => {
        const css = tokensToCss(baseTokens);
        expect(css).toContain('@media (min-width: 800px) {');
        expect(css).toContain('--color-primary: #7f1d1d;');
        expect(css).toContain(
            "--font-h1: 2rem/2.5rem 'Inter', sans-serif 700;",
        );
    });

    it('handles color modes', () => {
        const tokens: Tokens = {
            palette: {
                red: {
                    '50': { light: '#fef2f2', dark: '#7f1d1d' },
                },
            },
            color: {
                primary: { light: '#fef2f2', dark: '#7f1d1d' },
            },
            space: {},
            borderRadius: {},
            font: {},
        };
        const css = tokensToCss(tokens);
        expect(css).toContain(':root {');
        expect(css).toContain('--color-primary: #fef2f2;');
        expect(css).toContain('[data-colormode="dark"] :root {');
        expect(css).toContain('--color-primary: #7f1d1d;');
    });

    it('handles empty tokens gracefully', () => {
        const css = tokensToCss({
            palette: {},
            color: {},
            space: {},
            borderRadius: {},
            font: {},
        });
        expect(css).toBe('');
    });
});
