const { z } = require('zod');

const createProveedorSchema = z.object({
    name: z.string().min(2).max(150),
    contactName: z.string().max(100).optional(),
    email: z.string().email('Email inválido').optional(),
    phone: z.string().max(30).optional(),
    address: z.string().max(500).optional(),
});

const updateProveedorSchema = z.object({
    name: z.string().min(2).max(150).optional(),
    contactName: z.string().max(100).optional(),
    email: z.string().email('Email inválido').optional(),
    phone: z.string().max(30).optional(),
    address: z.string().max(500).optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: 'Debe proporcionar al menos un campo para actualizar',
});

module.exports = { createProveedorSchema, updateProveedorSchema };
