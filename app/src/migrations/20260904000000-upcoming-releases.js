'use strict';

function normalizeTableName(table) {
  if (typeof table === 'string') return table;
  return table.tableName || table.table_name || String(table);
}

async function tableExists(queryInterface, tableName) {
  const tables = await queryInterface.showAllTables();
  return tables.map(normalizeTableName).includes(tableName);
}

async function columnExists(queryInterface, tableName, columnName) {
  if (!(await tableExists(queryInterface, tableName))) return false;
  const columns = await queryInterface.describeTable(tableName);
  return Boolean(columns[columnName]);
}

async function addColumnIfMissing(queryInterface, tableName, columnName, definition) {
  if (!(await columnExists(queryInterface, tableName, columnName))) {
    await queryInterface.addColumn(tableName, columnName, definition);
  }
}

async function createTableIfMissing(queryInterface, tableName, attributes) {
  if (!(await tableExists(queryInterface, tableName))) {
    await queryInterface.createTable(tableName, attributes);
  }
}

async function addUniqueIndexIfMissing(queryInterface, tableName, fields, name) {
  const indexes = await queryInterface.showIndex(tableName);
  if (!indexes.some((index) => index.name === name)) {
    await queryInterface.addIndex(tableName, fields, { name, unique: true });
  }
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
    await createTableIfMissing(queryInterface, 'genres', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      name: { allowNull: false, unique: true, type: Sequelize.STRING(80) },
      active: { allowNull: false, defaultValue: true, type: Sequelize.BOOLEAN },
      ...timestamps(Sequelize),
    });

    await createTableIfMissing(queryInterface, 'classifications', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      name: { allowNull: false, unique: true, type: Sequelize.STRING(50) },
      active: { allowNull: false, defaultValue: true, type: Sequelize.BOOLEAN },
      ...timestamps(Sequelize),
    });

    await createTableIfMissing(queryInterface, 'languages', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      name: { allowNull: false, unique: true, type: Sequelize.STRING(80) },
      active: { allowNull: false, defaultValue: true, type: Sequelize.BOOLEAN },
      ...timestamps(Sequelize),
    });

    await addColumnIfMissing(queryInterface, 'movies', 'synopsis', {
      allowNull: true,
      type: Sequelize.TEXT,
    });
    await addColumnIfMissing(queryInterface, 'movies', 'poster_url', {
      allowNull: true,
      type: Sequelize.STRING(500),
    });
    await addColumnIfMissing(queryInterface, 'movies', 'trailer_url', {
      allowNull: true,
      type: Sequelize.STRING(500),
    });
    await addColumnIfMissing(queryInterface, 'movies', 'status', {
      allowNull: false,
      defaultValue: 'en_cartelera',
      type: Sequelize.ENUM('proximo_estreno', 'en_cartelera', 'fuera_cartelera'),
    });
    await addColumnIfMissing(queryInterface, 'movies', 'classification_id', {
      allowNull: true,
      type: Sequelize.INTEGER,
      references: { model: 'classifications', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
    await addColumnIfMissing(queryInterface, 'movies', 'language_id', {
      allowNull: true,
      type: Sequelize.INTEGER,
      references: { model: 'languages', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await createTableIfMissing(queryInterface, 'movie_genres', {
      movie_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: { model: 'movies', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      genre_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: { model: 'genres', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });

    await createTableIfMissing(queryInterface, 'release_notifications', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
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
      status: {
        allowNull: false,
        defaultValue: 'pendiente',
        type: Sequelize.ENUM('pendiente', 'enviada'),
      },
      ...timestamps(Sequelize),
    });

    if (await tableExists(queryInterface, 'movie_genres')) {
      await addUniqueIndexIfMissing(queryInterface, 'movie_genres', ['movie_id', 'genre_id'], 'movie_genres_movie_genre_unique');
    }
    if (await tableExists(queryInterface, 'release_notifications')) {
      await addUniqueIndexIfMissing(queryInterface, 'release_notifications', ['user_id', 'movie_id'], 'release_notifications_user_movie_unique');
    }
  },

  async down(queryInterface) {
    for (const tableName of ['release_notifications', 'movie_genres', 'languages', 'classifications', 'genres']) {
      if (await tableExists(queryInterface, tableName)) {
        await queryInterface.dropTable(tableName);
      }
    }

    for (const columnName of ['language_id', 'classification_id', 'status', 'trailer_url', 'poster_url', 'synopsis']) {
      if (await columnExists(queryInterface, 'movies', columnName)) {
        await queryInterface.removeColumn('movies', columnName);
      }
    }

    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_release_notifications_status";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_movies_status";');
  },
};