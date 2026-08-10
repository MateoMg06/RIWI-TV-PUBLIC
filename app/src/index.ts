import 'dotenv/config';
import app from './server';
import sequelize from './config/database';

const PORT = process.env.APP_PORT || 3000;

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la BD establecida...');

    await sequelize.sync({
      alter: true,
    });

    app.listen(PORT, () => {
      console.log(`Servidor escuchando en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al conectar a la BD :', error);
    process.exit(1);
  }
};

start();
