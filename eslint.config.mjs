import sharedConfig from './.github/shared/eslint/eslint.config.mjs';

export default [
    {
        ignores: [
            'dist/**/*',
            'build/**/*',
            'node_modules/**/*',
            '.github/shared/**/*',
        ],
    },
    ...sharedConfig,
];
