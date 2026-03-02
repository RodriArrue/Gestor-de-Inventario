# 📦 Gestor de Inventario — Microservicio

Microservicio REST API para gestión de inventario: productos, categorías, proveedores y movimientos de stock. Parte del [Sistema de Microservicios](../README.md).

## Stack Tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| Node.js | 22+ | Runtime |
| Express | 5.x | Framework HTTP |
| Sequelize | 6.x | ORM (PostgreSQL) |
| Zod | 3.x | Validación de datos |
| Jest | 29.x | Testing |
| Docker | — | Contenedorización |

## Estructura del Proyecto

```
gestor-inventario/
├── Dockerfile
├── .sequelizerc
├── package.json
├── jest.config.js
└── src/
    ├── app.js                          # App Express
    ├── server.js                       # Entry point
    ├── config/
    │   ├── env.js                      # Variables de entorno (Zod)
    │   ├── database.js                 # Config Sequelize
    │   ├── swagger.js                  # Swagger/OpenAPI
    │   └── index.js                    # Export centralizado
    ├── models/
    │   ├── index.js                    # Registro de modelos
    │   ├── Categoria.js
    │   ├── Proveedor.js
    │   ├── Producto.js
    │   └── MovimientoStock.js
    ├── services/
    │   ├── CategoriaService.js
    │   ├── ProveedorService.js
    │   ├── ProductoService.js
    │   └── MovimientoStockService.js
    ├── controllers/
    │   ├── CategoriaController.js
    │   ├── ProveedorController.js
    │   ├── ProductoController.js
    │   └── MovimientoStockController.js
    ├── routes/
    │   ├── categorias.js
    │   ├── proveedores.js
    │   ├── productos.js
    │   └── movimientos.js
    ├── validations/
    │   ├── categoriaValidation.js
    │   ├── proveedorValidation.js
    │   ├── productoValidation.js
    │   └── movimientoValidation.js
    ├── middlewares/
    │   ├── auth.js                     # Validación JWT
    │   ├── validate.js                 # Validación Zod
    │   ├── errorHandler.js             # Manejo de errores
    │   └── rateLimiter.js              # Rate limiting
    ├── errors/
    │   └── AppError.js                 # Clases de error custom
    └── database/
        ├── migrations/                 # Migraciones Sequelize
        └── seeders/                    # Datos de ejemplo
```

## Entidades y Relaciones

```
Categoria ──┐
            ├──< Producto ──< MovimientoStock
Proveedor ──┘
```

| Entidad | Tabla | Descripción |
|---|---|---|
| **Categoria** | `categorias` | Clasificación de productos |
| **Proveedor** | `proveedores` | Proveedores con info de contacto |
| **Producto** | `productos` | Artículos con stock, precio, SKU único |
| **MovimientoStock** | `movimientos_stock` | Registro inmutable de entradas/salidas/ajustes |

## Endpoints

Todos los endpoints requieren JWT (`Authorization: Bearer <token>`).

### Categorías `/api/categorias`

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/` | Listar todas (con conteo de productos) |
| `GET` | `/:id` | Obtener por ID (con productos asociados) |
| `POST` | `/` | Crear nueva |
| `PUT` | `/:id` | Actualizar |
| `DELETE` | `/:id` | Eliminar (soft delete) |

### Proveedores `/api/proveedores`

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/` | Listar todos (con conteo de productos) |
| `GET` | `/:id` | Obtener por ID (con productos asociados) |
| `POST` | `/` | Crear nuevo |
| `PUT` | `/:id` | Actualizar |
| `DELETE` | `/:id` | Eliminar (soft delete) |

### Productos `/api/productos`

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/` | Listar todos (filtros opcionales) |
| `GET` | `/low-stock` | Productos con stock bajo |
| `GET` | `/sku/:sku` | Buscar por SKU |
| `GET` | `/:id` | Obtener por ID |
| `POST` | `/` | Crear nuevo |
| `PUT` | `/:id` | Actualizar |
| `DELETE` | `/:id` | Eliminar (soft delete) |

**Filtros disponibles en `GET /`:**
- `?categoriaId=<uuid>` — Filtrar por categoría
- `?proveedorId=<uuid>` — Filtrar por proveedor
- `?search=<texto>` — Buscar por nombre o SKU

### Movimientos de Stock `/api/movimientos`

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/` | Listar todos (filtro por tipo) |
| `GET` | `/producto/:productoId` | Historial de un producto |
| `POST` | `/` | Registrar movimiento |

**Tipos de movimiento:**
- `entrada` — Suma stock (compras, devoluciones)
- `salida` — Resta stock (ventas, consumo). Valida que no quede negativo
- `ajuste` — Establece stock absoluto (inventario físico)

> ⚠️ Los movimientos son **inmutables**: no se pueden editar ni eliminar. Cada movimiento actualiza el stock del producto de forma transaccional con row-level locking.

## Setup Local

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus datos de PostgreSQL

# Correr migraciones
npm run db:migrate

# Cargar datos de ejemplo
npm run db:seed

# Iniciar en desarrollo
npm run dev
```

## Variables de Entorno

| Variable | Default | Descripción |
|---|---|---|
| `NODE_ENV` | `development` | Entorno |
| `PORT` | `3001` | Puerto del servicio |
| `DB_HOST` | `localhost` | Host de PostgreSQL |
| `DB_PORT` | `5433` | Puerto de PostgreSQL |
| `DB_NAME` | `gestor_inventario` | Nombre de la DB |
| `DB_USER` | `postgres` | Usuario de DB |
| `DB_PASSWORD` | `postgres` | Password de DB |
| `JWT_SECRET` | — | Clave secreta JWT (compartida con Gestor de Usuarios) |

## Tests

```bash
# Correr todos los tests
npm test

# Tests con cobertura
npm test -- --coverage
```

**48 tests unitarios** cubriendo los 4 services:
- `CategoriaService` — 12 tests
- `ProveedorService` — 10 tests
- `ProductoService` — 16 tests
- `MovimientoStockService` — 10 tests

## Docker

```bash
# Build de la imagen
docker build -t gestor-inventario .

# O levantar con docker-compose desde la raíz del proyecto
cd ..
docker compose up --build
```

## Swagger

Documentación interactiva disponible en: `http://localhost:3001/api-docs`
