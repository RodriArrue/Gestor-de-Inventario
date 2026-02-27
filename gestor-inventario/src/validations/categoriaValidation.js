const { z } = require('zod');

const createCategoriaSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
    description: z.string().max(500).optional(),
});

const updateCategoriaSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    description: z.string().max(500).optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: 'Debe proporcionar al menos un campo para actualizar',
});

module.exports = { createCategoriaSchema, updateCategoriaSchema };
