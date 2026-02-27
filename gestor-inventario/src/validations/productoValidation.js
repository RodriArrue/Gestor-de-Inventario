const { z } = require('zod');

const createProductoSchema = z.object({
    name: z.string().min(2).max(200),
    description: z.string().max(1000).optional(),
    sku: z.string().min(1).max(50),
    price: z.number().min(0),
    currentStock: z.number().int().min(0).default(0),
    minStock: z.number().int().min(0).default(0),
    maxStock: z.number().int().min(0).default(0),
    categoriaId: z.string().uuid().optional(),
    proveedorId: z.string().uuid().optional(),
});

const updateProductoSchema = z.object({
    name: z.string().min(2).max(200).optional(),
    description: z.string().max(1000).optional(),
    sku: z.string().min(1).max(50).optional(),
    price: z.number().min(0).optional(),
    minStock: z.number().int().min(0).optional(),
    maxStock: z.number().int().min(0).optional(),
    categoriaId: z.string().uuid().optional(),
    proveedorId: z.string().uuid().optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: 'Debe proporcionar al menos un campo para actualizar',
});

module.exports = { createProductoSchema, updateProductoSchema };
