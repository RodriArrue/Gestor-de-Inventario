const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Gestor de Inventario API',
            version: '1.0.0',
            description: 'API REST para gestión de inventario — Microservicio.\n\n'
                + 'Gestiona productos, categorías, proveedores y movimientos de stock.\n\n'
                + '**Autenticación**: Todas las rutas requieren un token JWT emitido por el Gestor de Usuarios.',
            contact: {
                name: 'Rodrigo Arrue',
            },
        },
        servers: [
            {
                url: '/api',
                description: 'API base',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Token JWT emitido por el Gestor de Usuarios',
                },
            },
            schemas: {
                // ========== Categoría ==========
                Categoria: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
                        name: { type: 'string', example: 'Electrónica' },
                        description: { type: 'string', example: 'Dispositivos y componentes electrónicos' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                CategoriaConConteo: {
                    allOf: [
                        { $ref: '#/components/schemas/Categoria' },
                        {
                            type: 'object',
                            properties: {
                                productCount: { type: 'integer', example: 5 },
                            },
                        },
                    ],
                },
                CreateCategoria: {
                    type: 'object',
                    required: ['name'],
                    properties: {
                        name: {
                            type: 'string', minLength: 2, maxLength: 100, example: 'Herramientas',
                        },
                        description: { type: 'string', maxLength: 500, example: 'Herramientas manuales y eléctricas' },
                    },
                },
                UpdateCategoria: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', minLength: 2, maxLength: 100 },
                        description: { type: 'string', maxLength: 500 },
                    },
                },

                // ========== Proveedor ==========
                Proveedor: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string', example: 'TechDistribuidora S.A.' },
                        contactName: { type: 'string', example: 'Carlos Gómez' },
                        email: { type: 'string', format: 'email', example: 'ventas@techdist.com' },
                        phone: { type: 'string', example: '+54 11 4321-5678' },
                        address: { type: 'string', example: 'Av. Corrientes 1234, CABA' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                CreateProveedor: {
                    type: 'object',
                    required: ['name'],
                    properties: {
                        name: {
                            type: 'string', minLength: 2, maxLength: 150, example: 'NuevoProveedor S.A.',
                        },
                        contactName: { type: 'string', maxLength: 100, example: 'Juan Pérez' },
                        email: { type: 'string', format: 'email', example: 'contacto@proveedor.com' },
                        phone: { type: 'string', maxLength: 30, example: '+54 11 1234-5678' },
                        address: { type: 'string', maxLength: 500, example: 'Av. San Martín 456' },
                    },
                },
                UpdateProveedor: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', minLength: 2, maxLength: 150 },
                        contactName: { type: 'string', maxLength: 100 },
                        email: { type: 'string', format: 'email' },
                        phone: { type: 'string', maxLength: 30 },
                        address: { type: 'string', maxLength: 500 },
                    },
                },

                // ========== Producto ==========
                Producto: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string', example: 'Notebook Lenovo IdeaPad 15' },
                        description: { type: 'string', example: 'Notebook 15.6" Intel Core i5' },
                        sku: { type: 'string', example: 'ELEC-NB-001' },
                        price: { type: 'number', format: 'decimal', example: 450000.00 },
                        currentStock: { type: 'integer', example: 25 },
                        minStock: { type: 'integer', example: 5 },
                        maxStock: { type: 'integer', example: 50 },
                        categoriaId: { type: 'string', format: 'uuid' },
                        proveedorId: { type: 'string', format: 'uuid' },
                        categoria: { $ref: '#/components/schemas/Categoria' },
                        proveedor: { $ref: '#/components/schemas/Proveedor' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                CreateProducto: {
                    type: 'object',
                    required: ['name', 'sku', 'price'],
                    properties: {
                        name: {
                            type: 'string', minLength: 2, maxLength: 200, example: 'Mouse Inalámbrico',
                        },
                        description: { type: 'string', maxLength: 1000, example: 'Mouse con receptor USB nano' },
                        sku: {
                            type: 'string', minLength: 1, maxLength: 50, example: 'ELEC-MS-002',
                        },
                        price: { type: 'number', minimum: 0, example: 15000.00 },
                        currentStock: {
                            type: 'integer', minimum: 0, default: 0, example: 50,
                        },
                        minStock: {
                            type: 'integer', minimum: 0, default: 0, example: 10,
                        },
                        maxStock: {
                            type: 'integer', minimum: 0, default: 0, example: 200,
                        },
                        categoriaId: { type: 'string', format: 'uuid' },
                        proveedorId: { type: 'string', format: 'uuid' },
                    },
                },
                UpdateProducto: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', minLength: 2, maxLength: 200 },
                        description: { type: 'string', maxLength: 1000 },
                        sku: { type: 'string', minLength: 1, maxLength: 50 },
                        price: { type: 'number', minimum: 0 },
                        minStock: { type: 'integer', minimum: 0 },
                        maxStock: { type: 'integer', minimum: 0 },
                        categoriaId: { type: 'string', format: 'uuid' },
                        proveedorId: { type: 'string', format: 'uuid' },
                    },
                },

                // ========== Movimiento Stock ==========
                MovimientoStock: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        productoId: { type: 'string', format: 'uuid' },
                        type: { type: 'string', enum: ['entrada', 'salida', 'ajuste'] },
                        quantity: { type: 'integer', example: 10 },
                        reason: { type: 'string', example: 'Compra a proveedor' },
                        userId: { type: 'string', format: 'uuid', description: 'UUID del usuario (del JWT)' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                CreateMovimiento: {
                    type: 'object',
                    required: ['productoId', 'type', 'quantity'],
                    properties: {
                        productoId: { type: 'string', format: 'uuid', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
                        type: {
                            type: 'string',
                            enum: ['entrada', 'salida', 'ajuste'],
                            description: 'entrada: suma stock | salida: resta stock | ajuste: establece valor absoluto',
                        },
                        quantity: { type: 'integer', minimum: 1, example: 10 },
                        reason: { type: 'string', maxLength: 500, example: 'Reposición de stock mensual' },
                    },
                },
                MovimientoResult: {
                    type: 'object',
                    properties: {
                        movimiento: { $ref: '#/components/schemas/MovimientoStock' },
                        producto: {
                            type: 'object',
                            properties: {
                                id: { type: 'string', format: 'uuid' },
                                name: { type: 'string' },
                                sku: { type: 'string' },
                                previousStock: { type: 'integer' },
                                currentStock: { type: 'integer' },
                            },
                        },
                    },
                },

                // ========== Respuestas comunes ==========
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'success' },
                        data: { type: 'object' },
                    },
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'error' },
                        message: { type: 'string', example: 'Recurso no encontrado' },
                    },
                },
            },
        },
        security: [{ bearerAuth: [] }],
        tags: [
            { name: 'Categorías', description: 'Gestión de categorías de productos' },
            { name: 'Proveedores', description: 'Gestión de proveedores' },
            { name: 'Productos', description: 'Gestión de productos e inventario' },
            { name: 'Movimientos de Stock', description: 'Registro de entradas, salidas y ajustes de stock' },
        ],
    },
    apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec };
