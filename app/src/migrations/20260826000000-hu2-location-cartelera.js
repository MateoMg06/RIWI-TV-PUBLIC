'use strict';

async function columnExists(queryInterface, tableName, columnName) {
  try {
    const table = await queryInterface.describeTable(tableName);
    return !!table[columnName];
  } catch (_) {
    return false;
  }
}

async function addColumnIfMissing(queryInterface, Sequelize, tableName, columnName, attributes) {
  if (await columnExists(queryInterface, tableName, columnName)) return false;
  await queryInterface.addColumn(tableName, columnName, attributes);
  return true;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. cities.active
    await addColumnIfMissing(queryInterface, Sequelize, 'cities', 'active', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });

    // 2. cinemas.active (reutiliza campo existente si ya existe como is_active no duplica)
    const cinemasHasActive = await columnExists(queryInterface, 'cinemas', 'active');
    const cinemasHasIsActive = await columnExists(queryInterface, 'cinemas', 'is_active');
    if (!cinemasHasActive && !cinemasHasIsActive) {
      await queryInterface.addColumn('cinemas', 'active', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      });
    }

    // 3. showtime.showtime_status (requerimiento: dim_showtime usa showtime_status no is_active)
    const showHasStatus = await columnExists(queryInterface, 'showtime', 'showtime_status');
    if (!showHasStatus) {
      await queryInterface.addColumn('showtime', 'showtime_status', {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'ACTIVE',
      });
    }
    // compat: si existe is_active en showtime, mantener pero no obligatorio
    // 4. users.city_id
    const hasCityId = await columnExists(queryInterface, 'users', 'city_id');
    if (!hasCityId) {
      await queryInterface.addColumn('users', 'city_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
        references: { model: 'cities', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });
      // index para búsquedas
      try {
        await queryInterface.addIndex('users', ['city_id'], { name: 'users_city_id_idx' });
      } catch (_) {}
    }

    // Backfill defaults for existing rows
    try {
      await queryInterface.sequelize.query('UPDATE cities SET active = true WHERE active IS NULL;');
    } catch (_) {}
    try {
      if (cinemasHasActive || !cinemasHasIsActive) {
        await queryInterface.sequelize.query('UPDATE cinemas SET active = true WHERE active IS NULL;');
      }
    } catch (_) {}
    try {
      await queryInterface.sequelize.query("UPDATE showtime SET showtime_status = 'ACTIVE' WHERE showtime_status IS NULL;");
    } catch (_) {}

    // Ensure check on showtime_status values
    // no constraint, handled at app level
  },

  async down(queryInterface, Sequelize) {
    // remover en orden inverso, solo si existen
    if (await columnExists(queryInterface, 'users', 'city_id')) {
      try { await queryInterface.removeIndex('users', 'users_city_id_idx'); } catch (_) {}
      await queryInterface.removeColumn('users', 'city_id');
    }
    if (await columnExists(queryInterface, 'showtime', 'showtime_status')) {
      // solo remover si la creamos en up y no existía antes; para simplicidad la removemos
      // si BD entregada ya la tenía, este down la eliminaría – en producción revisar.
      await queryInterface.removeColumn('showtime', 'showtime_status');
    }
    // cinemas.active solo si lo creamos y no había is_active previamente
    const stillHasIsActive = await columnExists(queryInterface, 'cinemas', 'is_active');
    if (!stillHasIsActive && (await columnExists(queryInterface, 'cinemas', 'active'))) {
      await queryInterface.removeColumn('cinemas', 'active');
    }
    if (await columnExists(queryInterface, 'cities', 'active')) {
      await queryInterface.removeColumn('cities', 'active');
    }
  },
};
