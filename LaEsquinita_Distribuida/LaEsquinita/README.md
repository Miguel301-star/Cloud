# La Esquinita — arquitectura distribuida + modo offline

Proyecto base modular derivado del prototipo entregado.

## Arquitectura
- `frontend/`: PWA estática (HTML, CSS, JavaScript ES Modules).
- `backend/`: API REST Node.js + Express.
- `backend/sql/schema.sql`: PostgreSQL.
- `frontend/js/db/local-db.js`: IndexedDB y cola offline.
- `frontend/js/db/api.js`: comunicación HTTP con la API.
- `frontend/js/db/sync.js`: sincronización al recuperar conexión.

## Requisitos
- Node.js 20 o superior
- PostgreSQL 15 o superior
- Navegador moderno
- Para instalar la PWA y usar Service Worker, servir por HTTPS (o `localhost`).

## Arranque rápido

### 1. Base de datos
Crea una base de datos PostgreSQL llamada `la_esquinita` y ejecuta:

```bash
psql -U postgres -d la_esquinita -f backend/sql/schema.sql
```

### 2. Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 3. Frontend
En otra terminal:
```bash
cd frontend
npx serve .
```
Abre la URL local que indique `serve`. La API por defecto es `http://localhost:3000/api`.

## Configuración
Edita `frontend/js/config.js` si el backend está en otra dirección.
Edita `backend/.env` con tus credenciales PostgreSQL.

## Sincronización offline
- Los cambios se escriben primero en IndexedDB.
- Si hay conexión, se envían a la API.
- Si no hay conexión, quedan en la cola local.
- Al volver internet, `sync.js` procesa la cola.
- Para evitar duplicados, cada operación lleva un `clientMutationId` UUID.

## Importante antes de producción
Este es un esqueleto funcional de desarrollo. Antes de exponerlo a Internet:
1. Añadir autenticación (usuarios, roles y sesiones/JWT).
2. Restringir CORS a los dominios reales.
3. Activar HTTPS, copias de seguridad y secretos seguros.
4. Añadir control de concurrencia y auditoría para varias cajas simultáneas.
5. Probar restauración y sincronización con varios dispositivos.

La sección Cloud Shell del prototipo se conserva como consola administrativa simulada; no ejecuta comandos reales del sistema operativo.
