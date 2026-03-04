/**
 * Fábrica de mock para jest.mock('../../src/models').
 * Incluye todos los modelos necesarios para que app.js cargue sin errores.
 */
const createModelsMock = () => {
    const mockSequelize = {
        authenticate: jest.fn().mockResolvedValue(),
        getDialect: jest.fn().mockReturnValue('postgres'),
        transaction: jest.fn(),
    };

    // Crear mockTransaction accesible externamente
    const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
    };
    mockSequelize.transaction.mockResolvedValue(mockTransaction);
    mockSequelize._mockTransaction = mockTransaction;

    const mockCategoria = {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        count: jest.fn(),
        sequelize: { fn: jest.fn(), col: jest.fn() },
    };

    const mockProveedor = {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        count: jest.fn(),
        sequelize: { fn: jest.fn(), col: jest.fn() },
    };

    const mockProducto = {
        findAll: jest.fn(),
        findAndCountAll: jest.fn(),
        findByPk: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        sequelize: { fn: jest.fn(), col: jest.fn(), where: jest.fn() },
    };

    const mockMovimientoStock = {
        findAll: jest.fn(),
        findAndCountAll: jest.fn(),
        create: jest.fn(),
    };

    const mockAuditLog = {
        create: jest.fn().mockResolvedValue(),
    };

    return {
        sequelize: mockSequelize,
        Categoria: mockCategoria,
        Proveedor: mockProveedor,
        Producto: mockProducto,
        MovimientoStock: mockMovimientoStock,
        AuditLog: mockAuditLog,
    };
};

module.exports = { createModelsMock };
