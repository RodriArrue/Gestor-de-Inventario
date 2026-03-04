const request = require('supertest');
const { authHeader } = require('../helpers/setup');
const { createModelsMock } = require('../helpers/modelsMock');

const mockModels = createModelsMock();
jest.mock('../../src/models', () => mockModels);

const app = require('../../src/app');
const { MovimientoStock, Producto, sequelize } = require('../../src/models');

describe('Integration: /api/movimientos', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockModels.AuditLog.create.mockResolvedValue();
        // Re-setup transaction mock que se limpia con clearAllMocks
        sequelize.transaction.mockResolvedValue(sequelize._mockTransaction);
    });

    describe('GET /api/movimientos', () => {
        it('200 con paginación', async () => {
            MovimientoStock.findAndCountAll.mockResolvedValue({
                count: 1,
                rows: [{ id: '1', type: 'entrada', quantity: 10 }],
            });

            const res = await request(app)
                .get('/api/movimientos')
                .set('Authorization', authHeader());

            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveLength(1);
            expect(res.body.pagination).toBeDefined();
        });

        it('200 con filtro de tipo', async () => {
            MovimientoStock.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });

            const res = await request(app)
                .get('/api/movimientos?type=salida')
                .set('Authorization', authHeader());

            expect(res.statusCode).toBe(200);
        });

        it('sin token → 401', async () => {
            const res = await request(app).get('/api/movimientos');
            expect(res.statusCode).toBe(401);
        });
    });

    describe('GET /api/movimientos/producto/:productoId', () => {
        it('200 si el producto existe', async () => {
            Producto.findByPk.mockResolvedValue({ id: '1', name: 'Notebook' });
            MovimientoStock.findAll.mockResolvedValue([
                { id: 'm1', type: 'entrada', quantity: 10 },
            ]);

            const res = await request(app)
                .get('/api/movimientos/producto/1')
                .set('Authorization', authHeader());

            expect(res.statusCode).toBe(200);
            expect(res.body.data.producto).toBeDefined();
            expect(res.body.data.movimientos).toHaveLength(1);
        });

        it('404 si no existe', async () => {
            Producto.findByPk.mockResolvedValue(null);

            const res = await request(app)
                .get('/api/movimientos/producto/no-existe')
                .set('Authorization', authHeader());

            expect(res.statusCode).toBe(404);
        });
    });

    describe('POST /api/movimientos', () => {
        it('201 para entrada', async () => {
            const txMock = sequelize._mockTransaction;
            const prodUuid = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
            const mockProd = {
                id: prodUuid, name: 'Notebook', sku: 'NB-001', currentStock: 10,
                update: jest.fn().mockResolvedValue(),
            };

            Producto.findByPk.mockResolvedValue(mockProd);
            MovimientoStock.create.mockResolvedValue({
                id: 'm1', type: 'entrada', quantity: 5, productoId: prodUuid,
            });

            const res = await request(app)
                .post('/api/movimientos')
                .set('Authorization', authHeader())
                .send({ productoId: prodUuid, type: 'entrada', quantity: 5, reason: 'Compra' });

            expect(res.statusCode).toBe(201);
            expect(res.body.data.movimiento).toBeDefined();
            expect(res.body.data.producto).toBeDefined();
            expect(txMock.commit).toHaveBeenCalled();
        });

        it('400 si faltan campos requeridos', async () => {
            const res = await request(app)
                .post('/api/movimientos')
                .set('Authorization', authHeader())
                .send({ type: 'entrada' });

            expect(res.statusCode).toBe(400);
        });

        it('400 si type es inválido', async () => {
            const res = await request(app)
                .post('/api/movimientos')
                .set('Authorization', authHeader())
                .send({ productoId: '1', type: 'invalido', quantity: 5 });

            expect(res.statusCode).toBe(400);
        });

        it('404 si el producto no existe', async () => {
            Producto.findByPk.mockResolvedValue(null);

            const res = await request(app)
                .post('/api/movimientos')
                .set('Authorization', authHeader())
                .send({ productoId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', type: 'entrada', quantity: 5 });

            expect(res.statusCode).toBe(404);
        });

        it('400 si stock insuficiente para salida', async () => {
            const prodUuid = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
            Producto.findByPk.mockResolvedValue({
                id: prodUuid, name: 'Notebook', currentStock: 3,
                update: jest.fn(),
            });

            const res = await request(app)
                .post('/api/movimientos')
                .set('Authorization', authHeader())
                .send({ productoId: prodUuid, type: 'salida', quantity: 10 });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toMatch(/insuficiente/i);
        });
    });
});
