module.exports = {
    env: {
        node: true,
        commonjs: true,
        es2021: true,
        jest: true,
    },
    extends: [
        'airbnb-base',
        'plugin:jest/recommended',
    ],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    rules: {
        // Estilo
        indent: ['error', 4],
        'linebreak-style': ['error', 'unix'],
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        'comma-dangle': ['error', 'always-multiline'],
        'max-len': ['warn', { code: 120, ignoreComments: true, ignoreStrings: true }],

        // Funcionalidad
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'no-unused-vars': ['error', { argsIgnorePattern: '^_|^next$|^req$|^res$' }],
        'no-param-reassign': ['error', { props: false }],
        'class-methods-use-this': 'off',
        'max-classes-per-file': 'off',
        'default-case': 'off',

        // Import
        'import/no-dynamic-require': 'off',
        'global-require': 'off',

        // Consistencia con el proyecto
        'no-underscore-dangle': 'off',
        'consistent-return': 'off',
    },
    overrides: [
        {
            // Reglas más relajadas para migraciones y seeders
            files: ['src/database/**/*.js'],
            rules: {
                'no-unused-vars': ['error', { argsIgnorePattern: '^_|Sequelize' }],
                'import/no-extraneous-dependencies': 'off',
            },
        },
    ],
};
