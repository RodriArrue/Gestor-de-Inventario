const { Sequelize } = require('sequelize');
const config = require('./database');
const { env } = require('./env');

const dbConfig = config[env.NODE_ENV];

const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: dbConfig.dialect,
        logging: dbConfig.logging,
        pool: dbConfig.pool,
    }
);

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos de inventario establecida correctamente.');
    } catch (error) {
        console.error('❌ Error al conectar con la base de datos de inventario:', error.message);
        throw error;
    }
};

module.exports = { sequelize, testConnection };
