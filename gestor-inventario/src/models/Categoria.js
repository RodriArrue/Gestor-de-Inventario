const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Categoria = sequelize.define('Categoria', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                len: [2, 100],
            },
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        tableName: 'categorias',
        timestamps: true,
        underscored: true,
        paranoid: true, // Soft delete
        indexes: [
            { fields: ['name'] },
        ],
    });

    Categoria.associate = (models) => {
        Categoria.hasMany(models.Producto, {
            foreignKey: 'categoria_id',
            as: 'productos',
        });
    };

    return Categoria;
};
