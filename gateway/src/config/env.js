require('dotenv').config();

const PORT = process.env.PORT || 8080;
const USUARIOS_SERVICE_URL = process.env.USUARIOS_SERVICE_URL || 'http://localhost:3000';
const INVENTARIO_SERVICE_URL = process.env.INVENTARIO_SERVICE_URL || 'http://localhost:3001';
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error(' JWT_SECRET no está definido en las variables de entorno');
    process.exit(1);
}

module.exports = {
    PORT, USUARIOS_SERVICE_URL, INVENTARIO_SERVICE_URL, JWT_SECRET,
};
