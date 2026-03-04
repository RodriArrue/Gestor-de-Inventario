const jwt = require('jsonwebtoken');
const { env } = require('../../src/config/env');

/**
 * Genera un token JWT válido para tests de integración.
 * Simula un token emitido por el Gestor de Usuarios.
 */
const generateTestToken = (payload = {}) => {
    const defaults = {
        id: 'test-user-uuid-1234',
        email: 'test@example.com',
        role: 'admin',
    };

    return jwt.sign({ ...defaults, ...payload }, env.JWT_SECRET, { expiresIn: '1h' });
};

/**
 * Header de autorización listo para Supertest.
 */
const authHeader = (payload) => `Bearer ${generateTestToken(payload)}`;

module.exports = { generateTestToken, authHeader };
