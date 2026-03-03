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
 *     description: Retorna todos los movimientos de stock ordenados por fecha (más recientes primero). Permite filtrar por tipo.
 *     tags: [Movimientos de Stock]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [entrada, salida, ajuste]
 *         description: Filtrar por tipo de movimiento
 *     responses:
 *       200:
 *         description: Lista de movimientos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MovimientoStock'
 *       401:
 *         description: Token no proporcionado o inválido
 */
router.get('/', MovimientoStockController.getAll);

/**
 * @swagger
 * /movimientos/producto/{productoId}:
 *   get:
 *     summary: Historial de movimientos de un producto
 *     description: Retorna el producto con todos sus movimientos de stock ordenados por fecha.
 *     tags: [Movimientos de Stock]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productoId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID del producto
 *     responses:
 *       200:
 *         description: Producto con historial de movimientos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     producto:
 *                       $ref: '#/components/schemas/Producto'
 *                     movimientos:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/MovimientoStock'
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/producto/:productoId', MovimientoStockController.getByProductoId);

/**
 * @swagger
 * /movimientos:
 *   post:
 *     summary: Registrar un movimiento de stock
 *     description: |
 *       Crea un movimiento y actualiza el stock del producto de forma transaccional.
 *
 *       **Tipos de movimiento:**
 *       - `entrada` — Suma la cantidad al stock actual (compras, devoluciones)
 *       - `salida` — Resta la cantidad del stock actual (ventas, consumo). Falla si el stock resultante sería negativo
 *       - `ajuste` — Establece el stock al valor indicado (inventario físico)
 *
 *       El `userId` se extrae automáticamente del token JWT.
 *       Los movimientos son **inmutables**: no se pueden editar ni eliminar.
 *     tags: [Movimientos de Stock]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMovimiento'
 *           examples:
 *             entrada:
 *               summary: Entrada de stock
 *               value:
 *                 productoId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                 type: "entrada"
 *                 quantity: 50
 *                 reason: "Compra a proveedor - Factura #1234"
 *             salida:
 *               summary: Salida de stock
 *               value:
 *                 productoId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                 type: "salida"
 *                 quantity: 5
 *                 reason: "Venta - Pedido #5678"
 *             ajuste:
 *               summary: Ajuste de inventario
 *               value:
 *                 productoId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                 type: "ajuste"
 *                 quantity: 100
 *                 reason: "Inventario físico mensual"
 *     responses:
 *       201:
 *         description: Movimiento registrado y stock actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/MovimientoResult'
 *       400:
 *         description: Datos inválidos o stock insuficiente para salida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               message: "Stock insuficiente. Stock actual: 3, cantidad solicitada: 10"
 *       404:
 *         description: Producto no encontrado
 */
router.post('/', validate(createMovimientoSchema), MovimientoStockController.create);

module.exports = router;
