const { sequelize } = require('../models');
const { Producto, MovimientoStock } = require('../models');
const { NotFoundError, BadRequestError } = require('../errors/AppError');

class MovimientoStockService {
    /**
     * Obtener todos los movimientos con info del producto.
     */
    static async getAll(query = {}) {
        const where = {};

        if (query.type) {
            where.type = query.type;
        }

        return MovimientoStock.findAll({
            where,
            include: [{
                model: Producto,
                as: 'producto',
                attributes: ['id', 'name', 'sku', 'current_stock'],
            }],
            order: [['created_at', 'DESC']],
        });
    }

    /**
     * Obtener historial de movimientos de un producto específico.
     */
    static async getByProductoId(productoId) {
        const producto = await Producto.findByPk(productoId);
        if (!producto) {
            throw new NotFoundError('Producto no encontrado');
        }

        const movimientos = await MovimientoStock.findAll({
            where: { producto_id: productoId },
            order: [['created_at', 'DESC']],
        });

        return { producto, movimientos };
    }

    /**
     * Crear un movimiento de stock y actualizar el stock del producto.
     * Usa transacción para garantizar consistencia.
     */
    static async create(data, userId) {
        const t = await sequelize.transaction();

        try {
            const producto = await Producto.findByPk(data.productoId, { transaction: t, lock: true });
            if (!producto) {
                throw new NotFoundError('Producto no encontrado');
            }

            let newStock = producto.currentStock;

            switch (data.type) {
            case 'entrada':
                newStock += data.quantity;
                break;
            case 'salida':
                newStock -= data.quantity;
                if (newStock < 0) {
                    throw new BadRequestError(
                        `Stock insuficiente. Stock actual: ${producto.currentStock}, cantidad solicitada: ${data.quantity}`,
                    );
                }
                break;
            case 'ajuste':
                newStock = data.quantity;
                break;
            }

            // Actualizar stock del producto
            await producto.update({ currentStock: newStock }, { transaction: t });

            // Crear el registro del movimiento
            const movimiento = await MovimientoStock.create({
                productoId: data.productoId,
                type: data.type,
                quantity: data.quantity,
                reason: data.reason,
                userId,
            }, { transaction: t });

            await t.commit();

            return {
                movimiento,
                producto: {
                    id: producto.id,
                    name: producto.name,
                    sku: producto.sku,
                    previousStock: producto.currentStock,
                    currentStock: newStock,
                },
            };
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
}

module.exports = MovimientoStockService;
