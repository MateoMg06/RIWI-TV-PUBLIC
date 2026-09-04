'use strict';

async function columnExists(queryInterface, tableName, columnName) {
  const columns = await queryInterface.describeTable(tableName);
  return Boolean(columns[columnName]);
}

module.exports = {
  async up(queryInterface, Sequelize) {
    if (!(await columnExists(queryInterface, 'movies', 'release_date'))) {
      await queryInterface.addColumn('movies', 'release_date', {
        allowNull: true,
        type: Sequelize.DATEONLY,
      });
    }
  },

  async down(queryInterface) {
    if (await columnExists(queryInterface, 'movies', 'release_date')) {
      await queryInterface.removeColumn('movies', 'release_date');
    }
  },
};