const request = require('supertest');
const { authHeader } = require('../helpers/setup');
const { createModelsMock } = require('../helpers/modelsMock');

const mockModels = createModelsMock();
jest.mock('../../src/models', () => mockModels);

const app = require('../../src/app');
const { Producto } = require('../../src/models');

describe('Integration: /api/productos', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockModels.AuditLog.create.mockResolvedValue();
    });

    describe('GET /api/productos', () => {
        it('200 con paginación', async () => {
            Producto.findAndCountAll.mockResolvedValue({
                count: 2,
                rows: [
                    { id: '1', name: 'Notebook', sku: 'NB-001' },
                    { id: '2', name: 'Mouse', sku: 'MS-001' },
                ],
            });

            const res = await request(app)
                .get('/api/productos')
                .set('Authorization', authHeader());

            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveLength(2);
            expect(res.body.pagination.totalItems).toBe(2);
        });

        it('200 con filtros', async () => {
            Producto.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });

            const res = await request(app)
                .get('/api/productos?categoriaId=cat-1&search=laptop')
                .set('Authorization', authHeader());

            expect(res.statusCode).toBe(200);
        });

        it('sin token → 401', async () => {
            const res = await request(app).get('/api/productos');
            expect(res.statusCode).toBe(401);
        });
    });

    describe('GET /api/productos/low-stock', () => {
        it('200 con productos de stock bajo', async () => {
            Producto.findAll.mockResolvedValue([
                { id: '1', name: 'Aceite', currentStock: 3, minStock: 10 },
            ]);

            const res = await request(app)
                .get('/api/productos/low-stock')
                .set('Authorization', authHeader());

            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveLength(1);
        });
    });

    describe('GET /api/productos/sku/:sku', () => {
        it('200 si encuentra el SKU', async () => {
            Producto.findOne.mockResolvedValue({ id: '1', name: 'Notebook', sku: 'NB-001' });

            const res = await request(app)
                .get('/api/productos/sku/NB-001')
                .set('Authorization', authHeader());

            expect(res.statusCode).toBe(200);
            expect(res.body.data.sku).toBe('NB-001');
        });

        it('404 si no existe', async () => {
            Producto.findOne.mockResolvedValue(null);

            const res = await request(app)
                .get('/api/productos/sku/NOEXISTE')
                .set('Authorization', authHeader());

            expect(res.statusCode).toBe(404);
        });
    });

    describe('POST /api/productos', () => {
        it('201 si válido', async () => {
            Producto.findOne.mockResolvedValue(null);
            Producto.create.mockResolvedValue({
                id: '1', name: 'Teclado', sku: 'KB-001', price: 32000,
            });

            const res = await request(app)
                .post('/api/productos')
                .set('Authorization', authHeader())
                .send({ name: 'Teclado', sku: 'KB-001', price: 32000 });

            expect(res.statusCode).toBe(201);
            expect(res.body.data.sku).toBe('KB-001');
        });

        it('400 si faltan campos', async () => {
            const res = await request(app)
                .post('/api/productos')
                .set('Authorization', authHeader())
                .send({ name: 'Sin SKU' });

            expect(res.statusCode).toBe(400);
        });

        it('409 si SKU duplicado', async () => {
            Producto.findOne.mockResolvedValue({ id: '1', sku: 'KB-001' });

            const res = await request(app)
                .post('/api/productos')
                .set('Authorization', authHeader())
                .send({ name: 'Teclado', sku: 'KB-001', price: 32000 });

            expect(res.statusCode).toBe(409);
        });
    });

    describe('GET /api/productos/:id', () => {
        it('200 si existe', async () => {
            Producto.findByPk.mockResolvedValue({ id: '1', name: 'Notebook' });

            const res = await request(app)
                .get('/api/productos/1')
                .set('Authorization', authHeader());

            expect(res.statusCode).toBe(200);
        });

        it('404 si no existe', async () => {
            Producto.findByPk.mockResolvedValue(null);

            const res = await request(app)
                .get('/api/productos/no-existe')
                .set('Authorization', authHeader());

            expect(res.statusCode).toBe(404);
        });
    });

    describe('DELETE /api/productos/:id', () => {
        it('200 si existe', async () => {
            Producto.findByPk.mockResolvedValue({ id: '1', destroy: jest.fn() });

            const res = await request(app)
                .delete('/api/productos/1')
                .set('Authorization', authHeader());

            expect(res.statusCode).toBe(200);
        });

        it('404 si no existe', async () => {
            Producto.findByPk.mockResolvedValue(null);

            const res = await request(app)
                .delete('/api/productos/no-existe')
                .set('Authorization', authHeader());

            expect(res.statusCode).toBe(404);
        });
    });
});
