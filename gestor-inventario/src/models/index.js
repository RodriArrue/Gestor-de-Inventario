const { Sequelize } = require('sequelize');
const config = require('../config/database');
const { env } = require('../config/env');

const dbConfig = config[env.NODE_ENV];

// Crear instancia de Sequelize
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

// Importar modelos (se agregan en cada feature)
const Categoria = require('./Categoria')(sequelize);
const Proveedor = require('./Proveedor')(sequelize);
const Producto = require('./Producto')(sequelize);

const models = {
    Categoria,
    Proveedor,
    Producto,
};

// Ejecutar asociaciones
Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

module.exports = {
    sequelize,
    Sequelize,
    ...models,
};
