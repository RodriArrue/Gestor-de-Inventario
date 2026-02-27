const { Proveedor, Producto } = require('../models');
const { NotFoundError, ConflictError } = require('../errors/AppError');

class ProveedorService {
    static async getAll() {
        return Proveedor.findAll({
            attributes: {
                include: [
                    [
                        Proveedor.sequelize.fn('COUNT', Proveedor.sequelize.col('productos.id')),
                        'productCount',
                    ],
                ],
            },
            include: [{
                model: Producto,
                as: 'productos',
                attributes: [],
            }],
            group: ['Proveedor.id'],
            order: [['name', 'ASC']],
        });
    }

    static async getById(id) {
        const proveedor = await Proveedor.findByPk(id, {
            include: [{
                model: Producto,
                as: 'productos',
                attributes: ['id', 'name', 'sku', 'current_stock'],
            }],
        });

        if (!proveedor) {
            throw new NotFoundError('Proveedor no encontrado');
        }

        return proveedor;
    }

    static async create(data) {
        const existing = await Proveedor.findOne({ where: { name: data.name } });
        if (existing) {
            throw new ConflictError('Ya existe un proveedor con ese nombre');
        }

        return Proveedor.create(data);
    }

    static async update(id, data) {
        const proveedor = await Proveedor.findByPk(id);
        if (!proveedor) {
            throw new NotFoundError('Proveedor no encontrado');
        }

        if (data.name && data.name !== proveedor.name) {
            const existing = await Proveedor.findOne({ where: { name: data.name } });
            if (existing) {
                throw new ConflictError('Ya existe un proveedor con ese nombre');
            }
        }

        return proveedor.update(data);
    }

    static async delete(id) {
        const proveedor = await Proveedor.findByPk(id);
        if (!proveedor) {
            throw new NotFoundError('Proveedor no encontrado');
        }

        await proveedor.destroy();
        return { message: 'Proveedor eliminado correctamente' };
    }
}

module.exports = ProveedorService;
