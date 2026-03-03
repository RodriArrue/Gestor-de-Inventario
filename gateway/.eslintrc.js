module.exports = {
    env: {
        node: true,
        commonjs: true,
        es2021: true,
    },
    extends: [
        'airbnb-base',
    ],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    rules: {
        indent: ['error', 4],
        'linebreak-style': ['error', 'unix'],
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        'comma-dangle': ['error', 'always-multiline'],
        'max-len': ['warn', { code: 120, ignoreComments: true, ignoreStrings: true }],
        'no-console': ['warn', { allow: ['warn', 'error', 'log'] }],
        'no-unused-vars': ['error', { argsIgnorePattern: '^_|^next$|^req$|^res$' }],
        'import/no-dynamic-require': 'off',
        'global-require': 'off',
        'consistent-return': 'off',
    },
};
