const { Op } = require('sequelize');
const { Producto, Categoria, Proveedor } = require('../models');
const { NotFoundError, ConflictError } = require('../errors/AppError');

class ProductoService {
    /**
     * Obtener todos los productos con filtros opcionales.
     */
    static async getAll(query = {}) {
        const where = {};

        if (query.categoriaId) {
            where.categoria_id = query.categoriaId;
        }
        if (query.proveedorId) {
            where.proveedor_id = query.proveedorId;
        }
        if (query.search) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${query.search}%` } },
                { sku: { [Op.iLike]: `%${query.search}%` } },
            ];
        }

        return Producto.findAll({
            where,
            include: [
                { model: Categoria, as: 'categoria', attributes: ['id', 'name'] },
                { model: Proveedor, as: 'proveedor', attributes: ['id', 'name'] },
            ],
            order: [['name', 'ASC']],
        });
    }

    /**
     * Obtener un producto por ID.
     */
    static async getById(id) {
        const producto = await Producto.findByPk(id, {
            include: [
                { model: Categoria, as: 'categoria' },
                { model: Proveedor, as: 'proveedor' },
            ],
        });

        if (!producto) {
            throw new NotFoundError('Producto no encontrado');
        }

        return producto;
    }

    /**
     * Obtener un producto por SKU.
     */
    static async getBySku(sku) {
        const producto = await Producto.findOne({
            where: { sku },
            include: [
                { model: Categoria, as: 'categoria' },
                { model: Proveedor, as: 'proveedor' },
            ],
        });

        if (!producto) {
            throw new NotFoundError('Producto no encontrado');
        }

        return producto;
    }

    /**
     * Obtener productos con stock bajo (currentStock < minStock).
     */
    static async getLowStock() {
        return Producto.findAll({
            where: {
                [Op.and]: [
                    { min_stock: { [Op.gt]: 0 } },
                    Producto.sequelize.where(
                        Producto.sequelize.col('current_stock'),
                        Op.lt,
                        Producto.sequelize.col('min_stock')
                    ),
                ],
            },
            include: [
                { model: Categoria, as: 'categoria', attributes: ['id', 'name'] },
                { model: Proveedor, as: 'proveedor', attributes: ['id', 'name'] },
            ],
            order: [['current_stock', 'ASC']],
        });
    }

    /**
     * Crear un nuevo producto.
     */
    static async create(data) {
        const existing = await Producto.findOne({ where: { sku: data.sku } });
        if (existing) {
            throw new ConflictError('Ya existe un producto con ese SKU');
        }

        return Producto.create(data);
    }

    /**
     * Actualizar un producto.
     */
    static async update(id, data) {
        const producto = await Producto.findByPk(id);
        if (!producto) {
            throw new NotFoundError('Producto no encontrado');
        }

        if (data.sku && data.sku !== producto.sku) {
            const existing = await Producto.findOne({ where: { sku: data.sku } });
            if (existing) {
                throw new ConflictError('Ya existe un producto con ese SKU');
            }
        }

        return producto.update(data);
    }

    /**
     * Eliminar un producto (soft delete).
     */
    static async delete(id) {
        const producto = await Producto.findByPk(id);
        if (!producto) {
            throw new NotFoundError('Producto no encontrado');
        }

        await producto.destroy();
        return { message: 'Producto eliminado correctamente' };
    }
}

module.exports = ProductoService;
