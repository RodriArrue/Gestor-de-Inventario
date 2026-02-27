const { Router } = require('express');
const ProductoController = require('../controllers/ProductoController');
const { authMiddleware } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { createProductoSchema, updateProductoSchema } = require('../validations/productoValidation');

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /productos:
 *   get:
 *     summary: Listar productos con filtros opcionales
 *     tags: [Productos]
 *     parameters:
 *       - in: query
 *         name: categoriaId
 *         schema:
 *           type: string
 *       - in: query
 *         name: proveedorId
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nombre o SKU
 */
router.get('/', ProductoController.getAll);

/**
 * @swagger
 * /productos/low-stock:
 *   get:
 *     summary: Productos con stock bajo
 *     tags: [Productos]
 */
router.get('/low-stock', ProductoController.getLowStock);

/**
 * @swagger
 * /productos/sku/{sku}:
 *   get:
 *     summary: Buscar producto por SKU
 *     tags: [Productos]
 */
router.get('/sku/:sku', ProductoController.getBySku);

/**
 * @swagger
 * /productos/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags: [Productos]
 */
router.get('/:id', ProductoController.getById);

/**
 * @swagger
 * /productos:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Productos]
 */
router.post('/', validate(createProductoSchema), ProductoController.create);

/**
 * @swagger
 * /productos/{id}:
 *   put:
 *     summary: Actualizar un producto
 *     tags: [Productos]
 */
router.put('/:id', validate(updateProductoSchema), ProductoController.update);

/**
 * @swagger
 * /productos/{id}:
 *   delete:
 *     summary: Eliminar un producto
 *     tags: [Productos]
 */
router.delete('/:id', ProductoController.delete);

module.exports = router;
