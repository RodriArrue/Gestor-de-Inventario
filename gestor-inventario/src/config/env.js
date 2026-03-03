const { z } = require('zod');
require('dotenv').config();

/**
 * Schema de validación para las variables de entorno del Gestor de Inventario.
 */
const envSchema = z.object({
    // App
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.string().regex(/^\d+$/).default('3001').transform(Number),

    // Database
    DB_HOST: z.string().default('localhost'),
    DB_PORT: z.string().regex(/^\d+$/).default('5433').transform(Number),
    DB_NAME: z.string().default('gestor_inventario'),
    DB_USER: z.string().default('postgres'),
    DB_PASSWORD: z.string().default('postgres'),

    // JWT (solo para validación, no emite tokens)
    JWT_SECRET: z.string().min(10, 'JWT_SECRET debe tener al menos 10 caracteres'),
});

/**
 * Valida y parsea las variables de entorno.
 * Lanza error descriptivo si la validación falla.
 */
const parseEnv = () => {
    const result = envSchema.safeParse(process.env);

    if (!result.success) {
        const errors = result.error.issues.map(
            (issue) => `  - ${issue.path.join('.')}: ${issue.message}`,
        );
        console.error('❌ Variables de entorno inválidas:');
        console.error(errors.join('\n'));
        process.exit(1);
    }

    return Object.freeze(result.data);
};

const env = parseEnv();

module.exports = { env };
