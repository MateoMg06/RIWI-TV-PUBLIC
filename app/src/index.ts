import 'dotenv/config';
import app from './server';
import sequelize from './config/database';
import './models';

import { validateEnvironment } from './config/environment';
import logger from './utils/logger';

const PORT = process.env.APP_PORT || 3000;

const start = async () => {
  try {
    validateEnvironment();
    await sequelize.authenticate();
    logger.info('Conexión a la base de datos establecida');

    app.listen(PORT, () => {
      logger.info('Servidor iniciado', {
        port: Number(PORT),
        environment: process.env.NODE_ENV || 'development',
      });
    });
  } catch (error) {
    logger.error('No fue posible iniciar la aplicación', {
      error: error instanceof Error ? error.message : String(error),
    });
    process.exit(1);
  }
};

start();
