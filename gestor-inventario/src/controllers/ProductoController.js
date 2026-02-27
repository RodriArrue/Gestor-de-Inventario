const ProductoService = require('../services/ProductoService');

class ProductoController {
    static async getAll(req, res, next) {
        try {
            const productos = await ProductoService.getAll(req.query);
            res.json({ status: 'success', data: productos });
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            const producto = await ProductoService.getById(req.params.id);
            res.json({ status: 'success', data: producto });
        } catch (error) {
            next(error);
        }
    }

    static async getBySku(req, res, next) {
        try {
            const producto = await ProductoService.getBySku(req.params.sku);
            res.json({ status: 'success', data: producto });
        } catch (error) {
            next(error);
        }
    }

    static async getLowStock(req, res, next) {
        try {
            const productos = await ProductoService.getLowStock();
            res.json({ status: 'success', data: productos });
        } catch (error) {
            next(error);
        }
    }

    static async create(req, res, next) {
        try {
            const producto = await ProductoService.create(req.body);
            res.status(201).json({ status: 'success', data: producto });
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const producto = await ProductoService.update(req.params.id, req.body);
            res.json({ status: 'success', data: producto });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const result = await ProductoService.delete(req.params.id);
            res.json({ status: 'success', ...result });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ProductoController;
