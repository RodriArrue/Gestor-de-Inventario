/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('movimientos_stock', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            producto_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'productos',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },
            type: {
                type: Sequelize.ENUM('entrada', 'salida', 'ajuste'),
                allowNull: false,
            },
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            reason: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                comment: 'UUID del usuario del Gestor de Usuarios',
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
        });

        await queryInterface.addIndex('movimientos_stock', ['producto_id']);
        await queryInterface.addIndex('movimientos_stock', ['type']);
        await queryInterface.addIndex('movimientos_stock', ['user_id']);
        await queryInterface.addIndex('movimientos_stock', ['created_at']);
    },

    async down(queryInterface) {
        await queryInterface.dropTable('movimientos_stock');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_movimientos_stock_type";');
    },
};
