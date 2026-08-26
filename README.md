# RIWI TV API

API REST para administrar usuarios, autenticación, ubicaciones, películas, cines y proyecciones de una plataforma de cine.

![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.2-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-6.37-52B0E7?logo=sequelize&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)

## Contenido

- [Funcionalidades](#funcionalidades)
- [Tecnologías](#tecnologías)
- [Arquitectura](#arquitectura)
- [Modelo de datos](#modelo-de-datos)
- [Endpoints](#endpoints)
- [Autenticación](#autenticación)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Variables de entorno](#variables-de-entorno)
- [Scripts](#scripts)
- [Documentación](#documentación)
- [Estado actual](#estado-actual)

## Funcionalidades

- Registro, consulta y actualización de usuarios.
- Inicio de sesión con access token y refresh token.
- Autenticación mediante cookie HTTP.
- Control de intentos fallidos y bloqueo temporal de cuentas.
- Gestión jerárquica de países, departamentos, ciudades y cines.
- Creación y consulta de películas.
- Asociación de películas con cines mediante proyecciones.
- Consulta de horarios, fechas, salas y precios.
- Documentación Swagger y colección de Postman.
- Datos de prueba mediante un seeder.

## Tecnologías

| Área | Tecnología |
| --- | --- |
| Runtime | Node.js 20 |
| Lenguaje | TypeScript 5.9 |
| Framework HTTP | Express 5.2 |
| Base de datos | PostgreSQL 15 |
| ORM | Sequelize 6.37 |
| Autenticación | JSON Web Tokens, cookies y bcrypt |
| Documentación | Swagger/OpenAPI y Postman |
| Pruebas | Jest y ts-jest |
| Contenedores | Docker y Docker Compose |

## Arquitectura

El backend sigue una arquitectura por capas:

```text
Request HTTP
    │
    ▼
Routes ──► Middlewares
    │
    ▼
Controllers
    │
    ▼
Services
    │
    ▼
Repositories
    │
    ▼
Sequelize ──► PostgreSQL
```

```text
app/src/
├── __tests__/       # Pruebas Jest
├── config/          # Base de datos y cookies
├── controllers/     # Manejo de request y response
├── docs/            # Configuración de Swagger
├── dto/             # Contratos TypeScript de entrada y salida
├── error/           # Error HTTP personalizado
├── helpers/         # Funciones auxiliares reutilizables
├── middlewares/     # Autenticación y roles
├── migrations/      # Versionado del esquema PostgreSQL
├── models/          # Modelos y asociaciones Sequelize
├── repositories/    # Acceso a datos
├── routes/          # Rutas y anotaciones Swagger
├── seeders/         # Datos de prueba
├── services/        # Reglas de negocio
├── types/           # Extensiones de tipos
├── utils/           # JWT y cifrado de contraseñas
├── index.ts         # Arranque de la aplicación
└── server.ts        # Configuración de Express
```

## Modelo de datos

```text
Country 1 ─── N Department 1 ─── N City 1 ─── N Cinema

Cinema 1 ─── N Showtime N ─── 1 Movie

User (entidad independiente)
```

- Un país contiene muchos departamentos.
- Un departamento contiene muchas ciudades.
- Una ciudad contiene muchos cines.
- Cines y películas tienen una relación muchos a muchos mediante `Showtime`.
- Una proyección contiene `horario`, `fecha`, `sala` y `precio`.
- Las asociaciones se centralizan en `app/src/models/index.ts`.

## Endpoints

La URL local predeterminada es `http://localhost:3000`.

### Sistema

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/api/v1/health` | Comprueba la API y la conexión con PostgreSQL |
| `GET` | `/api/test` | Comprueba que Express está respondiendo |
| `GET` | `/api/docs` | Abre Swagger UI |

### Usuarios y autenticación

| Método | Ruta | Descripción | Autenticación |
| --- | --- | --- | --- |
| `POST` | `/api/users` | Crea un usuario | No |
| `GET` | `/api/users` | Lista usuarios | No |
| `POST` | `/api/users/auth` | Valida email y contraseña sin generar JWT | No |
| `POST` | `/api/users/login` | Inicia sesión y genera tokens | No |
| `POST` | `/api/users/refresh` | Genera un access token nuevo | Refresh token |
| `POST` | `/api/users/logout` | Elimina la cookie de sesión | No |
| `PUT` | `/api/users/:id` | Actualiza nombre, email o contraseña | Cookie `accessToken` |

Aliases conservados por compatibilidad:

- `POST /api/users/register`
- `GET /api/users/getUsers`
- `POST /api/users/legacy-login`

### Países, departamentos y ciudades

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/api/countries` | Lista países |
| `POST` | `/api/countries` | Crea un país |
| `GET` | `/api/countries/:id/departments` | Lista departamentos de un país |
| `POST` | `/api/countries/:countryId/departments` | Crea un departamento |
| `GET` | `/api/departments/:id/cities` | Lista ciudades de un departamento |
| `POST` | `/api/departments/:departmentId/cities` | Crea una ciudad |
| `GET` | `/api/cities/:id/cinemas` | Lista cines de una ciudad |

### Películas

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/api/movies` | Obtiene la cartelera |
| `POST` | `/api/movies` | Crea una película |
| `GET` | `/api/movies/:name` | Busca una película por nombre |
| `GET` | `/api/movies/:id/cinemas` | Lista cines que proyectan una película |

Ejemplo de creación:

```json
{
  "name": "Spiderman",
  "clasification": "PG-13",
  "duration": 120,
  "gener": "Acción"
}
```

### Cines y proyecciones

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/api/cinemas` | Crea un cine |
| `GET` | `/api/cinemas/:id/movies` | Lista películas de un cine |
| `POST` | `/api/cinemas/:id/movies/:movieId` | Asigna una película y crea su proyección |
| `DELETE` | `/api/cinemas/:id/movies/:movieId` | Elimina la proyección |
| `GET` | `/api/cinemas/:id/showtimes` | Lista proyecciones del cine |

Ejemplo de creación de una proyección:

```json
{
  "horario": "19:30",
  "fecha": "2026-08-30",
  "sala": "A-5",
  "precio": 15990
}
```

## Autenticación

### Inicio de sesión

```http
POST /api/users/login
Content-Type: application/json
```

```json
{
  "email": "usuario@riwi.tv",
  "password": "123456"
}
```

Una autenticación correcta:

- Devuelve un `accessToken` con duración de 15 minutos.
- Devuelve un `refreshToken` con duración de 7 días.
- Guarda el access token en la cookie HTTP `accessToken`.
- Postman conserva la cookie automáticamente y también guarda los tokens en variables del entorno incluido en el proyecto.

El middleware protegido busca el JWT en:

```http
Cookie: accessToken=<jwt>
```

Después de varios intentos fallidos consecutivos, la cuenta se bloquea durante 15 minutos. La cantidad máxima se controla mediante `MAX_FAILED_ATTEMPTS` y su valor predeterminado es `5`.

## Instalación y ejecución

### Requisitos

- Node.js 20 o superior.
- npm.
- PostgreSQL o Docker con Docker Compose.

### Docker Compose

1. Copiar y completar las variables de entorno:

```bash
cp .env.example .env
```

2. Asegurarse de agregar `POSTGRES_HOST_PORT` al `.env`, ya que Docker Compose utiliza esa variable para publicar PostgreSQL.

3. Construir e iniciar los servicios:

```bash
docker compose up --build
```

4. Ver logs:

```bash
docker compose logs -f
```

5. Detener los contenedores:

```bash
docker compose down
```

Para eliminar también los datos persistidos de PostgreSQL:

```bash
docker compose down -v
```

> Este último comando elimina el volumen de la base de datos.

### Ejecución local

1. Instalar dependencias:

```bash
cd app
npm ci
```

2. Configurar `app/.env`. Si PostgreSQL se ejecuta fuera de Docker, utilizar normalmente:

```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```

3. Iniciar en modo desarrollo:

```bash
npm run dev
```

La aplicación usa `APP_PORT` y, si no está definido, escucha en el puerto `3000`.

Antes de `npm run dev` o `npm start`, el script correspondiente ejecuta automáticamente las migraciones pendientes mediante Sequelize CLI. Docker Compose espera a que PostgreSQL esté saludable antes de iniciar la API.

## Variables de entorno

| Variable | Uso |
| --- | --- |
| `APP_PORT` | Puerto HTTP de Express |
| `APP_CONTAINER_NAME` | Nombre del contenedor de la API |
| `POSTGRES_DB` | Nombre de la base de datos |
| `POSTGRES_USER` | Usuario de PostgreSQL |
| `POSTGRES_PASSWORD` | Contraseña de PostgreSQL |
| `POSTGRES_HOST` | Host de PostgreSQL; en Docker puede omitirse porque usa `db` |
| `POSTGRES_PORT` | Puerto interno de PostgreSQL |
| `POSTGRES_HOST_PORT` | Puerto publicado en la máquina anfitriona |
| `DB_CONTAINER_NAME` | Nombre del contenedor de PostgreSQL |
| `JWT_SECRET` | Firma del access token |
| `JWT_REFRESH_SECRET` | Firma del refresh token |
| `SALT_ROUNDS` | Rondas utilizadas por bcrypt |
| `MAX_FAILED_ATTEMPTS` | Intentos permitidos antes del bloqueo |
| `NODE_ENV` | Entorno de ejecución y seguridad de cookies |
| `APP_CPU_LIMIT`, `APP_MEM_LIMIT` | Límites del contenedor de la API |
| `DB_CPU_LIMIT`, `DB_MEM_LIMIT` | Límites del contenedor de PostgreSQL |

No se deben versionar valores reales de contraseñas ni secretos JWT.

## Scripts

Ejecutar dentro de `app/`:

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia con recarga automática y transpile-only |
| `npm run build` | Compila TypeScript en `app/dist` |
| `npm start` | Ejecuta la versión compilada |
| `npm test` | Ejecuta Jest |
| `npm run test:coverage` | Ejecuta Jest y genera cobertura |
| `npm run lint` | Valida TypeScript con ESLint |
| `npm run format` | Aplica Prettier |
| `npm run format:check` | Comprueba el formato de la infraestructura HU-001 sin reformatear módulos heredados |
| `npm run migrate` | Ejecuta migraciones pendientes |
| `npm run migrate:status` | Muestra el estado de las migraciones |
| `npm run migrate:undo` | Revierte la última migración |
| `npm run seed` | Inserta datos de prueba |

El seeder crea:

- 3 países.
- 4 departamentos.
- 4 ciudades.
- 4 cines.
- 3 películas.
- 6 proyecciones.

El seeder no crea usuarios. Para probar el login se debe registrar uno primero.

## Documentación

### Swagger

Con la API ejecutándose:

```text
http://localhost:3000/api/docs
```

### Postman

Importar estos dos archivos:

- [`docs/postman/RIWI-TV.postman_collection.json`](docs/postman/RIWI-TV.postman_collection.json)
- [`docs/postman/RIWI-TV.postman_environment.example.json`](docs/postman/RIWI-TV.postman_environment.example.json)

Seleccionar el entorno `RIWI-TV - Local (Example)` antes de ejecutar la colección. La colección contiene las 29 rutas actuales y guarda automáticamente IDs y tokens obtenidos durante el flujo.

## Estado actual

- La compilación TypeScript termina correctamente.
- Jest contiene pruebas unitarias y de integración para el health check.
- ESLint y Prettier están configurados.
- Helmet, CORS y logging HTTP están activos.
- `GET /api/v1/health` informa disponibilidad de la API y PostgreSQL.
- Docker Compose ejecuta migraciones automáticamente antes de levantar la API.
- Las validaciones se realizan manualmente en los controladores; los DTO son interfaces TypeScript y no validan datos en tiempo de ejecución.
- El middleware de roles existe, pero actualmente no está conectado a ninguna ruta.
- Solo la actualización de usuario exige autenticación.
- Los endpoints de usuarios deben revisarse antes de producción para evitar exponer campos sensibles como hashes de contraseñas.
- El servicio limita a una sola proyección por combinación de cine y película.

## Equipo

Proyecto desarrollado por RIWI Coders.
