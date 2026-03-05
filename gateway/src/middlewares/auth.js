const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

/**
 * Rutas que NO requieren autenticación.
 * Login, registro, y rutas públicas del gateway.
 */
const PUBLIC_ROUTES = [
    '/health',
    '/api/auth/login',
    '/api/auth/register',
];

/**
 * Prefijos que son completamente públicos.
 */
const PUBLIC_PREFIXES = [
    '/api/auth',
];

/**
 * Middleware de validación JWT para el Gateway.
 * Verifica el token ANTES de hacer proxy al servicio upstream.
 * Si el token es válido, la request pasa; si no, se rechaza con 401.
 */
const gatewayAuth = (req, res, next) => {
    // Permitir rutas públicas
    if (PUBLIC_ROUTES.includes(req.path)) {
        return next();
    }

    // Permitir prefijos públicos
    const isPublic = PUBLIC_PREFIXES.some((prefix) => req.path.startsWith(prefix));
    if (isPublic) {
        return next();
    }

    // Verificar header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            status: 'error',
            message: 'Token de acceso no proporcionado',
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // Inyectar info del usuario en headers para los servicios downstream
        req.headers['x-user-id'] = decoded.id;
        req.headers['x-user-email'] = decoded.email;
        req.headers['x-user-role'] = decoded.role || '';

        next();
    } catch (err) {
        const message = err.name === 'TokenExpiredError'
            ? 'Token expirado'
            : 'Token inválido';

        return res.status(401).json({
            status: 'error',
            message,
        });
    }
};

module.exports = { gatewayAuth };
