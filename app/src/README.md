# Código fuente de RIWI Cine API

La documentación completa y actualizada del proyecto se encuentra en el [README principal](../../README.md).

Este directorio contiene el backend organizado por capas:

```text
src/
├── __tests__/       # Pruebas Jest
├── config/          # Base de datos y cookies
├── controllers/     # Manejo de request y response
├── docs/            # Configuración de Swagger
├── dto/             # Contratos TypeScript
├── error/           # Error HTTP personalizado
├── helpers/         # Funciones auxiliares
├── middlewares/     # Autenticación y roles
├── migrations/      # Migraciones Sequelize
├── models/          # Modelos y asociaciones Sequelize
├── repositories/    # Acceso a PostgreSQL
├── routes/          # Endpoints y anotaciones Swagger
├── seeders/         # Datos de prueba
├── services/        # Reglas de negocio
├── types/           # Extensiones de tipos
├── utils/           # JWT y bcrypt
├── index.ts         # Arranque del servidor
└── server.ts        # Configuración de Express
```

Para iniciar el proyecto desde `app/`:

```bash
npm ci
npm run dev
```
