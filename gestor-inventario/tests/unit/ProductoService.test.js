const ProductoService = require('../../src/services/ProductoService');
const { NotFoundError, ConflictError } = require('../../src/errors/AppError');

jest.mock('../../src/models', () => {
    const mockProducto = {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        sequelize: {
            fn: jest.fn(),
            col: jest.fn(),
            where: jest.fn(),
        },
    };

    const mockCategoria = {};
    const mockProveedor = {};

    return {
        Producto: mockProducto,
        Categoria: mockCategoria,
        Proveedor: mockProveedor,
    };
});

const { Producto } = require('../../src/models');

describe('ProductoService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // ============================
    // getAll
    // ============================
    describe('getAll', () => {
        it('debe retornar todos los productos sin filtros', async () => {
            const mockProductos = [
                { id: '1', name: 'Laptop', sku: 'LAP-001' },
                { id: '2', name: 'Mouse', sku: 'MOU-001' },
            ];
            Producto.findAll.mockResolvedValue(mockProductos);

            const result = await ProductoService.getAll();

            expect(result).toEqual(mockProductos);
            expect(Producto.findAll).toHaveBeenCalledTimes(1);
        });

        it('debe filtrar por categoriaId', async () => {
            Producto.findAll.mockResolvedValue([]);

            await ProductoService.getAll({ categoriaId: 'cat-1' });

            const callArgs = Producto.findAll.mock.calls[0][0];
            expect(callArgs.where.categoria_id).toBe('cat-1');
        });

        it('debe filtrar por proveedorId', async () => {
            Producto.findAll.mockResolvedValue([]);

            await ProductoService.getAll({ proveedorId: 'prov-1' });

            const callArgs = Producto.findAll.mock.calls[0][0];
            expect(callArgs.where.proveedor_id).toBe('prov-1');
        });

        it('debe aplicar búsqueda por nombre o SKU', async () => {
            Producto.findAll.mockResolvedValue([]);

            await ProductoService.getAll({ search: 'laptop' });

            const callArgs = Producto.findAll.mock.calls[0][0];
            // Op.or es un Symbol, no aparece en Object.keys()
            const symbolKeys = Object.getOwnPropertySymbols(callArgs.where);
            expect(symbolKeys.length).toBeGreaterThan(0);
        });
    });

    // ============================
    // getById
    // ============================
    describe('getById', () => {
        it('debe retornar un producto por ID', async () => {
            const mockProducto = { id: '1', name: 'Laptop', sku: 'LAP-001' };
            Producto.findByPk.mockResolvedValue(mockProducto);

            const result = await ProductoService.getById('1');

            expect(result).toEqual(mockProducto);
        });

        it('debe lanzar NotFoundError si no existe', async () => {
            Producto.findByPk.mockResolvedValue(null);

            await expect(ProductoService.getById('999'))
                .rejects.toThrow(NotFoundError);
        });
    });

    // ============================
    // getBySku
    // ============================
    describe('getBySku', () => {
        it('debe retornar un producto por SKU', async () => {
            const mockProducto = { id: '1', name: 'Laptop', sku: 'LAP-001' };
            Producto.findOne.mockResolvedValue(mockProducto);

            const result = await ProductoService.getBySku('LAP-001');

            expect(result).toEqual(mockProducto);
            expect(Producto.findOne).toHaveBeenCalledWith(
                expect.objectContaining({ where: { sku: 'LAP-001' } }),
            );
        });

        it('debe lanzar NotFoundError si el SKU no existe', async () => {
            Producto.findOne.mockResolvedValue(null);

            await expect(ProductoService.getBySku('NOEXISTE'))
                .rejects.toThrow(NotFoundError);
        });
    });

    // ============================
    // create
    // ============================
    describe('create', () => {
        it('debe crear un producto exitosamente', async () => {
            const data = {
                name: 'Laptop', sku: 'LAP-001', price: 999.99, currentStock: 10,
            };
            const mockCreated = { id: '1', ...data };

            Producto.findOne.mockResolvedValue(null);
            Producto.create.mockResolvedValue(mockCreated);

            const result = await ProductoService.create(data);

            expect(result).toEqual(mockCreated);
            expect(Producto.create).toHaveBeenCalledWith(data);
        });

        it('debe lanzar ConflictError si el SKU ya existe', async () => {
            Producto.findOne.mockResolvedValue({ id: '1', sku: 'LAP-001' });

            await expect(ProductoService.create({ name: 'Laptop', sku: 'LAP-001', price: 999 }))
                .rejects.toThrow(ConflictError);
            expect(Producto.create).not.toHaveBeenCalled();
        });
    });

    // ============================
    // update
    // ============================
    describe('update', () => {
        it('debe actualizar un producto existente', async () => {
            const mockProducto = {
                id: '1',
                sku: 'LAP-001',
                update: jest.fn().mockResolvedValue({ id: '1', sku: 'LAP-001', price: 899 }),
            };
            Producto.findByPk.mockResolvedValue(mockProducto);

            await ProductoService.update('1', { price: 899 });

            expect(mockProducto.update).toHaveBeenCalledWith({ price: 899 });
        });

        it('debe lanzar NotFoundError si no existe', async () => {
            Producto.findByPk.mockResolvedValue(null);

            await expect(ProductoService.update('999', { price: 100 }))
                .rejects.toThrow(NotFoundError);
        });

        it('debe lanzar ConflictError si el nuevo SKU ya existe', async () => {
            const mockProducto = { id: '1', sku: 'LAP-001', update: jest.fn() };
            Producto.findByPk.mockResolvedValue(mockProducto);
            Producto.findOne.mockResolvedValue({ id: '2', sku: 'MOU-001' });

            await expect(ProductoService.update('1', { sku: 'MOU-001' }))
                .rejects.toThrow(ConflictError);
        });

        it('no debe verificar duplicado si el SKU no cambia', async () => {
            const mockProducto = {
                id: '1',
                sku: 'LAP-001',
                update: jest.fn().mockResolvedValue({ id: '1', sku: 'LAP-001', name: 'Laptop Pro' }),
            };
            Producto.findByPk.mockResolvedValue(mockProducto);

            await ProductoService.update('1', { name: 'Laptop Pro' });

            expect(Producto.findOne).not.toHaveBeenCalled();
            expect(mockProducto.update).toHaveBeenCalled();
        });
    });

    // ============================
    // delete
    // ============================
    describe('delete', () => {
        it('debe eliminar un producto exitosamente', async () => {
            const mockProducto = { id: '1', destroy: jest.fn().mockResolvedValue() };
            Producto.findByPk.mockResolvedValue(mockProducto);

            const result = await ProductoService.delete('1');

            expect(result).toEqual({ message: 'Producto eliminado correctamente' });
            expect(mockProducto.destroy).toHaveBeenCalledTimes(1);
        });

        it('debe lanzar NotFoundError si no existe', async () => {
            Producto.findByPk.mockResolvedValue(null);

            await expect(ProductoService.delete('999'))
                .rejects.toThrow(NotFoundError);
        });
    });
});
