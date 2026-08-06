// app/src/server.ts

/**
 * Se encarga únicamente de configurar la aplicación Express: middlewares, rutas, swagger, etc.
 * No arranca el servidor ni toca la base de datos.
 * Esto hace que la aplicación sea testeable fácilmente, porque podemos importar app en nuestros tests sin necesidad de levantar el servidor real ni conectarse a la BD.
 */

//Importación de dependencias
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger';

//Importación de rutas y controladores
import userRoutes from './routes/user.routes';

const app = express();

app.use(express.json());

//Prueba para verificar el funcionamiento del server
app.get('/api/test', (req, res) => {
    res.status(200).json({ message: 'Servidor funcionando correctamente!' });
});

// Rutas
app.use('/api/users', userRoutes);

// Swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
