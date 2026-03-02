const MovimientoStockService = require('../../src/services/MovimientoStockService');
const { NotFoundError, BadRequestError } = require('../../src/errors/AppError');

// Mock de transacción — definido dentro del factory para evitar problemas de hoisting
const mockTransaction = {
    commit: jest.fn(),
    rollback: jest.fn(),
};

jest.mock('../../src/models', () => {
    // Re-declarar aquí porque jest.mock se hoistea
    const _mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
    };

    const mockProducto = {
        findByPk: jest.fn(),
        findAll: jest.fn(),
    };

    const mockMovimientoStock = {
        findAll: jest.fn(),
        create: jest.fn(),
    };

    return {
        sequelize: {
            transaction: jest.fn().mockResolvedValue(_mockTransaction),
            _mockTransaction, // Exponer para los tests
        },
        Producto: mockProducto,
        MovimientoStock: mockMovimientoStock,
    };
});

const { Producto, MovimientoStock, sequelize } = require('../../src/models');
// Obtener la referencia real al mock de transacción
const txMock = sequelize._mockTransaction;


describe('MovimientoStockService', () => {
    afterEach(() => {
        jest.clearAllMocks();
        txMock.commit.mockClear();
        txMock.rollback.mockClear();
    });

    // ============================
    // getAll
    // ============================
    describe('getAll', () => {
        it('debe retornar todos los movimientos', async () => {
            const mockMovimientos = [
                { id: '1', type: 'entrada', quantity: 10 },
                { id: '2', type: 'salida', quantity: 5 },
            ];
            MovimientoStock.findAll.mockResolvedValue(mockMovimientos);

            const result = await MovimientoStockService.getAll();

            expect(result).toEqual(mockMovimientos);
        });

        it('debe filtrar por tipo', async () => {
            MovimientoStock.findAll.mockResolvedValue([]);

            await MovimientoStockService.getAll({ type: 'entrada' });

            const callArgs = MovimientoStock.findAll.mock.calls[0][0];
            expect(callArgs.where.type).toBe('entrada');
        });
    });

    // ============================
    // getByProductoId
    // ============================
    describe('getByProductoId', () => {
        it('debe retornar movimientos de un producto', async () => {
            const mockProducto = { id: 'prod-1', name: 'Laptop' };
            const mockMovimientos = [{ id: '1', type: 'entrada', quantity: 10 }];

            Producto.findByPk.mockResolvedValue(mockProducto);
            MovimientoStock.findAll.mockResolvedValue(mockMovimientos);

            const result = await MovimientoStockService.getByProductoId('prod-1');

            expect(result.producto).toEqual(mockProducto);
            expect(result.movimientos).toEqual(mockMovimientos);
        });

        it('debe lanzar NotFoundError si el producto no existe', async () => {
            Producto.findByPk.mockResolvedValue(null);

            await expect(MovimientoStockService.getByProductoId('999'))
                .rejects.toThrow(NotFoundError);
        });
    });

    // ============================
    // create — Entrada
    // ============================
    describe('create — entrada', () => {
        it('debe crear entrada y aumentar el stock', async () => {
            const mockProducto = {
                id: 'prod-1',
                name: 'Laptop',
                sku: 'LAP-001',
                currentStock: 10,
                update: jest.fn().mockResolvedValue(),
            };
            const mockMovimiento = { id: 'mov-1', type: 'entrada', quantity: 5 };

            Producto.findByPk.mockResolvedValue(mockProducto);
            MovimientoStock.create.mockResolvedValue(mockMovimiento);

            const result = await MovimientoStockService.create(
                { productoId: 'prod-1', type: 'entrada', quantity: 5, reason: 'Compra' },
                'user-1'
            );

            // Stock debe pasar de 10 a 15
            expect(mockProducto.update).toHaveBeenCalledWith(
                { currentStock: 15 },
                { transaction: txMock }
            );
            expect(result.movimiento).toEqual(mockMovimiento);
            expect(result.producto.currentStock).toBe(15);
            expect(txMock.commit).toHaveBeenCalledTimes(1);
            expect(txMock.rollback).not.toHaveBeenCalled();
        });
    });

    // ============================
    // create — Salida
    // ============================
    describe('create — salida', () => {
        it('debe crear salida y disminuir el stock', async () => {
            const mockProducto = {
                id: 'prod-1',
                name: 'Laptop',
                sku: 'LAP-001',
                currentStock: 10,
                update: jest.fn().mockResolvedValue(),
            };
            const mockMovimiento = { id: 'mov-1', type: 'salida', quantity: 3 };

            Producto.findByPk.mockResolvedValue(mockProducto);
            MovimientoStock.create.mockResolvedValue(mockMovimiento);

            const result = await MovimientoStockService.create(
                { productoId: 'prod-1', type: 'salida', quantity: 3 },
                'user-1'
            );

            // Stock debe pasar de 10 a 7
            expect(mockProducto.update).toHaveBeenCalledWith(
                { currentStock: 7 },
                { transaction: txMock }
            );
            expect(result.producto.currentStock).toBe(7);
            expect(txMock.commit).toHaveBeenCalledTimes(1);
        });

        it('debe lanzar BadRequestError si stock insuficiente', async () => {
            const mockProducto = {
                id: 'prod-1',
                currentStock: 3,
                update: jest.fn(),
            };

            Producto.findByPk.mockResolvedValue(mockProducto);

            await expect(MovimientoStockService.create(
                { productoId: 'prod-1', type: 'salida', quantity: 10 },
                'user-1'
            )).rejects.toThrow(BadRequestError);

            expect(mockProducto.update).not.toHaveBeenCalled();
            expect(txMock.rollback).toHaveBeenCalledTimes(1);
            expect(txMock.commit).not.toHaveBeenCalled();
        });
    });

    // ============================
    // create — Ajuste
    // ============================
    describe('create — ajuste', () => {
        it('debe establecer el stock al valor indicado', async () => {
            const mockProducto = {
                id: 'prod-1',
                name: 'Laptop',
                sku: 'LAP-001',
                currentStock: 10,
                update: jest.fn().mockResolvedValue(),
            };
            const mockMovimiento = { id: 'mov-1', type: 'ajuste', quantity: 25 };

            Producto.findByPk.mockResolvedValue(mockProducto);
            MovimientoStock.create.mockResolvedValue(mockMovimiento);

            const result = await MovimientoStockService.create(
                { productoId: 'prod-1', type: 'ajuste', quantity: 25 },
                'user-1'
            );

            // Stock debe ser exactamente 25 (ajuste absoluto)
            expect(mockProducto.update).toHaveBeenCalledWith(
                { currentStock: 25 },
                { transaction: txMock }
            );
            expect(result.producto.currentStock).toBe(25);
        });
    });

    // ============================
    // create — Producto no encontrado
    // ============================
    describe('create — errores', () => {
        it('debe lanzar NotFoundError si el producto no existe', async () => {
            Producto.findByPk.mockResolvedValue(null);

            await expect(MovimientoStockService.create(
                { productoId: '999', type: 'entrada', quantity: 5 },
                'user-1'
            )).rejects.toThrow(NotFoundError);

            expect(txMock.rollback).toHaveBeenCalledTimes(1);
        });

        it('debe hacer rollback si hay un error inesperado', async () => {
            Producto.findByPk.mockRejectedValue(new Error('DB connection lost'));

            await expect(MovimientoStockService.create(
                { productoId: 'prod-1', type: 'entrada', quantity: 5 },
                'user-1'
            )).rejects.toThrow('DB connection lost');

            expect(txMock.rollback).toHaveBeenCalledTimes(1);
            expect(txMock.commit).not.toHaveBeenCalled();
        });
    });
});
