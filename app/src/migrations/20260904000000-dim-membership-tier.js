'use strict';

// Migracion de dim_membership_tier
// Crea la tabla de niveles de membresia y mete los 4 niveles basicos
// bronce, plata, oro y platino

async function tableExists(queryInterface, tableName) {
  const tables = await queryInterface.showAllTables();
  const normalize = (t) => (typeof t === 'string' ? t : t.tableName || t.table_name || String(t));
  return tables.map(normalize).includes(tableName);
}

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. crear la tabla si no existe
    if (!(await tableExists(queryInterface, 'dim_membership_tier'))) {
      await queryInterface.createTable('dim_membership_tier', {
        membership_tier_key: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.SMALLINT,
        },
        tier_code: {
          allowNull: false,
          unique: true,
          type: Sequelize.STRING(30),
        },
        tier_name: {
          allowNull: false,
          type: Sequelize.STRING(30),
        },
        minium_points: {
          allowNull: false,
          defaultValue: 0,
          type: Sequelize.INTEGER,
        },
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
    }

    // 2. meter los 4 niveles si la tabla esta vacia
    const rows = await queryInterface.sequelize.query('SELECT COUNT(*) as total FROM "dim_membership_tier";', {
      type: queryInterface.sequelize.QueryTypes.SELECT,
    });

    const total = parseInt(rows[0].total, 10);
    if (total === 0) {
      await queryInterface.bulkInsert('dim_membership_tier', [
        { tier_code: 'BRONCE', tier_name: 'Bronce', minium_points: 0, createdAt: new Date(), updatedAt: new Date() },
        { tier_code: 'PLATA', tier_name: 'Plata', minium_points: 500, createdAt: new Date(), updatedAt: new Date() },
        { tier_code: 'ORO', tier_name: 'Oro', minium_points: 1500, createdAt: new Date(), updatedAt: new Date() },
        { tier_code: 'PLATINO', tier_name: 'Platino', minium_points: 3000, createdAt: new Date(), updatedAt: new Date() },
      ]);
    }
  },

  async down(queryInterface) {
    if (await tableExists(queryInterface, 'dim_membership_tier')) {
      await queryInterface.dropTable('dim_membership_tier');
    }
  },
};
