const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const { UnauthorizedError } = require('../errors/AppError');

/**
 * Middleware para verificar JWT.
 * Solo valida el token, NO consulta la DB de usuarios.
 * Extrae el payload y lo coloca en req.user.
 */
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedError('Token de acceso no proporcionado');
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (error) {
        if (error.isOperational) {
            return next(error);
        }
        return next(new UnauthorizedError('Token inválido o expirado'));
    }
};

module.exports = { authMiddleware };
