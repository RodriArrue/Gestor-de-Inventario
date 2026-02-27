# 🏗️ Sistema de Microservicios — Gestión de Inventario

Sistema de microservicios compuesto por un **Gestor de Usuarios** (RBAC), un **Gestor de Inventario** y un **API Gateway**, orquestados con Docker Compose.

## Arquitectura

```
Cliente → API Gateway (:8080) → ┬─ Gestor de Usuarios  (:3000) → PostgreSQL
                                └─ Gestor de Inventario (:3001) → PostgreSQL
```

## Servicios

| Servicio | Puerto | Descripción |
|---|---|---|
| **API Gateway** | 8080 | Punto de entrada único, proxy reverso |
| **Gestor de Usuarios** | 3000 | Autenticación, RBAC, gestión de usuarios |
| **Gestor de Inventario** | 3001 | Productos, categorías, proveedores, stock |

## Requisitos

- [Docker](https://docs.docker.com/get-docker/) & Docker Compose
- [Node.js 22+](https://nodejs.org/) (para desarrollo local)
- El repositorio [Gestor-de-Usuarios](https://github.com/RodriArrue/Gestor-de-Usuarios) clonado en la misma carpeta padre

## Estructura de carpetas

```
../
├── GestordeUsuarios/          ← Repo separado (ya existente)
└── inventario/                ← Este repo
    ├── docker-compose.yml
    ├── gateway/
    └── gestor-inventario/
```

## Setup Rápido

```bash
# 1. Clonar ambos repos en la misma carpeta
git clone https://github.com/RodriArrue/Gestor-de-Usuarios.git GestordeUsuarios
git clone <url-de-este-repo> inventario

# 2. Configurar variables de entorno
cd inventario
cp .env.example .env

# 3. Levantar todo
docker compose up --build
```

## Endpoints (vía Gateway)

### Autenticación (Gestor de Usuarios)
- `POST /api/auth/register` — Registro
- `POST /api/auth/login` — Login (retorna JWT)

### Inventario (requiere JWT)
- `GET/POST /api/categorias` — Categorías
- `GET/POST /api/proveedores` — Proveedores
- `GET/POST /api/productos` — Productos
- `GET /api/productos/low-stock` — Alertas de stock bajo
- `GET/POST /api/movimientos` — Movimientos de stock

## Documentación API (Swagger)

- Gestor de Usuarios: http://localhost:3000/api-docs
- Gestor de Inventario: http://localhost:3001/api-docs

## Tecnologías

- **Backend**: Node.js, Express 5, Sequelize 6
- **Base de datos**: PostgreSQL 16
- **Validación**: Zod
- **Auth**: JWT + RBAC
- **Contenedores**: Docker & Docker Compose
- **Tests**: Jest + Supertest
