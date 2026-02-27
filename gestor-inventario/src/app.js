const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const { swaggerSpec } = require('./config/swagger');

// Importar middlewares
const { errorHandler } = require('./middlewares/errorHandler');
const { globalLimiter } = require('./middlewares/rateLimiter');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Documentación Swagger (antes del rate limiter)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Gestor de Inventario - API Docs',
    customCss: '.swagger-ui .topbar { display: none }',
}));

// Rate limiting global
app.use('/api', globalLimiter);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'gestor-inventario', timestamp: new Date().toISOString() });
});

// Ruta base
app.get('/', (req, res) => {
    res.json({
        message: 'Gestor de Inventario API',
        version: '1.0.0',
    });
});

// Rutas de la API
const categoriasRoutes = require('./routes/categorias');
app.use('/api/categorias', categoriasRoutes);
const proveedoresRoutes = require('./routes/proveedores');
app.use('/api/proveedores', proveedoresRoutes);
const productosRoutes = require('./routes/productos');
app.use('/api/productos', productosRoutes);
const movimientosRoutes = require('./routes/movimientos');
app.use('/api/movimientos', movimientosRoutes);

// Middleware de manejo de errores (DESPUÉS de todas las rutas)
app.use(errorHandler);

module.exports = app;
