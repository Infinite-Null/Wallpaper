// eslint.config.js
import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import nPlugin from 'eslint-plugin-n';
import securityPlugin from 'eslint-plugin-security';
import eslint_plugin_security_node from 'eslint-plugin-security-node';
// eslint-disable-next-line import/no-unresolved
import { defineConfig } from 'eslint/config';
import globals from 'globals';

export default defineConfig( [
    // Base JavaScript configuration
    {
        files: [ '**/*.{js,mjs}' ],
        plugins: { js },
        extends: [ 'js/recommended' ],
    },

    // Node.js environment settings
    {
        files: [ '**/*.{js,mjs}' ],
        languageOptions: {
            ecmaVersion: 2024,
            sourceType: 'module',
            globals: { ...globals.node, },
        },
    },

    // Node.js specific plugin
    {
        files: [ '**/*.{js,mjs}' ],
        plugins: { n: nPlugin, },
        rules: {
            'n/no-missing-import': 'error',
            'n/no-extraneous-import': 'error',
            'n/no-unpublished-import': 'off',
            'n/no-unsupported-features/es-syntax': [
                'error',
                {
                    version: '>=18.0.0',
                    ignores: [ 'modules' ],
                },
            ],
            'n/exports-style': [ 'error', 'module.exports' ],
            'n/file-extension-in-import': [ 'error', 'always' ],
            'n/prefer-global/buffer': [ 'error', 'always' ],
            'n/prefer-global/console': [ 'error', 'always' ],
            'n/prefer-global/process': [ 'error', 'always' ],
            'n/prefer-promises/fs': 'error',
        },
    },

    // Import plugin for ES modules
    {
        files: [ '**/*.{js,mjs}' ],
        plugins: { import: importPlugin, },
        rules: {
            'import/no-unresolved': 'error',
            'import/named': 'error',
            'import/default': 'error',
            'import/export': 'error',
            'import/order': [
                'error',
                {
                    groups: [ 'builtin', 'external', 'internal', 'parent', 'sibling', 'index' ],
                    'newlines-between': 'always',
                },
            ],
            'import/first': 'error',
            'import/no-duplicates': 'error',
            'import/no-named-as-default': 'warn',
            'import/no-cycle': 'error',
        },
    },

    // Security related rules
    {
        files: [ '**/*.{js,mjs}' ],
        plugins: { security: securityPlugin, },
        rules: {
            'security/detect-buffer-noassert': 'error',
            'security/detect-child-process': 'warn',
            'security/detect-eval-with-expression': 'error',
            'security/detect-non-literal-fs-filename': 'warn',
            'security/detect-non-literal-regexp': 'warn',
            'security/detect-no-csrf-before-method-override': 'error',
            'security/detect-disable-mustache-escape': 'error',
            'security/detect-unsafe-regex': 'error',
            'security/detect-possible-timing-attacks': 'warn',
        },
    },

    // Additional Node.js security rules using eslint-plugin-security-node
    {
        files: [ '**/*.{js,mjs}' ],
        plugins: { 'security-node': eslint_plugin_security_node, },
        rules: {
            'security-node/detect-security-missconfiguration-cookie': 'error',
            'security-node/detect-sql-injection': 'error',
            'security-node/disable-ssl-across-node-server': 'error',
            'security-node/detect-improper-exception-handling': 'warn',
            'security-node/detect-option-rejectunauthorized-in-nodejs-httpsrequest': 'error',
        },
    },

    // Common style and best practices
    {
        files: [ '**/*.{js,mjs}' ],
        rules: {
            'no-console': [ 'warn', { allow: [ 'warn', 'error', 'info' ] } ],
            'no-unused-vars': [ 'error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' } ],
            'no-var': 'error',
            'prefer-const': 'error',
            'no-throw-literal': 'error',
            'no-return-await': 'error',
            'require-await': 'error',

            // Spacing rules for brackets and parentheses
            'space-in-parens': [ 'error', 'always' ],
            'space-before-blocks': 'error',
            'keyword-spacing': [ 'error', { before: true, after: true } ],
            'arrow-spacing': [ 'error', { before: true, after: true } ],
            'space-infix-ops': 'error',
            'space-unary-ops': [ 'error', { words: true, nonwords: false } ],
            'block-spacing': [ 'error', 'always' ],

            // Modern JavaScript
            'prefer-arrow-callback': 'error',
            'prefer-template': 'error',
            'prefer-destructuring': [ 'warn', { object: true, array: false } ],
            'prefer-rest-params': 'error',
            'prefer-spread': 'error',
        },
    },

    // Test files specific configuration
    {
        files: [ '**/*.test.js', '**/*.spec.js', 'test/**/*.js' ],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.mocha,
                expect: 'readonly',
                assert: 'readonly',
            },
        },
        rules: {
            'n/no-unpublished-import': 'off',
            'max-len': 'off',
            'no-unused-expressions': 'off',
        },
    },

    // Custom spacing rules to override - this must be the last configuration
    {
        files: [ '**/*.{js,mjs}' ],
        rules: {
            // Semicolons
            'semi': [ 'error', 'always' ],
            
            // Spacing rules
            'space-in-parens': [ 'error', 'always' ],
            'space-before-blocks': 'error',
            'keyword-spacing': [ 'error', { before: true, after: true } ],
            'array-bracket-spacing': [ 'error', 'always' ],
            'object-curly-spacing': [ 'error', 'always' ],
            'computed-property-spacing': [ 'error', 'always' ],
            'template-curly-spacing': [ 'error', 'always' ],
            'space-infix-ops': 'error',
            
            // Line breaks and formatting
            'no-multiple-empty-lines': [ 'error', { max: 1, maxEOF: 1 } ],
            'eol-last': [ 'error', 'always' ],
            'padding-line-between-statements': [
                'error',
                { blankLine: 'always', prev: '*', next: 'return' }
            ],
            'indent': [ 'error', 4, { SwitchCase: 1 } ],
            
            // Bracket and parentheses formatting - improved for consistency
            'array-bracket-newline': [ 'error', 'consistent' ],
            'array-element-newline': [ 'error', 'consistent' ],
            'function-paren-newline': [ 'error', 'consistent' ],
            'function-call-argument-newline': [ 'error', 'consistent' ],
            'object-curly-newline': [ 'error', { 
                multiline: true,
                consistent: true
            } ],
            'object-property-newline': [ 'error', { 
                allowAllPropertiesOnSameLine: true 
            } ],
            'brace-style': [ 'error', '1tbs', { 
                allowSingleLine: false 
            } ],
        },
    },
] );
