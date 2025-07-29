# Tokenizer

This project is dedicated to providing CSS tokens in a clean, theme-able, and responsive way.

## 📦 Installation

To install this package:

```bash
npm i @palette-foundry/tokenizer
```

## 📚 Usage

1. Create a file called tokenizer.config.json with this structure:

```json
{
    "$id": "node_modules/@palette-foundry/tokenizer/dist/cjs/tokenizer.config.schema.json",
    "outputDir": "src/tokens",
    "tokens": {
        "space": {
            "0": "0px"
        }
    }
}
```

2. Run `npm tokenize`
3. You should see an output in your package with the CSS tokens

## Resources

[NPM Repository](https://www.npmjs.com/package/@palette-foundry/tokenizer)
