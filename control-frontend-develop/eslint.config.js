import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintConfigPrettier from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
    {
        ignores: ['**/node_modules/**', '**/dist/**', '**/build/**'],
    },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    pluginReact.configs.flat['jsx-runtime'],
    eslintConfigPrettier,
    eslintPluginPrettierRecommended,
    {
        rules: {
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    selector: 'interface',
                    format: ['PascalCase'],
                    prefix: ['I'],
                },
                {
                    selector: 'variable',
                    format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
                },
            ],
        },
    },
    { settings: { react: { version: '18.3' } } },
];
