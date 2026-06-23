# 🐾 PetRadar API

API REST desarrollada con **NestJS + TypeORM + PostgreSQL/PostGIS** para reportar y encontrar mascotas perdidas.

---

## Endpoints disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/lost-pets` | Listar todas las mascotas perdidas |
| `GET` | `/lost-pets/:id` | Detalle de una mascota perdida |
| `GET` | `/lost-pets/nearby?lat=XX&lng=YY&radius=500` | Mascotas perdidas cercanas (metros) |
| `POST` | `/lost-pets` | Registrar mascota perdida |
| `GET` | `/found-pets` | Listar todas las mascotas encontradas |
| `GET` | `/found-pets/:id` | Detalle de una mascota encontrada |
| `POST` | `/found-pets` | Registrar mascota encontrada (envía email a dueños cercanos) |

---

## Despliegue en Railway (recomendado — gratis)

### 1. Base de datos PostgreSQL en Railway

1. Entra a [railway.app](https://railway.app) y crea un nuevo proyecto.
2. Haz clic en **"Add a Service" → "Database" → "PostgreSQL"**.
3. Una vez creada, Railway genera automáticamente `DATABASE_URL`. La necesitarás en el paso 3.
4. En la pestaña **"Data"** de la base de datos, conéctate y ejecuta la extensión PostGIS:
   ```sql
   CREATE EXTENSION IF NOT EXISTS postgis;
   ```

### 2. Sube el código a GitHub

```bash
git init
git add .
git commit -m "feat: deploy PetRadar API"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/pet-radar.git
git push -u origin main
```

### 3. Despliega la API en Railway

1. En tu proyecto de Railway, haz clic en **"Add a Service" → "GitHub Repo"**.
2. Selecciona tu repositorio `pet-radar`.
3. Railway detectará el `Dockerfile` automáticamente.
4. Ve a la pestaña **"Variables"** del servicio API y agrega:

| Variable | Valor |
|----------|-------|
| `DATABASE_URL` | (copia el valor de tu servicio PostgreSQL en Railway) |
| `MAILER_SERVICE` | `gmail` |
| `MAILER_EMAIL` | tu correo Gmail |
| `MAILER_PASSWORD` | tu App Password de Gmail |
| `MAPBOX_TOKEN` | tu token de Mapbox |

5. Railway hará el build y desplegará automáticamente.
6. En la pestaña **"Settings"** del servicio, genera un dominio público con **"Generate Domain"**.

### 4. Verificar que funciona

Abre en el navegador (sustituye con tu URL de Railway):

```
https://tu-app.up.railway.app/lost-pets
```

Debe devolver un arreglo JSON (vacío `[]` si no hay datos aún).

---

## Desarrollo local

### Prerequisitos
- Docker y Docker Compose instalados
- Node.js 20+

### Pasos

```bash
# 1. Clonar el repo
git clone https://github.com/TU_USUARIO/pet-radar.git
cd pet-radar

# 2. Copiar variables de entorno
cp .env.example .env
# Edita .env con tus valores reales

# 3. Levantar la base de datos PostGIS local
docker-compose up db -d

# 4. Instalar dependencias y correr en modo dev
npm install
npm run start:dev
```

La API queda disponible en `http://localhost:3000`.

---

## Ejemplo de petición POST

```bash
# Registrar mascota perdida
curl -X POST https://tu-app.up.railway.app/lost-pets \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Firulais",
    "species": "Perro",
    "breed": "Labrador",
    "color": "Amarillo",
    "size": "Grande",
    "description": "Collar rojo, muy amigable",
    "owner_name": "Camila",
    "owner_email": "camila@ejemplo.com",
    "owner_phone": "4771234567",
    "lat": 21.1236,
    "lng": -101.6829,
    "address": "Col. Centro, León, Gto.",
    "lost_date": "2025-06-20T10:00:00.000Z"
  }'
```
