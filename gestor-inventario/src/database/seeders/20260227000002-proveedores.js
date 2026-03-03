const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert('proveedores', [
            {
                id: uuidv4(),
                name: 'TechDistribuidora S.A.',
                contact_name: 'Carlos Gómez',
                email: 'ventas@techdist.com',
                phone: '+54 11 4321-5678',
                address: 'Av. Corrientes 1234, CABA',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: uuidv4(),
                name: 'Textiles del Sur',
                contact_name: 'María López',
                email: 'contacto@textilesdelsur.com',
                phone: '+54 11 9876-5432',
                address: 'Ruta 3 Km 45, Buenos Aires',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: uuidv4(),
                name: 'Alimentos Frescos S.R.L.',
                contact_name: 'Juan Pérez',
                email: 'pedidos@alimentosfrescos.com',
                phone: '+54 351 456-7890',
                address: 'Av. Colón 567, Córdoba',
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('proveedores', null, {});
    },
};
