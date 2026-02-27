const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Proveedor = sequelize.define('Proveedor', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
            validate: {
                len: [2, 150],
            },
        },
        contactName: {
            type: DataTypes.STRING(100),
            allowNull: true,
            field: 'contact_name',
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: true,
            validate: {
                isEmail: true,
            },
        },
        phone: {
            type: DataTypes.STRING(30),
            allowNull: true,
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        tableName: 'proveedores',
        timestamps: true,
        underscored: true,
        paranoid: true,
        indexes: [
            { fields: ['name'] },
            { fields: ['email'] },
        ],
    });

    Proveedor.associate = (models) => {
        Proveedor.hasMany(models.Producto, {
            foreignKey: 'proveedor_id',
            as: 'productos',
        });
    };

    return Proveedor;
};
