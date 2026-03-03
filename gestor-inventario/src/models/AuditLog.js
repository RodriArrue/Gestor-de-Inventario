const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const AuditLog = sequelize.define('AuditLog', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: true,
            field: 'user_id',
            comment: 'UUID del usuario (del JWT del Gestor de Usuarios)',
        },
        action: {
            type: DataTypes.STRING(50),
            allowNull: false,
            comment: 'Tipo de acción (CREATE, READ, UPDATE, DELETE)',
        },
        resource: {
            type: DataTypes.STRING(255),
            allowNull: false,
            comment: 'Ruta del recurso accedido',
        },
        resourceId: {
            type: DataTypes.STRING(100),
            allowNull: true,
            field: 'resource_id',
            comment: 'ID del recurso afectado (si aplica)',
        },
        method: {
            type: DataTypes.STRING(10),
            allowNull: false,
            comment: 'Método HTTP (GET, POST, PUT, DELETE)',
        },
        statusCode: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'status_code',
            comment: 'Código de respuesta HTTP',
        },
        ipAddress: {
            type: DataTypes.STRING(45),
            allowNull: true,
            field: 'ip_address',
            comment: 'Dirección IP del cliente',
        },
        userAgent: {
            type: DataTypes.STRING(500),
            allowNull: true,
            field: 'user_agent',
            comment: 'User-Agent del cliente',
        },
        requestBody: {
            type: DataTypes.JSONB,
            allowNull: true,
            field: 'request_body',
            comment: 'Body de la request (sanitizado)',
        },
        responseTime: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'response_time',
            comment: 'Tiempo de respuesta en milisegundos',
        },
    }, {
        tableName: 'audit_logs',
        timestamps: true,
        updatedAt: false, // Solo necesitamos createdAt
        underscored: true,
        indexes: [
            { fields: ['user_id'] },
            { fields: ['action'] },
            { fields: ['resource'] },
            { fields: ['created_at'] },
            { fields: ['status_code'] },
        ],
    });

    return AuditLog;
};
