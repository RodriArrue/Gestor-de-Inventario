const { Categoria, Producto } = require('../models');
const { NotFoundError, ConflictError } = require('../errors/AppError');

class CategoriaService {
    /**
     * Obtener todas las categorías con conteo de productos.
     */
    static async getAll() {
        return Categoria.findAll({
            attributes: {
                include: [
                    [
                        Categoria.sequelize.fn('COUNT', Categoria.sequelize.col('productos.id')),
                        'productCount',
                    ],
                ],
            },
            include: [{
                model: Producto,
                as: 'productos',
                attributes: [],
            }],
            group: ['Categoria.id'],
            order: [['name', 'ASC']],
        });
    }

    /**
     * Obtener una categoría por ID.
     */
    static async getById(id) {
        const categoria = await Categoria.findByPk(id, {
            include: [{
                model: Producto,
                as: 'productos',
                attributes: ['id', 'name', 'sku', 'current_stock'],
            }],
        });

        if (!categoria) {
            throw new NotFoundError('Categoría no encontrada');
        }

        return categoria;
    }

    /**
     * Crear una nueva categoría.
     */
    static async create(data) {
        const existing = await Categoria.findOne({ where: { name: data.name } });
        if (existing) {
            throw new ConflictError('Ya existe una categoría con ese nombre');
        }

        return Categoria.create(data);
    }

    /**
     * Actualizar una categoría existente.
     */
    static async update(id, data) {
        const categoria = await Categoria.findByPk(id);
        if (!categoria) {
            throw new NotFoundError('Categoría no encontrada');
        }

        if (data.name && data.name !== categoria.name) {
            const existing = await Categoria.findOne({ where: { name: data.name } });
            if (existing) {
                throw new ConflictError('Ya existe una categoría con ese nombre');
            }
        }

        return categoria.update(data);
    }

    /**
     * Eliminar una categoría (soft delete).
     */
    static async delete(id) {
        const categoria = await Categoria.findByPk(id);
        if (!categoria) {
            throw new NotFoundError('Categoría no encontrada');
        }

        await categoria.destroy();
        return { message: 'Categoría eliminada correctamente' };
    }
}

module.exports = CategoriaService;
