const request = require('supertest');
const { authHeader } = require('../helpers/setup');
const { createModelsMock } = require('../helpers/modelsMock');

// Mock compartido con todos los modelos
const mockModels = createModelsMock();
jest.mock('../../src/models', () => mockModels);

const app = require('../../src/app');
const { Categoria } = require('../../src/models');

describe('Integration: /api/categorias', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // AuditLog siempre debe resolver para no bloquear
        mockModels.AuditLog.create.mockResolvedValue();
    });

    // ============================
    // Autenticación
    // ============================
    describe('Autenticación', () => {
        it('GET /api/categorias sin token → 401', async () => {
            const res = await request(app).get('/api/categorias');
            expect(res.statusCode).toBe(401);
        });

        it('GET /api/categorias con token inválido → 401', async () => {
            const res = await request(app)
                .get('/api/categorias')
                .set('Authorization', 'Bearer token_falso_invalido');
            expect(res.statusCode).toBe(401);
        });
    });

    // ============================
    // GET /api/categorias
    // ============================
    describe('GET /api/categorias', () => {
        it('debe retornar lista paginada con 200', async () => {
            Categoria.count.mockResolvedValue(1);
            Categoria.findAll.mockResolvedValue([{ id: '1', name: 'Electrónica' }]);

            const res = await request(app)
                .get('/api/categorias')
                .set('Authorization', authHeader());

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.data).toBeDefined();
            expect(res.body.pagination).toBeDefined();
            expect(res.body.pagination.totalItems).toBe(1);
        });

        it('debe respetar parámetros de paginación', async () => {
            Categoria.count.mockResolvedValue(50);
            Categoria.findAll.mockResolvedValue([]);

            const res = await request(app)
                .get('/api/categorias?page=2&limit=5')
                .set('Authorization', authHeader());

            expect(res.statusCode).toBe(200);
            expect(res.body.pagination.currentPage).toBe(2);
            expect(res.body.pagination.itemsPerPage).toBe(5);
            expect(res.body.pagination.totalPages).toBe(10);
        });
    });

    // ============================
    // GET /api/categorias/:id
    // ============================
    describe('GET /api/categorias/:id', () => {
        it('200 si existe', async () => {
            Categoria.findByPk.mockResolvedValue({ id: '1', name: 'Electrónica', productos: [] });

            const res = await request(app)
                .get('/api/categorias/1')
                .set('Authorization', authHeader());

            expect(res.statusCode).toBe(200);
            expect(res.body.data.name).toBe('Electrónica');
        });

        it('404 si no existe', async () => {
            Categoria.findByPk.mockResolvedValue(null);

            const res = await request(app)
                .get('/api/categorias/no-existe')
                .set('Authorization', authHeader());

            expect(res.statusCode).toBe(404);
        });
    });

    // ============================
    // POST /api/categorias
    // ============================
    describe('POST /api/categorias', () => {
        it('debe crear con 201', async () => {
            Categoria.findOne.mockResolvedValue(null);
            Categoria.create.mockResolvedValue({ id: '1', name: 'Muebles', description: 'Mobiliario' });

            const res = await request(app)
                .post('/api/categorias')
                .set('Authorization', authHeader())
                .send({ name: 'Muebles', description: 'Mobiliario' });

            expect(res.statusCode).toBe(201);
            expect(res.body.data.name).toBe('Muebles');
        });

        it('400 si falta name', async () => {
            const res = await request(app)
                .post('/api/categorias')
                .set('Authorization', authHeader())
                .send({ description: 'Sin nombre' });

            expect(res.statusCode).toBe(400);
        });

        it('409 si nombre duplicado', async () => {
            Categoria.findOne.mockResolvedValue({ id: '1', name: 'Electrónica' });

            const res = await request(app)
                .post('/api/categorias')
                .set('Authorization', authHeader())
                .send({ name: 'Electrónica' });

            expect(res.statusCode).toBe(409);
        });
    });

    // ============================
    // PUT /api/categorias/:id
    // ============================
    describe('PUT /api/categorias/:id', () => {
        it('200 si existe', async () => {
            Categoria.findByPk.mockResolvedValue({
                id: '1', name: 'Electrónica',
                update: jest.fn().mockResolvedValue({ id: '1', name: 'Tech' }),
            });
            Categoria.findOne.mockResolvedValue(null);

            const res = await request(app)
                .put('/api/categorias/1')
                .set('Authorization', authHeader())
                .send({ name: 'Tech' });

            expect(res.statusCode).toBe(200);
        });

        it('404 si no existe', async () => {
            Categoria.findByPk.mockResolvedValue(null);

            const res = await request(app)
                .put('/api/categorias/no-existe')
                .set('Authorization', authHeader())
                .send({ name: 'Algo' });

            expect(res.statusCode).toBe(404);
        });
    });

    // ============================
    // DELETE /api/categorias/:id
    // ============================
    describe('DELETE /api/categorias/:id', () => {
        it('200 si existe', async () => {
            Categoria.findByPk.mockResolvedValue({ id: '1', destroy: jest.fn() });

            const res = await request(app)
                .delete('/api/categorias/1')
                .set('Authorization', authHeader());

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toMatch(/eliminada/i);
        });

        it('404 si no existe', async () => {
            Categoria.findByPk.mockResolvedValue(null);

            const res = await request(app)
                .delete('/api/categorias/no-existe')
                .set('Authorization', authHeader());

            expect(res.statusCode).toBe(404);
        });
    });
});
