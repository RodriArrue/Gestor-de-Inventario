const rateLimit = require('express-rate-limit');

/**
 * Rate limiter global para la API.
 */
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por ventana
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 'error',
        statusCode: 429,
        message: 'Demasiadas peticiones, intente más tarde.',
    },
});

module.exports = { globalLimiter };
