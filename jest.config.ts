import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    roots: ['<rootDir>'],
    preset: 'ts-jest',
    testEnvironment: 'node',
    transformIgnorePatterns: ['/node_modules/'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    verbose: true,
    collectCoverageFrom: ['src'],
    moduleNameMapper: {
        '\\.css$': 'identity-obj-proxy',
    },
    // coverageThreshold: {
    // 	global: {
    // 		branches: 90,
    // 		functions: 90,
    // 		lines: 90,
    // 		statements: 90,
    // 	},
    // },
};

export default config;
