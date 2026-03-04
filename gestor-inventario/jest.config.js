process.env.DOTENV_CONFIG_PATH = '.env.test';

module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js'],
    setupFiles: ['dotenv/config'],
};
