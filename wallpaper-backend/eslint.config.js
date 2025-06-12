export default [
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                console: "readonly",
                process: "readonly",
                Buffer: "readonly",
                __dirname: "readonly",
                __filename: "readonly",
                exports: "writable",
                global: "readonly",
                module: "readonly",
                require: "readonly"
            }
        },
        rules: {
            "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
            "no-console": "off",
            "indent": ["error", 4],
            "quotes": ["error", "single"],
            "semi": ["error", "always"]
        }
    }
];