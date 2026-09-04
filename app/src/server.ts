// app/src/server.ts

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import { corsOptions } from './config/cors';
import { swaggerSpec } from './docs/swagger';
import { requestLogger } from './middlewares/requestLogger';
import './models';
import movieRoutes from './routes/movie.routes';
import userRoutes from './routes/user.routes';
import countryRoutes from './routes/country.routes';
import departmentRoutes from './routes/department.routes';
import cityRoutes from './routes/city.routes';
import cinemaRoutes from './routes/cinema.routes';
import v1Routes from './routes/v1.routes';
import releaseNotificationRoutes from './routes/release-notification.routes';

const app = express();

app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

app.get('/api/test', (_req, res) => {
  res.status(200).json({ message: 'Servidor funcionando correctamente!' });
});

app.use('/api/v1', v1Routes);
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/notifications', releaseNotificationRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/countries/:countryId/departments', departmentRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/departments/:departmentId/cities', cityRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/cinemas', cinemaRoutes);

// Swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
