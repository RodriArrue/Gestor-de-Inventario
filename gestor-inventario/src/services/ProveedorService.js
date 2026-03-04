const { Proveedor, Producto } = require('../models');
const { NotFoundError, ConflictError } = require('../errors/AppError');
const { parsePagination, buildPaginationMeta } = require('../utils/pagination');

class ProveedorService {
    /**
     * Obtener todos los proveedores con conteo de productos (paginado).
     */
    static async getAll(query = {}) {
        const { page, limit, offset } = parsePagination(query);

        const totalItems = await Proveedor.count();

        const rows = await Proveedor.findAll({
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
            limit,
            offset,
        });

        return {
            data: rows,
            pagination: buildPaginationMeta(totalItems, page, limit),
        };
    }

    /**
     * Obtener un proveedor por ID.
     */
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

    /**
     * Crear un nuevo proveedor.
     */
    static async create(data) {
        const existing = await Proveedor.findOne({ where: { name: data.name } });
        if (existing) {
            throw new ConflictError('Ya existe un proveedor con ese nombre');
        }

        return Proveedor.create(data);
    }

    /**
     * Actualizar un proveedor existente.
     */
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

    /**
     * Eliminar un proveedor (soft delete).
     */
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
