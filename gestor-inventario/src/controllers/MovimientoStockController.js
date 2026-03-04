const MovimientoStockService = require('../services/MovimientoStockService');

class MovimientoStockController {
    static async getAll(req, res, next) {
        try {
            const result = await MovimientoStockService.getAll(req.query);
            res.json({ status: 'success', ...result });
        } catch (error) {
            next(error);
        }
    }

    static async getByProductoId(req, res, next) {
        try {
            const result = await MovimientoStockService.getByProductoId(req.params.productoId);
            res.json({ status: 'success', data: result });
        } catch (error) {
            next(error);
        }
    }

    static async create(req, res, next) {
        try {
            // userId viene del JWT decodificado por authMiddleware
            const result = await MovimientoStockService.create(req.body, req.user.id);
            res.status(201).json({ status: 'success', data: result });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = MovimientoStockController;
