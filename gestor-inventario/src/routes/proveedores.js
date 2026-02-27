const { Router } = require('express');
const ProveedorController = require('../controllers/ProveedorController');
const { authMiddleware } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { createProveedorSchema, updateProveedorSchema } = require('../validations/proveedorValidation');

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /proveedores:
 *   get:
 *     summary: Listar todos los proveedores
 *     tags: [Proveedores]
 *     responses:
 *       200:
 *         description: Lista de proveedores
 */
router.get('/', ProveedorController.getAll);

/**
 * @swagger
 * /proveedores/{id}:
 *   get:
 *     summary: Obtener un proveedor por ID
 *     tags: [Proveedores]
 */
router.get('/:id', ProveedorController.getById);

/**
 * @swagger
 * /proveedores:
 *   post:
 *     summary: Crear un nuevo proveedor
 *     tags: [Proveedores]
 */
router.post('/', validate(createProveedorSchema), ProveedorController.create);

/**
 * @swagger
 * /proveedores/{id}:
 *   put:
 *     summary: Actualizar un proveedor
 *     tags: [Proveedores]
 */
router.put('/:id', validate(updateProveedorSchema), ProveedorController.update);

/**
 * @swagger
 * /proveedores/{id}:
 *   delete:
 *     summary: Eliminar un proveedor
 *     tags: [Proveedores]
 */
router.delete('/:id', ProveedorController.delete);

module.exports = router;
