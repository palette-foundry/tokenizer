export type TokenReference = `{${string}}`;

export type ColorValue = string | TokenReference;

export type ModeValue = {
    light?: ColorValue;
    dark?: ColorValue;
};

export type ResponsiveValue<T> = {
    [K in `@${string}`]?: T;
} & {
    default?: T;
};
export type FeatureFlagValue<T> = {
    [K in `.${string}`]?: T;
} & {
    default?: T;
};

export type PaletteScale = {
    [scale in
        | '50'
        | '100'
        | '200'
        | '300'
        | '400'
        | '500'
        | '600'
        | '700'
        | '800'
        | '900']?: ModeValue;
};

export type Palette = {
    red?: PaletteScale;
    orange?: PaletteScale;
    yellow?: PaletteScale;
    green?: PaletteScale;
    blue?: PaletteScale;
    purple?: PaletteScale;
    pink?: PaletteScale;
    gray?: PaletteScale;
    [key: string]: PaletteScale | undefined;
};

export type ColorToken =
    | ModeValue
    | TokenReference
    | ResponsiveValue<ModeValue | TokenReference>
    | FeatureFlagValue<ModeValue | TokenReference>;

export type Color = {
    [key: string]: ColorToken;
};

export type Space = {
    [key: string]: string | TokenReference;
};

export type BorderRadius = {
    [key: string]: string | TokenReference;
};

export type FontToken =
    | string
    | ResponsiveValue<string>
    | FeatureFlagValue<string>
    | ResponsiveValue<FeatureFlagValue<string>>;

export type Font = {
    [key: string]: FontToken;
};

export type Tokens = {
    palette: Palette;
    color: Color;
    space: Space;
    borderRadius: BorderRadius;
    font: Font;
    [key: string]: unknown;
};

export type TokenizerConfig = {
    outputDir: string;
    tokens: Tokens;
};
