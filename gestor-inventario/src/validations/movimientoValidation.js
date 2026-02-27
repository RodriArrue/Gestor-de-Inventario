const { z } = require('zod');

const createMovimientoSchema = z.object({
    productoId: z.string().uuid('ID de producto inválido'),
    type: z.enum(['entrada', 'salida', 'ajuste'], {
        errorMap: () => ({ message: 'Tipo debe ser: entrada, salida o ajuste' }),
    }),
    quantity: z.number().int().min(1, 'La cantidad debe ser al menos 1'),
    reason: z.string().max(500).optional(),
});

module.exports = { createMovimientoSchema };
