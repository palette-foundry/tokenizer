export interface Token {
  name: string;
  value: string;
  type: "color" | "font" | "spacing" | "size" | "border" | "shadow";
}

export interface TokenGeneratorConfig {
  tokens: Token[];
  output: {
    css: string;
    js: string;
  };
  format?: "css" | "scss" | "json";
}

export interface Config {
  outputDir: string;
  tokens: Record<string, string | number>;
  output: {
    css: string;
    js?: string;
  };
  // Add other configuration options as needed
}
