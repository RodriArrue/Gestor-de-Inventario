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
 *     description: Retorna todos los productos. Soporta filtrado por categoría, proveedor y búsqueda por nombre o SKU.
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: categoriaId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrar por UUID de categoría
 *       - in: query
 *         name: proveedorId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrar por UUID de proveedor
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nombre o SKU (case insensitive)
 *     responses:
 *       200:
 *         description: Lista de productos
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
 *                     $ref: '#/components/schemas/Producto'
 *       401:
 *         description: Token no proporcionado o inválido
 */
router.get('/', ProductoController.getAll);

/**
 * @swagger
 * /productos/low-stock:
 *   get:
 *     summary: Productos con stock bajo
 *     description: Retorna los productos donde currentStock < minStock. Útil para alertas de reposición.
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos con stock bajo
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
 *                     $ref: '#/components/schemas/Producto'
 */
router.get('/low-stock', ProductoController.getLowStock);

/**
 * @swagger
 * /productos/sku/{sku}:
 *   get:
 *     summary: Buscar producto por SKU
 *     description: Retorna un producto buscando por su código SKU único.
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sku
 *         required: true
 *         schema:
 *           type: string
 *         description: Código SKU del producto
 *         example: ELEC-NB-001
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Producto'
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/sku/:sku', ProductoController.getBySku);

/**
 * @swagger
 * /productos/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     description: Retorna un producto con su categoría y proveedor asociados.
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID del producto
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Producto'
 *       404:
 *         description: Producto no encontrado
 */
router.get('/:id', ProductoController.getById);

/**
 * @swagger
 * /productos:
 *   post:
 *     summary: Crear un nuevo producto
 *     description: Crea un producto con SKU único. El stock se gestiona posteriormente vía movimientos.
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProducto'
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Producto'
 *       400:
 *         description: Datos de entrada inválidos
 *       409:
 *         description: Ya existe un producto con ese SKU
 */
router.post('/', validate(createProductoSchema), ProductoController.create);

/**
 * @swagger
 * /productos/{id}:
 *   put:
 *     summary: Actualizar un producto
 *     description: "Actualiza datos del producto. **Nota**: el campo currentStock no se puede modificar directamente, use movimientos de stock."
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID del producto a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProducto'
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Producto'
 *       404:
 *         description: Producto no encontrado
 *       409:
 *         description: Ya existe un producto con ese SKU
 */
router.put('/:id', validate(updateProductoSchema), ProductoController.update);

/**
 * @swagger
 * /productos/{id}:
 *   delete:
 *     summary: Eliminar un producto (soft delete)
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID del producto a eliminar
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Producto eliminado correctamente
 *       404:
 *         description: Producto no encontrado
 */
router.delete('/:id', ProductoController.delete);

module.exports = router;
