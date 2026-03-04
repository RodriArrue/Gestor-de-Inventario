const request = require('supertest');
const { authHeader } = require('../helpers/setup');
const { createModelsMock } = require('../helpers/modelsMock');

const mockModels = createModelsMock();
jest.mock('../../src/models', () => mockModels);

const app = require('../../src/app');
const { Proveedor } = require('../../src/models');

describe('Integration: /api/proveedores', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockModels.AuditLog.create.mockResolvedValue();
    });

    describe('GET /api/proveedores', () => {
        it('200 con paginación', async () => {
            Proveedor.count.mockResolvedValue(2);
            Proveedor.findAll.mockResolvedValue([
                { id: '1', name: 'TechDist' },
                { id: '2', name: 'Textiles' },
            ]);

            const res = await request(app)
                .get('/api/proveedores')
                .set('Authorization', authHeader());

            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveLength(2);
            expect(res.body.pagination.totalItems).toBe(2);
        });

        it('sin token → 401', async () => {
            const res = await request(app).get('/api/proveedores');
            expect(res.statusCode).toBe(401);
        });
    });

    describe('POST /api/proveedores', () => {
        it('201 si válido', async () => {
            Proveedor.findOne.mockResolvedValue(null);
            Proveedor.create.mockResolvedValue({ id: '1', name: 'NuevoProv', email: 'info@prov.com' });

            const res = await request(app)
                .post('/api/proveedores')
                .set('Authorization', authHeader())
                .send({ name: 'NuevoProv', email: 'info@prov.com' });

            expect(res.statusCode).toBe(201);
            expect(res.body.data.name).toBe('NuevoProv');
        });

        it('400 si falta name', async () => {
            const res = await request(app)
                .post('/api/proveedores')
                .set('Authorization', authHeader())
                .send({ email: 'test@test.com' });

            expect(res.statusCode).toBe(400);
        });

        it('409 si nombre duplicado', async () => {
            Proveedor.findOne.mockResolvedValue({ id: '1', name: 'Existente' });

            const res = await request(app)
                .post('/api/proveedores')
                .set('Authorization', authHeader())
                .send({ name: 'Existente' });

            expect(res.statusCode).toBe(409);
        });
    });

    describe('GET /api/proveedores/:id', () => {
        it('200 si existe', async () => {
            Proveedor.findByPk.mockResolvedValue({ id: '1', name: 'TechDist', productos: [] });

            const res = await request(app)
                .get('/api/proveedores/1')
                .set('Authorization', authHeader());

            expect(res.statusCode).toBe(200);
        });

        it('404 si no existe', async () => {
            Proveedor.findByPk.mockResolvedValue(null);

            const res = await request(app)
                .get('/api/proveedores/no-existe')
                .set('Authorization', authHeader());

            expect(res.statusCode).toBe(404);
        });
    });

    describe('DELETE /api/proveedores/:id', () => {
        it('200 si existe', async () => {
            Proveedor.findByPk.mockResolvedValue({ id: '1', destroy: jest.fn() });

            const res = await request(app)
                .delete('/api/proveedores/1')
                .set('Authorization', authHeader());

            expect(res.statusCode).toBe(200);
        });

        it('404 si no existe', async () => {
            Proveedor.findByPk.mockResolvedValue(null);

            const res = await request(app)
                .delete('/api/proveedores/no-existe')
                .set('Authorization', authHeader());

            expect(res.statusCode).toBe(404);
        });
    });
});
