// app/src/server.ts

import cookieParser from 'cookie-parser';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { swaggerSpec } from './docs/swagger';
import movieRoutes from './routes/movie.routes';
import userRoutes from './routes/user.routes';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get('/api/test', (_req, res) => {
  res.status(200).json({ message: 'Servidor funcionando correctamente!' });
});

app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
