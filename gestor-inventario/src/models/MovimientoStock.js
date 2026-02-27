const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const MovimientoStock = sequelize.define('MovimientoStock', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        productoId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'producto_id',
        },
        type: {
            type: DataTypes.ENUM('entrada', 'salida', 'ajuste'),
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
            },
        },
        reason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'user_id',
            comment: 'UUID del usuario del Gestor de Usuarios (viene del JWT)',
        },
    }, {
        tableName: 'movimientos_stock',
        timestamps: true,
        underscored: true,
        paranoid: false, // Los movimientos son inmutables, no soft delete
        indexes: [
            { fields: ['producto_id'] },
            { fields: ['type'] },
            { fields: ['user_id'] },
            { fields: ['created_at'] },
        ],
    });

    MovimientoStock.associate = (models) => {
        MovimientoStock.belongsTo(models.Producto, {
            foreignKey: 'producto_id',
            as: 'producto',
        });
    };

    return MovimientoStock;
};
