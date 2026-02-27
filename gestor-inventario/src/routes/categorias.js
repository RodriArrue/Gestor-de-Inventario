const { Router } = require('express');
const CategoriaController = require('../controllers/CategoriaController');
const { authMiddleware } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { createCategoriaSchema, updateCategoriaSchema } = require('../validations/categoriaValidation');

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

/**
 * @swagger
 * /categorias:
 *   get:
 *     summary: Listar todas las categorías
 *     tags: [Categorías]
 *     responses:
 *       200:
 *         description: Lista de categorías
 */
router.get('/', CategoriaController.getAll);

/**
 * @swagger
 * /categorias/{id}:
 *   get:
 *     summary: Obtener una categoría por ID
 *     tags: [Categorías]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 */
router.get('/:id', CategoriaController.getById);

/**
 * @swagger
 * /categorias:
 *   post:
 *     summary: Crear una nueva categoría
 *     tags: [Categorías]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 */
router.post('/', validate(createCategoriaSchema), CategoriaController.create);

/**
 * @swagger
 * /categorias/{id}:
 *   put:
 *     summary: Actualizar una categoría
 *     tags: [Categorías]
 */
router.put('/:id', validate(updateCategoriaSchema), CategoriaController.update);

/**
 * @swagger
 * /categorias/{id}:
 *   delete:
 *     summary: Eliminar una categoría
 *     tags: [Categorías]
 */
router.delete('/:id', CategoriaController.delete);

module.exports = router;
