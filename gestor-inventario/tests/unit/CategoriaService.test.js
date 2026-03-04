const CategoriaService = require('../../src/services/CategoriaService');
const { NotFoundError, ConflictError } = require('../../src/errors/AppError');

// Mock de los modelos
jest.mock('../../src/models', () => {
    const mockCategoria = {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        count: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        sequelize: {
            fn: jest.fn(),
            col: jest.fn(),
        },
    };

    const mockProducto = {};

    return {
        Categoria: mockCategoria,
        Producto: mockProducto,
    };
});

const { Categoria } = require('../../src/models');

describe('CategoriaService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // ============================
    // getAll
    // ============================
    describe('getAll', () => {
        it('debe retornar categorías paginadas', async () => {
            const mockCategorias = [
                { id: '1', name: 'Electrónica', description: 'Dispositivos' },
                { id: '2', name: 'Ropa', description: 'Prendas' },
            ];
            Categoria.count.mockResolvedValue(2);
            Categoria.findAll.mockResolvedValue(mockCategorias);

            const result = await CategoriaService.getAll();

            expect(result.data).toEqual(mockCategorias);
            expect(result.pagination).toBeDefined();
            expect(result.pagination.totalItems).toBe(2);
            expect(result.pagination.currentPage).toBe(1);
        });

        it('debe respetar page y limit del query', async () => {
            Categoria.count.mockResolvedValue(50);
            Categoria.findAll.mockResolvedValue([]);

            const result = await CategoriaService.getAll({ page: '2', limit: '10' });

            expect(result.pagination.currentPage).toBe(2);
            expect(result.pagination.itemsPerPage).toBe(10);
            expect(result.pagination.totalPages).toBe(5);
            expect(result.pagination.hasNextPage).toBe(true);
            expect(result.pagination.hasPrevPage).toBe(true);
        });

        it('debe retornar array vacío si no hay categorías', async () => {
            Categoria.count.mockResolvedValue(0);
            Categoria.findAll.mockResolvedValue([]);

            const result = await CategoriaService.getAll();

            expect(result.data).toEqual([]);
            expect(result.pagination.totalItems).toBe(0);
        });
    });

    // ============================
    // getById
    // ============================
    describe('getById', () => {
        it('debe retornar una categoría por ID', async () => {
            const mockCategoria = { id: '1', name: 'Electrónica', productos: [] };
            Categoria.findByPk.mockResolvedValue(mockCategoria);

            const result = await CategoriaService.getById('1');

            expect(result).toEqual(mockCategoria);
            expect(Categoria.findByPk).toHaveBeenCalledWith('1', expect.any(Object));
        });

        it('debe lanzar NotFoundError si no existe', async () => {
            Categoria.findByPk.mockResolvedValue(null);

            await expect(CategoriaService.getById('999'))
                .rejects.toThrow(NotFoundError);
        });
    });

    // ============================
    // create
    // ============================
    describe('create', () => {
        it('debe crear una categoría exitosamente', async () => {
            const data = { name: 'Nueva Categoría', description: 'Descripción' };
            const mockCreated = { id: '1', ...data };

            Categoria.findOne.mockResolvedValue(null);
            Categoria.create.mockResolvedValue(mockCreated);

            const result = await CategoriaService.create(data);

            expect(result).toEqual(mockCreated);
            expect(Categoria.findOne).toHaveBeenCalledWith({ where: { name: data.name } });
            expect(Categoria.create).toHaveBeenCalledWith(data);
        });

        it('debe lanzar ConflictError si el nombre ya existe', async () => {
            const data = { name: 'Electrónica' };
            Categoria.findOne.mockResolvedValue({ id: '1', name: 'Electrónica' });

            await expect(CategoriaService.create(data))
                .rejects.toThrow(ConflictError);
            expect(Categoria.create).not.toHaveBeenCalled();
        });
    });

    // ============================
    // update
    // ============================
    describe('update', () => {
        it('debe actualizar una categoría existente', async () => {
            const mockCategoria = {
                id: '1',
                name: 'Electrónica',
                update: jest.fn().mockResolvedValue({ id: '1', name: 'Electrónica Actualizada' }),
            };
            Categoria.findByPk.mockResolvedValue(mockCategoria);
            Categoria.findOne.mockResolvedValue(null); // No existe otra con ese nombre

            await CategoriaService.update('1', { name: 'Electrónica Actualizada' });

            expect(mockCategoria.update).toHaveBeenCalledWith({ name: 'Electrónica Actualizada' });
        });

        it('debe lanzar NotFoundError si no existe', async () => {
            Categoria.findByPk.mockResolvedValue(null);

            await expect(CategoriaService.update('999', { name: 'Test' }))
                .rejects.toThrow(NotFoundError);
        });

        it('debe lanzar ConflictError si el nuevo nombre ya existe', async () => {
            const mockCategoria = { id: '1', name: 'Electrónica', update: jest.fn() };
            Categoria.findByPk.mockResolvedValue(mockCategoria);
            Categoria.findOne.mockResolvedValue({ id: '2', name: 'Ropa' });

            await expect(CategoriaService.update('1', { name: 'Ropa' }))
                .rejects.toThrow(ConflictError);
            expect(mockCategoria.update).not.toHaveBeenCalled();
        });

        it('no debe verificar duplicado si el nombre no cambia', async () => {
            const mockCategoria = {
                id: '1',
                name: 'Electrónica',
                update: jest.fn().mockResolvedValue({ id: '1', name: 'Electrónica', description: 'Nueva desc' }),
            };
            Categoria.findByPk.mockResolvedValue(mockCategoria);

            await CategoriaService.update('1', { description: 'Nueva desc' });

            expect(Categoria.findOne).not.toHaveBeenCalled();
            expect(mockCategoria.update).toHaveBeenCalled();
        });
    });

    // ============================
    // delete
    // ============================
    describe('delete', () => {
        it('debe eliminar una categoría exitosamente', async () => {
            const mockCategoria = { id: '1', destroy: jest.fn().mockResolvedValue() };
            Categoria.findByPk.mockResolvedValue(mockCategoria);

            const result = await CategoriaService.delete('1');

            expect(result).toEqual({ message: 'Categoría eliminada correctamente' });
            expect(mockCategoria.destroy).toHaveBeenCalledTimes(1);
        });

        it('debe lanzar NotFoundError si no existe', async () => {
            Categoria.findByPk.mockResolvedValue(null);

            await expect(CategoriaService.delete('999'))
                .rejects.toThrow(NotFoundError);
        });
    });
});
