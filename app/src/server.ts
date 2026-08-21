// app/src/server.ts

import cookieParser from 'cookie-parser';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { swaggerSpec } from './docs/swagger';
import movieRoutes from './routes/movie.routes';
import userRoutes from './routes/user.routes';
import countryRoutes from './routes/country.routes';
import departmentRoutes from './routes/department.routes';
import cityRoutes from './routes/city.routes';
import cinemaRoutes from './routes/cinema.routes';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get('/api/test', (_req, res) => {
  res.status(200).json({ message: 'Servidor funcionando correctamente!' });
});

app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/countries/:countryId/departments', departmentRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/departments/:departmentId/cities', cityRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/cinemas', cinemaRoutes);
app.use('/api/movies', movieRoutes);

// Swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
