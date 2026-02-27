const { env } = require('../config/env');

/**
 * Middleware centralizado de manejo de errores.
 */
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.isOperational
        ? err.message
        : 'Error interno del servidor';

    if (env.NODE_ENV === 'development') {
        console.error('❌ Error:', {
            message: err.message,
            statusCode,
            stack: err.stack,
        });
    }

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
    });
};

module.exports = { errorHandler };
