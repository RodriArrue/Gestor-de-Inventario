const { Router } = require('express');
const MovimientoStockController = require('../controllers/MovimientoStockController');
const { authMiddleware } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { createMovimientoSchema } = require('../validations/movimientoValidation');

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /movimientos:
 *   get:
 *     summary: Listar todos los movimientos de stock
 *     tags: [Movimientos de Stock]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [entrada, salida, ajuste]
 */
router.get('/', MovimientoStockController.getAll);

/**
 * @swagger
 * /movimientos/producto/{productoId}:
 *   get:
 *     summary: Historial de movimientos de un producto
 *     tags: [Movimientos de Stock]
 */
router.get('/producto/:productoId', MovimientoStockController.getByProductoId);

/**
 * @swagger
 * /movimientos:
 *   post:
 *     summary: Registrar un movimiento de stock
 *     tags: [Movimientos de Stock]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productoId, type, quantity]
 *             properties:
 *               productoId:
 *                 type: string
 *                 format: uuid
 *               type:
 *                 type: string
 *                 enum: [entrada, salida, ajuste]
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *               reason:
 *                 type: string
 */
router.post('/', validate(createMovimientoSchema), MovimientoStockController.create);

module.exports = router;
