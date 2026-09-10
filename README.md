# Multicine Riwi API

Backend de la plataforma Multicine implementado con Node.js 20, Express 5, TypeScript, PostgreSQL, Sequelize, Docker, Swagger y Jest. Esta versión cubre las historias de usuario HU-001 a HU-010.

## Funcionalidades terminadas

- HU-001: arquitectura por capas, variables de entorno, migraciones, Docker Compose, health check, Swagger, logger, Jest, ESLint, Prettier, Helmet y CORS.
- HU-002: países, departamentos y ciudades activas; cines activos; ubicación persistida para usuarios autenticados.
- HU-003: cartelera de siete días y de hoy, con filtros por fecha, género, clasificación, idioma, sala, formato, cine, ciudad y disponibilidad.
- HU-004: detalle completo, funciones futuras por ciudad y recomendaciones por género.
- HU-005: próximos estrenos ordenados, detalle, contador regresivo y solicitudes de notificación sin duplicados.
- HU-006: registro con CAPTCHA, política fuerte de contraseña, BCrypt, perfil y membresía digital automáticos, activación por correo y billetera inicial.
- HU-007: JWT de 15 minutos, refresh token de siete días con rotación, cierre de sesión, bloqueo tras cinco intentos, recuperación de contraseña y auditoría de IP/dispositivo.
- HU-008: consulta y actualización del perfil, QR, nivel, descuentos, bonos e historial de compras.
- HU-009: consulta de función futura y activa, formato, idioma, sala, audio, disponibilidad y precios.
- HU-010: mapa de sillas, tipos y estados, bloqueo transaccional por diez minutos, liberación manual/automática, límite configurable y resumen con total.

## Inicio rápido con Docker

1. Copia `.env.example` como `.env` y completa las variables.
2. Ejecuta `docker compose up --build`.
3. La API queda disponible en `http://localhost:5001` y Swagger en `http://localhost:5001/api/docs`.

El contenedor ejecuta las migraciones antes de iniciar la API. Para cargar datos demostrativos:

```bash
docker compose exec app npm run seed
```

## Desarrollo local

```bash
cd app
npm ci
npm run migrate
npm run dev
```

Comandos de verificación:

```bash
npm run build
npm test -- --runInBand
npm run lint
npm run format:check
```

## Endpoints HU-001 a HU-010

Todos los endpoints funcionales también están disponibles bajo `/api/v1`. Los aliases sin `/api` se mantienen para coincidir literalmente con el backlog.

| Historia | Método y ruta principal                                                              | Autenticación   |
| -------- | ------------------------------------------------------------------------------------ | --------------- |
| HU-001   | `GET /api/v1/health`, `GET /api/docs`                                                | No              |
| HU-002   | `GET /countries`, `GET /departments/:countryId`, `GET /cities/:departmentId`         | No              |
| HU-002   | `POST /users/location`                                                               | JWT             |
| HU-003   | `GET /api/movies`, `/weekly`, `/today`, `/filter`                                    | No              |
| HU-004   | `GET /api/movies/:id`, `/:id/functions`, `/:id/recommendations`                      | No              |
| HU-005   | `GET /api/movies/upcoming`, `/upcoming/:id`                                          | No              |
| HU-005   | `POST /api/notifications/upcoming`                                                   | JWT             |
| HU-006   | `GET /api/auth/captcha`, `POST /api/auth/register`, `/verify-email`                  | No              |
| HU-007   | `POST /api/auth/login`, `/refresh`, `/logout`, `/forgot-password`, `/reset-password` | Según operación |
| HU-008   | `GET /api/profile`, `PUT /api/profile`, `GET /api/membership`, `/benefits`           | JWT             |
| HU-009   | `GET /api/functions/:id`, `/prices`                                                  | No              |
| HU-010   | `GET /api/functions/:id/seats`                                                       | No              |
| HU-010   | `POST /api/reservations/lock-seats`, `DELETE /release-seats`, `GET /summary`         | JWT             |

El JWT puede enviarse como cookie `accessToken` o como `Authorization: Bearer <token>`.

## Variables principales

| Variable                    | Uso                                             |
| --------------------------- | ----------------------------------------------- |
| `POSTGRES_*`                | Conexión a PostgreSQL                           |
| `APP_PORT`                  | Puerto HTTP; recomendado `5001`                 |
| `JWT_SECRET`                | Firma del access token                          |
| `JWT_REFRESH_SECRET`        | Firma del refresh token                         |
| `JWT_ACCESS_EXPIRES_IN`     | Vigencia del access token; recomendado `15m`    |
| `JWT_REFRESH_EXPIRES_IN`    | Vigencia del refresh token; recomendado `7d`    |
| `MAX_FAILED_ATTEMPTS`       | Intentos antes del bloqueo; recomendado `5`     |
| `SEAT_LOCK_MINUTES`         | Duración del bloqueo; predeterminado `10`       |
| `MAX_SEATS_PER_RESERVATION` | Máximo de sillas; predeterminado `10`           |
| `SMTP_*`                    | Entrega de correos de activación y recuperación |

## Modelo principal

```text
Country -> Department -> City -> Cinema -> Showtime -> Seat
                              Movie -> Showtime
User -> Profile
User -> Membership -> PurchaseHistory
User -> RefreshToken / AccessAudit / ReleaseNotification / SeatLock
SeatLock -> Showtime + Seat
```

La concurrencia de HU-010 se controla con transacciones serializables, bloqueo de filas y una actualización condicional `AVAILABLE -> HELD`. Un proceso periódico y las consultas de disponibilidad liberan automáticamente los bloqueos vencidos.
