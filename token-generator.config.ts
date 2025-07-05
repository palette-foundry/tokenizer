export interface TokenConfig {
  tokens: {
    [key: string]: {
      value: string;
      description?: string;
    };
  };
  output: {
    css: string;
    js: string;
  };
}

const config: TokenConfig = {
  tokens: {
    colorPrimary: {
      value: "#007bff",
      description: "Primary color for the application",
    },
    colorSecondary: {
      value: "#6c757d",
      description: "Secondary color for the application",
    },
    fontSizeBase: {
      value: "16px",
      description: "Base font size",
    },
    spacingSmall: {
      value: "8px",
      description: "Small spacing unit",
    },
    spacingMedium: {
      value: "16px",
      description: "Medium spacing unit",
    },
    spacingLarge: {
      value: "24px",
      description: "Large spacing unit",
    },
  },
  output: {
    css: "./dist/tokens.css",
    js: "./dist/tokens.js",
  },
};

export default config;
