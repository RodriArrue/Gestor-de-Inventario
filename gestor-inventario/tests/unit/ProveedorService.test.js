const ProveedorService = require('../../src/services/ProveedorService');
const { NotFoundError, ConflictError } = require('../../src/errors/AppError');

jest.mock('../../src/models', () => {
    const mockProveedor = {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        sequelize: {
            fn: jest.fn(),
            col: jest.fn(),
        },
    };

    const mockProducto = {};

    return {
        Proveedor: mockProveedor,
        Producto: mockProducto,
    };
});

const { Proveedor } = require('../../src/models');

describe('ProveedorService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // ============================
    // getAll
    // ============================
    describe('getAll', () => {
        it('debe retornar todos los proveedores', async () => {
            const mockProveedores = [
                { id: '1', name: 'TechDist', email: 'ventas@tech.com' },
                { id: '2', name: 'Textiles', email: 'info@textiles.com' },
            ];
            Proveedor.findAll.mockResolvedValue(mockProveedores);

            const result = await ProveedorService.getAll();

            expect(result).toEqual(mockProveedores);
            expect(Proveedor.findAll).toHaveBeenCalledTimes(1);
        });
    });

    // ============================
    // getById
    // ============================
    describe('getById', () => {
        it('debe retornar un proveedor por ID', async () => {
            const mockProveedor = { id: '1', name: 'TechDist', productos: [] };
            Proveedor.findByPk.mockResolvedValue(mockProveedor);

            const result = await ProveedorService.getById('1');

            expect(result).toEqual(mockProveedor);
        });

        it('debe lanzar NotFoundError si no existe', async () => {
            Proveedor.findByPk.mockResolvedValue(null);

            await expect(ProveedorService.getById('999'))
                .rejects.toThrow(NotFoundError);
        });
    });

    // ============================
    // create
    // ============================
    describe('create', () => {
        it('debe crear un proveedor exitosamente', async () => {
            const data = { name: 'Nuevo Proveedor', email: 'nuevo@prov.com', phone: '+54 11 1234' };
            const mockCreated = { id: '1', ...data };

            Proveedor.findOne.mockResolvedValue(null);
            Proveedor.create.mockResolvedValue(mockCreated);

            const result = await ProveedorService.create(data);

            expect(result).toEqual(mockCreated);
            expect(Proveedor.create).toHaveBeenCalledWith(data);
        });

        it('debe lanzar ConflictError si el nombre ya existe', async () => {
            Proveedor.findOne.mockResolvedValue({ id: '1', name: 'TechDist' });

            await expect(ProveedorService.create({ name: 'TechDist' }))
                .rejects.toThrow(ConflictError);
            expect(Proveedor.create).not.toHaveBeenCalled();
        });
    });

    // ============================
    // update
    // ============================
    describe('update', () => {
        it('debe actualizar un proveedor existente', async () => {
            const mockProveedor = {
                id: '1',
                name: 'TechDist',
                update: jest.fn().mockResolvedValue({ id: '1', name: 'TechDist', phone: '+54 11 9999' }),
            };
            Proveedor.findByPk.mockResolvedValue(mockProveedor);

            await ProveedorService.update('1', { phone: '+54 11 9999' });

            expect(mockProveedor.update).toHaveBeenCalledWith({ phone: '+54 11 9999' });
        });

        it('debe lanzar NotFoundError si no existe', async () => {
            Proveedor.findByPk.mockResolvedValue(null);

            await expect(ProveedorService.update('999', { name: 'Test' }))
                .rejects.toThrow(NotFoundError);
        });

        it('debe lanzar ConflictError si el nuevo nombre ya existe', async () => {
            const mockProveedor = { id: '1', name: 'TechDist', update: jest.fn() };
            Proveedor.findByPk.mockResolvedValue(mockProveedor);
            Proveedor.findOne.mockResolvedValue({ id: '2', name: 'Textiles' });

            await expect(ProveedorService.update('1', { name: 'Textiles' }))
                .rejects.toThrow(ConflictError);
        });
    });

    // ============================
    // delete
    // ============================
    describe('delete', () => {
        it('debe eliminar un proveedor exitosamente', async () => {
            const mockProveedor = { id: '1', destroy: jest.fn().mockResolvedValue() };
            Proveedor.findByPk.mockResolvedValue(mockProveedor);

            const result = await ProveedorService.delete('1');

            expect(result).toEqual({ message: 'Proveedor eliminado correctamente' });
            expect(mockProveedor.destroy).toHaveBeenCalledTimes(1);
        });

        it('debe lanzar NotFoundError si no existe', async () => {
            Proveedor.findByPk.mockResolvedValue(null);

            await expect(ProveedorService.delete('999'))
                .rejects.toThrow(NotFoundError);
        });
    });
});
