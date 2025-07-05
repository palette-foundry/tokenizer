import { createTokens } from "../src/generator";
import { loadConfig } from "../src/config";

describe("Token Generator", () => {
  let config;

  beforeAll(() => {
    config = loadConfig();
  });

  it("should generate CSS tokens correctly", () => {
    const tokens = createTokens(config);
    expect(tokens).toHaveProperty("colors");
    expect(tokens.colors).toHaveProperty("primary");
    expect(tokens.colors.primary).toEqual("#ff0000"); // Example expected value
  });

  it("should generate JavaScript object references correctly", () => {
    const tokens = createTokens(config);
    expect(tokens).toHaveProperty("spacing");
    expect(tokens.spacing).toHaveProperty("small");
    expect(tokens.spacing.small).toEqual("8px"); // Example expected value
  });

  it("should handle missing tokens gracefully", () => {
    const invalidConfig = { ...config, tokens: undefined };
    const tokens = createTokens(invalidConfig);
    expect(tokens).toEqual({});
  });

  // Additional tests can be added here for more scenarios
});
