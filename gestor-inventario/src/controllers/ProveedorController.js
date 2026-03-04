const ProveedorService = require('../services/ProveedorService');

class ProveedorController {
    static async getAll(req, res, next) {
        try {
            const result = await ProveedorService.getAll(req.query);
            res.json({ status: 'success', ...result });
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            const proveedor = await ProveedorService.getById(req.params.id);
            res.json({ status: 'success', data: proveedor });
        } catch (error) {
            next(error);
        }
    }

    static async create(req, res, next) {
        try {
            const proveedor = await ProveedorService.create(req.body);
            res.status(201).json({ status: 'success', data: proveedor });
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const proveedor = await ProveedorService.update(req.params.id, req.body);
            res.json({ status: 'success', data: proveedor });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const result = await ProveedorService.delete(req.params.id);
            res.json({ status: 'success', ...result });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ProveedorController;
