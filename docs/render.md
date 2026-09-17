# Despliegue en Render

El archivo `render.yaml` de la raiz crea un Web Service de Node.js y una base
PostgreSQL en Virginia, ambos con plan Free. Render genera los secretos JWT y
conecta las credenciales de PostgreSQL sin guardarlas en Git.

## Crear el despliegue

1. Publica estos archivos en la rama que quieras desplegar.
2. En https://dashboard.render.com/ selecciona **New > Blueprint**.
3. Conecta el repositorio `MateoMg06/RIWI-TV-PUBLIC` y selecciona esa rama.
4. Usa `render.yaml` como Blueprint Path.
5. Introduce `CORS_ORIGIN`: la URL de tu frontend sin barra final. Para desarrollo
   puedes usar `http://localhost:5173`; varios origenes se separan por comas.
6. Revisa que los dos recursos indiquen **Free** y crea el Blueprint.
7. Espera a que el servicio termine de compilar, migrar e iniciar.
8. Abre `/api/v1/health` en el dominio asignado y comprueba `status: ok` y
   `database: up`. Swagger esta en `/api/docs` y la prueba HTTP en `/api/test`.

El comando de inicio toma `APP_URL` del dominio publico de Render cuando no
hay un valor personalizado. `npm start` ejecuta las migraciones pendientes
antes de iniciar la API. Los datos locales no se copian al desplegar.

No configures `DATABASE_URL` ni `POSTGRES_PROD_DB` con otra base: la API usa
`POSTGRES_*` y las migraciones deben apuntar al mismo destino.
La base permite conexiones internas; el acceso publico esta deshabilitado.

## Limites de esta configuracion

- PostgreSQL Free expira a los 30 dias y no ofrece backups.
- El Web Service Free se suspende tras 15 minutos sin trafico.
- Los puertos SMTP 25, 465 y 587 estan bloqueados en Free. El correo actual
  requiere un servicio de pago o adaptar el envio a una API HTTPS. Este
  Blueprint no configura correo; el flujo de activacion por correo queda
  pendiente hasta configurarlo.
- Si ya existe una base Free en el workspace, Render puede impedir crear otra.
- El seeder permanece deshabilitado hasta configurar `SEED_API_KEY`.

Referencias: https://render.com/docs/blueprint-spec y https://render.com/docs/free.
