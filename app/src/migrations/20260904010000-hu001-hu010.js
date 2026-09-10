'use strict';

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

const normalize = (table) =>
  typeof table === 'string' ? table : table.tableName || table.table_name || String(table);
async function tableExists(queryInterface, tableName) {
  return (await queryInterface.showAllTables()).map(normalize).includes(tableName);
}
async function columnExists(queryInterface, tableName, columnName) {
  if (!(await tableExists(queryInterface, tableName))) return false;
  return Object.prototype.hasOwnProperty.call(
    await queryInterface.describeTable(tableName),
    columnName,
  );
}
async function addColumn(queryInterface, tableName, columnName, definition) {
  if (!(await columnExists(queryInterface, tableName, columnName))) {
    await queryInterface.addColumn(tableName, columnName, definition);
  }
}
async function createTable(queryInterface, tableName, definition) {
  if (!(await tableExists(queryInterface, tableName)))
    await queryInterface.createTable(tableName, definition);
}
async function addIndex(queryInterface, tableName, fields, options = {}) {
  const indexes = await queryInterface.showIndex(tableName);
  if (!indexes.some((index) => index.name === options.name)) {
    await queryInterface.addIndex(tableName, fields, options);
  }
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await addColumn(queryInterface, 'cities', 'active', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    await addColumn(queryInterface, 'cinemas', 'active', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });

    const userColumns = {
      lastName: { type: Sequelize.STRING(100), allowNull: false, defaultValue: '' },
      phone: { type: Sequelize.STRING(20), allowNull: false, defaultValue: '' },
      documentType: { type: Sequelize.STRING(50), allowNull: false, defaultValue: '' },
      documentNumber: { type: Sequelize.STRING(50), allowNull: false, defaultValue: '' },
      birthDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      city: { type: Sequelize.STRING(100), allowNull: false, defaultValue: '' },
      city_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'cities', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      acceptsDataProcessing: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      acceptsTerms: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      acceptsNotifications: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      accountStatus: {
        type: Sequelize.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'inactive',
      },
      activationToken: { type: Sequelize.STRING(255), allowNull: true },
      activationTokenExpires: { type: Sequelize.DATE, allowNull: true },
    };
    for (const [name, definition] of Object.entries(userColumns)) {
      await addColumn(queryInterface, 'users', name, definition);
    }
    await queryInterface.changeColumn('users', 'accessToken', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn('users', 'refreshToken', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    if (await tableExists(queryInterface, 'refresh_tokens')) {
      await queryInterface.changeColumn('refresh_tokens', 'token', {
        type: Sequelize.TEXT,
        allowNull: false,
      });
    }

    await createTable(queryInterface, 'profiles', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      lastName: { type: Sequelize.STRING(100), allowNull: false },
      phone: { type: Sequelize.STRING(20), allowNull: false },
      documentType: { type: Sequelize.STRING(50), allowNull: false },
      documentNumber: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      birthDate: { type: Sequelize.DATE, allowNull: false },
      city: { type: Sequelize.STRING(100), allowNull: false },
      address: { type: Sequelize.STRING(255), allowNull: true },
      avatar: { type: Sequelize.STRING(500), allowNull: true },
      ...timestamps(Sequelize),
    });

    await createTable(queryInterface, 'memberships', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      code: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'expired', 'pending'),
        allowNull: false,
        defaultValue: 'pending',
      },
      startDate: { type: Sequelize.DATE, allowNull: false },
      endDate: { type: Sequelize.DATE, allowNull: false },
      bonusWallet: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      level: {
        type: Sequelize.ENUM('BRONZE', 'SILVER', 'GOLD', 'PLATINUM'),
        allowNull: false,
        defaultValue: 'BRONZE',
      },
      qr_code: { type: Sequelize.STRING(255), allowNull: false, unique: true },
      ...timestamps(Sequelize),
    });

    await createTable(queryInterface, 'purchase_histories', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      membershipId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'memberships', key: 'id' },
        onDelete: 'CASCADE',
      },
      amount: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      description: { type: Sequelize.STRING(255), allowNull: false },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      ...timestamps(Sequelize),
    });

    if (await columnExists(queryInterface, 'movies', 'clasification')) {
      await queryInterface.renameColumn('movies', 'clasification', 'classification');
    }
    if (await columnExists(queryInterface, 'movies', 'gener')) {
      await queryInterface.renameColumn('movies', 'gener', 'genre');
    }
    const movieColumns = {
      synopsis: { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
      director: { type: Sequelize.STRING(150), allowNull: false, defaultValue: '' },
      cast: { type: Sequelize.JSONB, allowNull: false, defaultValue: [] },
      poster_url: { type: Sequelize.STRING(500), allowNull: true },
      banner_url: { type: Sequelize.STRING(500), allowNull: true },
      trailer_url: { type: Sequelize.STRING(500), allowNull: true },
      release_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      status: {
        type: Sequelize.ENUM('UPCOMING', 'ACTIVE', 'INACTIVE'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      audience_rating: { type: Sequelize.DECIMAL(3, 1), allowNull: false, defaultValue: 0 },
    };
    for (const [name, definition] of Object.entries(movieColumns)) {
      await addColumn(queryInterface, 'movies', name, definition);
    }

    if (
      (await tableExists(queryInterface, 'showtime')) &&
      !(await tableExists(queryInterface, 'showtimes'))
    ) {
      await queryInterface.renameTable('showtime', 'showtimes');
    }
    if (await columnExists(queryInterface, 'showtimes', 'sala'))
      await queryInterface.renameColumn('showtimes', 'sala', 'room');
    if (await columnExists(queryInterface, 'showtimes', 'precio'))
      await queryInterface.renameColumn('showtimes', 'precio', 'price');
    await addColumn(queryInterface, 'showtimes', 'starts_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    if (await columnExists(queryInterface, 'showtimes', 'fecha')) {
      await queryInterface.sequelize.query(
        `UPDATE "showtimes" SET "starts_at" = ("fecha"::date + COALESCE("horario", '00:00:00')::time) WHERE "starts_at" IS NULL`,
      );
    }
    await queryInterface.changeColumn('showtimes', 'starts_at', {
      type: Sequelize.DATE,
      allowNull: false,
    });
    for (const [name, definition] of Object.entries({
      room_type: { type: Sequelize.STRING(30), allowNull: false, defaultValue: 'STANDARD' },
      format: { type: Sequelize.STRING(20), allowNull: false, defaultValue: '2D' },
      language: { type: Sequelize.STRING(50), allowNull: false, defaultValue: 'Español' },
      audio_type: {
        type: Sequelize.ENUM('DUBBED', 'SUBTITLED', 'ORIGINAL'),
        allowNull: false,
        defaultValue: 'DUBBED',
      },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'SOLD_OUT', 'CANCELLED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      available_seats: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    }))
      await addColumn(queryInterface, 'showtimes', name, definition);
    if (await columnExists(queryInterface, 'showtimes', 'fecha'))
      await queryInterface.removeColumn('showtimes', 'fecha');
    if (await columnExists(queryInterface, 'showtimes', 'horario'))
      await queryInterface.removeColumn('showtimes', 'horario');
    const indexes = await queryInterface.showIndex('showtimes');
    for (const index of indexes.filter(
      (item) =>
        item.unique &&
        item.fields.map((field) => field.attribute).join(',') === 'cinema_id,movie_id',
    )) {
      await queryInterface.removeIndex('showtimes', index.name);
    }
    await addIndex(queryInterface, 'showtimes', ['movie_id', 'starts_at'], {
      name: 'showtimes_movie_starts_at',
    });
    await addIndex(queryInterface, 'showtimes', ['cinema_id', 'starts_at'], {
      name: 'showtimes_cinema_starts_at',
    });

    await createTable(queryInterface, 'release_notifications', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      movie_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'movies', key: 'id' },
        onDelete: 'CASCADE',
      },
      city_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'cities', key: 'id' },
        onDelete: 'SET NULL',
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'SENT'),
        allowNull: false,
        defaultValue: 'PENDING',
      },
      ...timestamps(Sequelize),
    });
    await addIndex(queryInterface, 'release_notifications', ['user_id', 'movie_id'], {
      name: 'release_notifications_user_movie',
      unique: true,
    });

    await createTable(queryInterface, 'seats', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      showtime_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'showtimes', key: 'id' },
        onDelete: 'CASCADE',
      },
      code: { type: Sequelize.STRING(10), allowNull: false },
      row: { type: Sequelize.STRING(5), allowNull: false },
      number: { type: Sequelize.INTEGER, allowNull: false },
      type: {
        type: Sequelize.ENUM('STANDARD', 'VIP', 'ACCESSIBLE'),
        allowNull: false,
        defaultValue: 'STANDARD',
      },
      status: {
        type: Sequelize.ENUM('AVAILABLE', 'HELD', 'SOLD', 'DISABLED'),
        allowNull: false,
        defaultValue: 'AVAILABLE',
      },
      price_modifier: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      ...timestamps(Sequelize),
    });
    await addIndex(queryInterface, 'seats', ['showtime_id', 'code'], {
      name: 'seats_showtime_code',
      unique: true,
    });

    await createTable(queryInterface, 'seat_locks', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      showtime_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'showtimes', key: 'id' },
        onDelete: 'CASCADE',
      },
      seat_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'seats', key: 'id' },
        onDelete: 'CASCADE',
      },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'RELEASED', 'EXPIRED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      expires_at: { type: Sequelize.DATE, allowNull: false },
      released_at: { type: Sequelize.DATE, allowNull: true },
      ...timestamps(Sequelize),
    });
    await addIndex(queryInterface, 'seat_locks', ['seat_id', 'status'], {
      name: 'seat_locks_seat_status',
    });
    await addIndex(queryInterface, 'seat_locks', ['expires_at'], { name: 'seat_locks_expires_at' });
  },

  async down(queryInterface) {
    for (const table of [
      'seat_locks',
      'seats',
      'release_notifications',
      'purchase_histories',
      'memberships',
      'profiles',
    ]) {
      if (await tableExists(queryInterface, table)) await queryInterface.dropTable(table);
    }
  },
};
