'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert('categorias', [
            {
                id: uuidv4(),
                name: 'Electrónica',
                description: 'Dispositivos y componentes electrónicos',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: uuidv4(),
                name: 'Ropa',
                description: 'Prendas de vestir y accesorios',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: uuidv4(),
                name: 'Alimentos',
                description: 'Productos alimenticios y bebidas',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: uuidv4(),
                name: 'Herramientas',
                description: 'Herramientas manuales y eléctricas',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: uuidv4(),
                name: 'Muebles',
                description: 'Mobiliario para el hogar y oficina',
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('categorias', null, {});
    },
};
