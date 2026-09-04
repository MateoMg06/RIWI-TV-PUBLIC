'use strict';

function normalizeTableName(table) {
  if (typeof table === 'string') return table;
  return table.tableName || table.table_name || String(table);
}

async function tableExists(queryInterface, tableName) {
  const tables = await queryInterface.showAllTables();
  return tables.map(normalizeTableName).includes(tableName);
}

async function createTableIfMissing(queryInterface, tableName, attributes) {
  if (await tableExists(queryInterface, tableName)) return false;
  await queryInterface.createTable(tableName, attributes);
  return true;
}

const timestamps = (Sequelize) => ({
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
});

module.exports = {
  async up(queryInterface, Sequelize) {
    await createTableIfMissing(queryInterface, 'country', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      country: { allowNull: false, type: Sequelize.STRING(100) },
      ...timestamps(Sequelize),
    });

    await createTableIfMissing(queryInterface, 'department', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      department: { allowNull: false, type: Sequelize.STRING(100) },
      country_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'country', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      ...timestamps(Sequelize),
    });

    await createTableIfMissing(queryInterface, 'cities', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      city: { allowNull: false, type: Sequelize.STRING(100) },
      department_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'department', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      ...timestamps(Sequelize),
    });

    await createTableIfMissing(queryInterface, 'cinemas', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      name: { allowNull: false, type: Sequelize.STRING(100) },
      city_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'cities', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      ...timestamps(Sequelize),
    });

    await createTableIfMissing(queryInterface, 'movies', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      name: { allowNull: false, type: Sequelize.STRING(100) },
      synopsis: { allowNull: false, type: Sequelize.STRING(500) },
      classification: { allowNull: false, type: Sequelize.STRING(50) },
      duration: { allowNull: false, type: Sequelize.INTEGER },
      genre: { allowNull: false, type: Sequelize.STRING(100) },
      director: { allowNull: false, type: Sequelize.STRING(100) },
      cast: { allowNull: false, type: Sequelize.STRING(255) },
      poster_url: { allowNull: true, type: Sequelize.STRING(255) },
      banner_url: { allowNull: true, type: Sequelize.STRING(255) },
      trailer_url: { allowNull: true, type: Sequelize.STRING(255) },
      release_date: { allowNull: false, type: Sequelize.DATE },
      status: { allowNull: false, type: Sequelize.BOOLEAN },
      audience_rating: { allowNull: false, type: Sequelize.DECIMAL(10, 2) },
      ...timestamps(Sequelize),
    });

    await createTableIfMissing(queryInterface, 'users', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      name: { allowNull: false, type: Sequelize.STRING(100) },
      email: { allowNull: false, unique: true, type: Sequelize.STRING(100) },
      password: { allowNull: false, type: Sequelize.STRING(255) },
      role: {
        allowNull: false,
        type: Sequelize.ENUM('admin', 'usuario'),
        defaultValue: 'usuario',
      },
      membership: { allowNull: false, type: Sequelize.STRING(50), defaultValue: 'básica' },
      failedLoginAttempts: { allowNull: false, type: Sequelize.INTEGER, defaultValue: 0 },
      lastLoginAttempt: { allowNull: true, type: Sequelize.DATE, defaultValue: null },
      lockedUntil: { allowNull: true, type: Sequelize.DATE, defaultValue: null },
      ...timestamps(Sequelize),
    });

    const showtimeCreated = await createTableIfMissing(queryInterface, 'showtime', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      cinema_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'cinemas', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      movie_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'movies', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      horario: { allowNull: false, type: Sequelize.TIME },
      fecha: { allowNull: false, type: Sequelize.DATEONLY },
      sala: { allowNull: false, type: Sequelize.STRING(50) },
      precio: { allowNull: false, type: Sequelize.DECIMAL(10, 2) },
      ...timestamps(Sequelize),
    });

    if (showtimeCreated) {
      await queryInterface.addIndex('showtime', ['cinema_id', 'movie_id'], {
        name: 'showtime_cinema_movie_unique',
        unique: true,
      });
    }
  },

  async down(queryInterface) {
    for (const tableName of [
      'showtime',
      'users',
      'movies',
      'cinemas',
      'cities',
      'department',
      'country',
    ]) {
      if (await tableExists(queryInterface, tableName)) {
        await queryInterface.dropTable(tableName);
      }
    }

    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_role";');
  },
};
