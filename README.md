# E-Commerce Full-Stack

Proyecto de comercio electrónico con backend en Node.js/Express/Prisma y frontend en React/Vite/TypeScript.

## Estructura

```
├── backend/   → API REST (Node.js + Express + TypeScript + Prisma)
└── frontend/  → UI (React + TypeScript + Vite + Zustand)
```

## Backend

### Requisitos
- Node.js 18+
- PostgreSQL

### Setup
```bash
cd backend
npm install
cp .env.example .env        # edita las variables
npx prisma migrate dev      # crea las tablas en la DB
npm run dev                 # http://localhost:3000
```

### Endpoints principales

| Método | Ruta                     | Descripción              | Auth     |
|--------|--------------------------|--------------------------|----------|
| POST   | /api/auth/register       | Registrar usuario        |          |
| POST   | /api/auth/login          | Iniciar sesión           |          |
| GET    | /api/auth/me             | Perfil del usuario       | ✅       |
| GET    | /api/products            | Listar productos         |          |
| POST   | /api/products            | Crear producto           | Admin    |
| GET    | /api/cart                | Ver carrito              | ✅       |
| POST   | /api/cart/items          | Agregar al carrito       | ✅       |
| POST   | /api/orders              | Crear pedido             | ✅       |
| GET    | /api/orders              | Mis pedidos              | ✅       |

## Frontend

### Setup
```bash
cd frontend
npm install
cp .env.example .env        # ajusta VITE_API_URL si es necesario
npm run dev                 # http://localhost:5173
```

### Páginas
- `/` — Inicio
- `/products` — Catálogo de productos
- `/cart` — Carrito de compras (requiere login)
- `/orders` — Mis pedidos (requiere login)
- `/login` — Iniciar sesión
- `/register` — Crear cuenta

## Variables de entorno

### Backend `.env`
```
DATABASE_URL=******localhost:5432/ecommerce
JWT_SECRET=tu-secreto-seguro
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:3000/api
```
