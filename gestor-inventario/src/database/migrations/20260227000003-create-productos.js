'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('productos', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING(200),
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            sku: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true,
            },
            price: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: false,
                defaultValue: 0,
            },
            current_stock: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            min_stock: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            max_stock: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            categoria_id: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'categorias',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            proveedor_id: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'proveedores',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
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

        await queryInterface.addIndex('productos', ['sku'], { unique: true });
        await queryInterface.addIndex('productos', ['categoria_id']);
        await queryInterface.addIndex('productos', ['proveedor_id']);
        await queryInterface.addIndex('productos', ['current_stock']);
    },

    async down(queryInterface) {
        await queryInterface.dropTable('productos');
    },
};
