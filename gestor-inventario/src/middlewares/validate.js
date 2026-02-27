const { BadRequestError } = require('../errors/AppError');

/**
 * Middleware de validación con Zod.
 * @param {import('zod').ZodSchema} schema - Schema Zod a validar
 * @param {'body'|'params'|'query'} source - Fuente de datos a validar
 */
const validate = (schema, source = 'body') => {
    return (req, res, next) => {
        const result = schema.safeParse(req[source]);

        if (!result.success) {
            const errors = result.error.issues.map(
                (issue) => `${issue.path.join('.')}: ${issue.message}`
            );
            return next(new BadRequestError(`Validación fallida: ${errors.join(', ')}`));
        }

        req[source] = result.data;
        next();
    };
};

module.exports = { validate };
