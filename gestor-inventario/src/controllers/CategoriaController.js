const CategoriaService = require('../services/CategoriaService');

class CategoriaController {
    static async getAll(req, res, next) {
        try {
            const categorias = await CategoriaService.getAll();
            res.json({ status: 'success', data: categorias });
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            const categoria = await CategoriaService.getById(req.params.id);
            res.json({ status: 'success', data: categoria });
        } catch (error) {
            next(error);
        }
    }

    static async create(req, res, next) {
        try {
            const categoria = await CategoriaService.create(req.body);
            res.status(201).json({ status: 'success', data: categoria });
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const categoria = await CategoriaService.update(req.params.id, req.body);
            res.json({ status: 'success', data: categoria });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const result = await CategoriaService.delete(req.params.id);
            res.json({ status: 'success', ...result });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = CategoriaController;
