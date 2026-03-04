const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { USUARIOS_SERVICE_URL, INVENTARIO_SERVICE_URL } = require('./config/env');

const app = express();

const startTime = Date.now();

/**
 * Verifica un servicio upstream llamando a su /health.
 */
const checkUpstream = async (name, url) => {
    const start = Date.now();
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);
        const response = await fetch(`${url}/health`, { signal: controller.signal });
        clearTimeout(timeout);
        const latency = `${Date.now() - start}ms`;

        if (response.ok) {
            return { status: 'up', latency, url };
        }
        return { status: 'degraded', latency, url, statusCode: response.status };
    } catch (err) {
        return { status: 'down', url, error: err.message };
    }
};

// CORS global
app.use(cors());

// Health check con verificación de upstreams
app.get('/health', async (req, res) => {
    const [usuarios, inventario] = await Promise.all([
        checkUpstream('gestor-usuarios', USUARIOS_SERVICE_URL),
        checkUpstream('gestor-inventario', INVENTARIO_SERVICE_URL),
    ]);

    const allUp = usuarios.status === 'up' && inventario.status === 'up';

    const health = {
        status: allUp ? 'OK' : 'DEGRADED',
        service: 'api-gateway',
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor((Date.now() - startTime) / 1000)}s`,
        upstreams: {
            'gestor-usuarios': usuarios,
            'gestor-inventario': inventario,
        },
    };

    res.status(allUp ? 200 : 503).json(health);
});

// Ruta base
app.get('/', (req, res) => {
    res.json({
        message: 'API Gateway — Sistema de Microservicios',
        version: '1.0.0',
        services: {
            'gestor-usuarios': `${USUARIOS_SERVICE_URL}`,
            'gestor-inventario': `${INVENTARIO_SERVICE_URL}`,
        },
    });
});

// ========================================
// Proxy a Gestor de Usuarios
// ========================================
const usuariosProxy = createProxyMiddleware({
    target: USUARIOS_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: undefined, // mantiene la ruta original
    on: {
        proxyReq: (proxyReq, req) => {
            console.log(`[Gateway] → Usuarios: ${req.method} ${req.originalUrl}`);
        },
        error: (err, req, res) => {
            console.error('[Gateway] Error proxy Usuarios:', err.message);
            res.status(502).json({
                status: 'error',
                message: 'Servicio de Usuarios no disponible',
            });
        },
    },
});

app.use('/api/auth', usuariosProxy);
app.use('/api/users', usuariosProxy);
app.use('/api/roles', usuariosProxy);
app.use('/api/permissions', usuariosProxy);

// ========================================
// Proxy a Gestor de Inventario
// ========================================
const inventarioProxy = createProxyMiddleware({
    target: INVENTARIO_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: undefined,
    on: {
        proxyReq: (proxyReq, req) => {
            console.log(`[Gateway] → Inventario: ${req.method} ${req.originalUrl}`);
        },
        error: (err, req, res) => {
            console.error('[Gateway] Error proxy Inventario:', err.message);
            res.status(502).json({
                status: 'error',
                message: 'Servicio de Inventario no disponible',
            });
        },
    },
});

app.use('/api/categorias', inventarioProxy);
app.use('/api/proveedores', inventarioProxy);
app.use('/api/productos', inventarioProxy);
app.use('/api/movimientos', inventarioProxy);

// 404 para rutas no mapeadas
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
    });
});

module.exports = app;
