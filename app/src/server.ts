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
import authRoutes from './routes/auth.routes';
import membershipRoutes from './routes/membership.routes';
import v1Routes from './routes/v1.routes';
import locationRoutes from './routes/location.routes';
import notificationRoutes from './routes/notification.routes';
import profileRoutes from './routes/profile.routes';
import reservationRoutes from './routes/reservation.routes';
import seedRoutes from './routes/seed.routes';
import showtimeRoutes from './routes/showtime.routes';
import { startSeatLockCleanup } from './services/reservation.service';

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
app.use('/api/countries', countryRoutes);
app.use('/api/countries/:countryId/departments', departmentRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/departments/:departmentId/cities', cityRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/cinemas', cinemaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/membership', membershipRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/functions', showtimeRoutes);
app.use('/api/reservations', reservationRoutes);

app.use('/api/v1', locationRoutes);
app.use('/api/v1/movies', movieRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/membership', membershipRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/functions', showtimeRoutes);
app.use('/api/v1/reservations', reservationRoutes);
app.use('/api/v1/seed', seedRoutes);

// Aliases literales descritos por las historias de usuario.
app.use(locationRoutes);
app.use('/movies', movieRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/membership', membershipRoutes);
app.use('/notifications', notificationRoutes);
app.use('/functions', showtimeRoutes);
app.use('/reservations', reservationRoutes);

// Swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

startSeatLockCleanup();

export default app;
