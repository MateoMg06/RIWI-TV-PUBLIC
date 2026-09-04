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
- Sistema de membresías con roles de usuario.
- Recuperación de contraseña por correo electrónico.
- CAPTCHA para registro de usuarios.

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

La URL local predeterminada es `http://localhost:5001`.

### Sistema

| Método | Ruta | Descripción | Autenticación |
| --- | --- | --- | --- |
| `GET` | `/api/v1/health` | Comprueba la API y la conexión con PostgreSQL | No |
| `GET` | `/api/test` | Comprueba que Express está respondiendo | No |
| `GET` | `/api/docs` | Abre Swagger UI | No |

### Autenticación y registro

| Método | Ruta | Descripción | Autenticación |
| --- | --- | --- | --- |
| `GET` | `/api/auth/captcha` | Obtiene un CAPTCHA para el registro | No |
| `POST` | `/api/auth/register` | Registra un nuevo usuario con perfil y membresía inicial | No |
| `POST` | `/api/auth/activate` | Activa la cuenta del usuario mediante token de correo | No |
| `POST` | `/api/auth/forgot-password` | Solicita recuperación de contraseña | No |
| `POST` | `/api/auth/reset-password` | Restablece la contraseña con un token de recuperación | No |

### Usuarios

| Método | Ruta | Descripción | Autenticación |
| --- | --- | --- | --- |
| `POST` | `/api/users` | Crea un usuario | No |
| `POST` | `/api/users/register` | Alias de `/api/users` | No |
| `GET` | `/api/users` | Lista usuarios | Cookie `accessToken` + rol `admin` |
| `GET` | `/api/users/getUsers` | Alias de `/api/users` | Cookie `accessToken` + rol `admin` |
| `POST` | `/api/users/auth` | Valida email y contraseña sin generar JWT | No |
| `POST` | `/api/users/login` | Inicia sesión y genera tokens | No |
| `POST` | `/api/users/legacy-login` | Alias de `/api/users/auth` | No |
| `POST` | `/api/users/refresh` | Genera un access token nuevo | Cookie `accessToken` |
| `POST` | `/api/users/logout` | Elimina la cookie de sesión | No |
| `PUT` | `/api/users/:id` | Actualiza nombre, email o contraseña | Cookie `accessToken` + rol `admin` o `usuario` |

### Membresías

| Método | Ruta | Descripción | Autenticación |
| --- | --- | --- | --- |
| `POST` | `/api/membership/create` | Crea una membresía para el usuario autenticado | Cookie `accessToken` + rol `admin` o `usuario` |
| `GET` | `/api/membership/me` | Obtiene la membresía del usuario autenticado | Cookie `accessToken` + rol `admin` o `usuario` |
| `GET` | `/api/membership/purchase-history` | Obtiene el historial de compras del usuario autenticado | Cookie `accessToken` + rol `admin` o `usuario` |

### Países, departamentos y ciudades

| Método | Ruta | Descripción | Autenticación |
| --- | --- | --- | --- |
| `GET` | `/api/countries` | Lista países | No |
| `POST` | `/api/countries` | Crea un país | Cookie `accessToken` + rol `admin` |
| `GET` | `/api/countries/:id/departments` | Lista departamentos de un país | No |
| `POST` | `/api/countries/:countryId/departments` | Crea un departamento | Cookie `accessToken` + rol `admin` |
| `GET` | `/api/departments/:id/cities` | Lista ciudades de un departamento | No |
| `POST` | `/api/departments/:departmentId/cities` | Crea una ciudad | Cookie `accessToken` + rol `admin` |
| `GET` | `/api/cities/:id/cinemas` | Lista cines de una ciudad | No |

### Películas

| Método | Ruta | Descripción | Autenticación |
| --- | --- | --- | --- |
| `GET` | `/api/movies` | Obtiene la cartelera | No |
| `POST` | `/api/movies` | Crea una película | Cookie `accessToken` + rol `admin` |
| `GET` | `/api/movies/:name` | Busca una película por nombre | No |
| `GET` | `/api/movies/:id/cinemas` | Lista cines que proyectan una película | No |

### Cines y proyecciones

| Método | Ruta | Descripción | Autenticación |
| --- | --- | --- | --- |
| `POST` | `/api/cinemas` | Crea un cine | Cookie `accessToken` + rol `admin` |
| `GET` | `/api/cinemas/:id/movies` | Lista películas de un cine | Cookie `accessToken` + rol `admin` |
| `POST` | `/api/cinemas/:id/movies/:movieId` | Asigna una película y crea su proyección | Cookie `accessToken` + rol `admin` |
| `DELETE` | `/api/cinemas/:id/movies/:movieId` | Elimina la proyección | Cookie `accessToken` + rol `admin` |
| `GET` | `/api/cinemas/:id/showtimes` | Lista proyecciones del cine | Cookie `accessToken` + rol `admin` |

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

2. Construir e iniciar los servicios:

```bash
docker compose up --build
```

3. Ver logs:

```bash
docker compose logs -f
```

4. Detener los contenedores:

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
| `APP_URL` | URL base de la aplicación |
| `POSTGRES_DB` | Nombre de la base de datos |
| `POSTGRES_USER` | Usuario de PostgreSQL |
| `POSTGRES_PASSWORD` | Contraseña de PostgreSQL |
| `POSTGRES_HOST` | Host de PostgreSQL; en Docker puede omitirse porque usa `db` |
| `POSTGRES_PORT` | Puerto interno de PostgreSQL |
| `POSTGRES_HOST_PORT` | Puerto publicado en la máquina anfitriona |
| `DB_CONTAINER_NAME` | Nombre del contenedor de PostgreSQL |
| `JWT_SECRET` | Firma del access token |
| `JWT_REFRESH_SECRET` | Firma del refresh token |
| `JWT_ACCESS_EXPIRES_IN` | Duración del access token |
| `JWT_REFRESH_EXPIRES_IN` | Duración del refresh token |
| `RESET_TOKEN_EXPIRES_IN` | Duración del token de recuperación de contraseña |
| `SALT_ROUNDS` | Rondas utilizadas por bcrypt |
| `MAX_FAILED_ATTEMPTS` | Intentos permitidos antes del bloqueo |
| `NODE_ENV` | Entorno de ejecución y seguridad de cookies |
| `APP_CPU_LIMIT`, `APP_MEM_LIMIT` | Límites del contenedor de la API |
| `DB_CPU_LIMIT`, `DB_MEM_LIMIT` | Límites del contenedor de PostgreSQL |
| `SMTP_HOST` | Servidor SMTP para envío de correos |
| `SMTP_PORT` | Puerto del servidor SMTP |
| `SMTP_USER` | Usuario del servidor SMTP |
| `SMTP_PASS` | Contraseña del servidor SMTP |

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
http://localhost:5001/api/docs
```

### Postman

Importar estos dos archivos:

- [`docs/postman/RIWI-TV.postman_collection.json`](docs/postman/RIWI-TV.postman_collection.json)
- [`docs/postman/RIWI-TV.postman_environment.example.json`](docs/postman/RIWI-TV.postman_environment.example.json)

Seleccionar el entorno `RIWI-TV - Local (Example)` antes de ejecutar la colección. La colección contiene las rutas actuales y guarda automáticamente IDs y tokens obtenidos durante el flujo.

## Estado actual

- La compilación TypeScript termina correctamente.
- Jest contiene pruebas unitarias y de integración para el health check.
- ESLint y Prettier están configurados.
- Helmet, CORS y logging HTTP están activos.
- `GET /api/v1/health` informa disponibilidad de la API y PostgreSQL.
- Docker Compose ejecuta migraciones automáticamente antes de levantar la API.
- Las validaciones se realizan manualmente en los controladores; los DTO son interfaces TypeScript y no validan datos en tiempo de ejecución.
- El middleware de roles está conectado a múltiples rutas que requieren nivel de acceso.
- Varios endpoints de consulta pública (países, departamentos, ciudades, cartelera) no requieren autenticación.
- Los endpoints de creación y modificación (películas, cines, proyecciones, ubicaciones) requieren rol `admin`.
- Los endpoints de usuarios deben revisarse antes de producción para evitar exponer campos sensibles como hashes de contraseñas, tokens de activación y tokens de sesión.
- El servicio limita a una sola proyección por combinación de cine y película.

## Equipo

Proyecto desarrollado por RIWI Coders.
