const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const { swaggerSpec } = require('./config/swagger');
const { sequelize } = require('./models');

// Importar middlewares
const { errorHandler } = require('./middlewares/errorHandler');
const { globalLimiter } = require('./middlewares/rateLimiter');
const { auditMiddleware } = require('./middlewares/audit');

const app = express();

const startTime = Date.now();

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

// Auditoría automática (después del rate limiter, antes de las rutas)
app.use(auditMiddleware);

// Health check con verificación de DB
app.get('/health', async (req, res) => {
    const health = {
        status: 'OK',
        service: 'gestor-inventario',
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor((Date.now() - startTime) / 1000)}s`,
        database: { status: 'disconnected' },
    };

    try {
        const dbStart = Date.now();
        await sequelize.authenticate();
        health.database = {
            status: 'connected',
            latency: `${Date.now() - dbStart}ms`,
            dialect: sequelize.getDialect(),
        };
    } catch (err) {
        health.status = 'DEGRADED';
        health.database = {
            status: 'disconnected',
            error: err.message,
        };
        return res.status(503).json(health);
    }

    res.json(health);
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
