# 🚪 API Gateway — Microservicio

Proxy reverso que actúa como punto de entrada único al sistema de microservicios. Rutea las peticiones al servicio correspondiente según la ruta.

## Arquitectura

```
Cliente → Gateway (:8080) → ┬─ /api/auth/*         → Gestor de Usuarios  (:3000)
                            ├─ /api/users/*        → Gestor de Usuarios  (:3000)
                            ├─ /api/roles/*        → Gestor de Usuarios  (:3000)
                            ├─ /api/permissions/*  → Gestor de Usuarios  (:3000)
                            ├─ /api/categorias/*   → Gestor de Inventario (:3001)
                            ├─ /api/proveedores/*  → Gestor de Inventario (:3001)
                            ├─ /api/productos/*    → Gestor de Inventario (:3001)
                            └─ /api/movimientos/*  → Gestor de Inventario (:3001)
```

## Stack Tecnológico

| Tecnología | Uso |
|---|---|
| Express 5 | Framework HTTP |
| http-proxy-middleware | Proxy reverso |
| dotenv | Variables de entorno |
| Docker | Contenedorización |

## Estructura

```
gateway/
├── Dockerfile
├── package.json
└── src/
    ├── server.js           # Entry point
    ├── app.js              # Proxy config y rutas
    └── config/
        └── env.js          # Variables de entorno
```

## Endpoints Propios

| Ruta | Descripción |
|---|---|
| `GET /` | Info del gateway y URLs de servicios |
| `GET /health` | Health check con estado de upstreams |

## Setup Local

```bash
npm install
npm run dev
```

## Variables de Entorno

| Variable | Default | Descripción |
|---|---|---|
| `PORT` | `8080` | Puerto del gateway |
| `USUARIOS_SERVICE_URL` | `http://localhost:3000` | URL del Gestor de Usuarios |
| `INVENTARIO_SERVICE_URL` | `http://localhost:3001` | URL del Gestor de Inventario |

## Manejo de Errores

- **502 Bad Gateway** — Si un servicio no está disponible
- **404 Not Found** — Si la ruta no está mapeada a ningún servicio

## Docker

```bash
docker build -t api-gateway .

# O desde la raíz del proyecto
cd ..
docker compose up --build
```
