'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('proveedores', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING(150),
                allowNull: false,
                unique: true,
            },
            contact_name: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            email: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            phone: {
                type: Sequelize.STRING(30),
                allowNull: true,
            },
            address: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('NOW()'),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('NOW()'),
            },
            deleted_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
        });

        await queryInterface.addIndex('proveedores', ['name']);
        await queryInterface.addIndex('proveedores', ['email']);
    },

    async down(queryInterface) {
        await queryInterface.dropTable('proveedores');
    },
};
