// app/src/docs/swagger.ts

/**
 * Swagger Configuration
 * ---------------------
 * Este archivo configura la documentación automática de la API
 * utilizando `swagger-jsdoc` y `swagger-ui-express`.
 *
 * - Genera un esquema OpenAPI (3.0.0).
 * - Extrae la documentación de las anotaciones JSDoc ubicadas en `src/routes/*.ts`.
 *
 * Acceso a la documentación:
 *  - La especificación generada es consumida por `swagger-ui-express`.
 *  - Disponible en `/api/docs` (ver `server.ts`).
 */

import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Example",
      version: "1.0.0",
    },
  },
  apis: ["src/routes/**/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);

console.log(JSON.stringify(swaggerSpec, null, 2));
