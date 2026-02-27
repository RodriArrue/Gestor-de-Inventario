const app = require('./app');
const { testConnection } = require('./config');
const { env } = require('./config/env');

const PORT = env.PORT;

const startServer = async () => {
    try {
        // Probar conexión a la base de datos
        await testConnection();

        if (env.NODE_ENV !== 'production') {
            console.log('💡 Ejecuta "npm run db:migrate" para aplicar migraciones pendientes.');
        }

        app.listen(PORT, () => {
            console.log(`🚀 Gestor de Inventario corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();
