const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Producto = sequelize.define('Producto', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(200),
            allowNull: false,
            validate: {
                len: [2, 200],
            },
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        sku: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        price: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0,
            },
        },
        currentStock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            field: 'current_stock',
        },
        minStock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            field: 'min_stock',
        },
        maxStock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            field: 'max_stock',
        },
        categoriaId: {
            type: DataTypes.UUID,
            allowNull: true,
            field: 'categoria_id',
        },
        proveedorId: {
            type: DataTypes.UUID,
            allowNull: true,
            field: 'proveedor_id',
        },
    }, {
        tableName: 'productos',
        timestamps: true,
        underscored: true,
        paranoid: true,
        indexes: [
            { unique: true, fields: ['sku'] },
            { fields: ['categoria_id'] },
            { fields: ['proveedor_id'] },
            { fields: ['current_stock'] },
        ],
    });

    Producto.associate = (models) => {
        Producto.belongsTo(models.Categoria, {
            foreignKey: 'categoria_id',
            as: 'categoria',
        });
        Producto.belongsTo(models.Proveedor, {
            foreignKey: 'proveedor_id',
            as: 'proveedor',
        });
        Producto.hasMany(models.MovimientoStock, {
            foreignKey: 'producto_id',
            as: 'movimientos',
        });
    };

    return Producto;
};
