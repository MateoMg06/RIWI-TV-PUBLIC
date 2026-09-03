'use strict';

/**
 * Migración: Auth Enhancements
 * ----------------------------
 * Añade columnas de tokens a la tabla `users` y crea las tablas
 * `refresh_tokens`, `access_audits` y `password_reset_tokens` para
 * soportar:
 *  - Almacenamiento del accessToken en la base de datos.
 *  - Rotación e invalidación de refresh tokens.
 *  - Auditoría de accesos (login, refresh, logout, reset de contraseña).
 *  - Registro de IP y dispositivo.
 *  - Recuperación de contraseña (forgot / reset).
 */

async function tableExists(queryInterface, tableName) {
  const tables = await queryInterface.showAllTables();
  const normalize = (t) => (typeof t === 'string' ? t : t.tableName || t.table_name || String(t));
  return tables.map(normalize).includes(tableName);
}

async function columnExists(queryInterface, tableName, columnName) {
  const table = await queryInterface.describeTable(tableName);
  return Object.prototype.hasOwnProperty.call(table, columnName);
}

module.exports = {
  async up(queryInterface, Sequelize) {
    // ------------------------------------------------------------------
    // 1. Añadir columnas a la tabla `users`
    // ------------------------------------------------------------------
    const usersTable = 'users';

    if (await tableExists(queryInterface, usersTable)) {
      if (!(await columnExists(queryInterface, usersTable, 'accessToken'))) {
        await queryInterface.addColumn(usersTable, 'accessToken', {
          type: Sequelize.STRING(255),
          allowNull: true,
        });
      }

      if (!(await columnExists(queryInterface, usersTable, 'refreshToken'))) {
        await queryInterface.addColumn(usersTable, 'refreshToken', {
          type: Sequelize.STRING(255),
          allowNull: true,
        });
      }

      if (!(await columnExists(queryInterface, usersTable, 'resetToken'))) {
        await queryInterface.addColumn(usersTable, 'resetToken', {
          type: Sequelize.STRING(255),
          allowNull: true,
        });
      }

      if (!(await columnExists(queryInterface, usersTable, 'resetTokenExpires'))) {
        await queryInterface.addColumn(usersTable, 'resetTokenExpires', {
          type: Sequelize.DATE,
          allowNull: true,
        });
      }
    }

    // ------------------------------------------------------------------
    // 2. Crear tabla `refresh_tokens`
    // ------------------------------------------------------------------
    if (!(await tableExists(queryInterface, 'refresh_tokens'))) {
      await queryInterface.createTable('refresh_tokens', {
        id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
        user_id: {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        token: { allowNull: false, type: Sequelize.STRING(255) },
        ip_address: { allowNull: true, type: Sequelize.STRING(45) },
        device: { allowNull: true, type: Sequelize.STRING(255) },
        user_agent: { allowNull: true, type: Sequelize.TEXT },
        expires_at: { allowNull: false, type: Sequelize.DATE },
        revoked: { allowNull: false, type: Sequelize.BOOLEAN, defaultValue: false },
        created_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
        updated_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      });

      await queryInterface.addIndex('refresh_tokens', ['user_id']);
      await queryInterface.addIndex('refresh_tokens', ['token'], { unique: true });
    }

    // ------------------------------------------------------------------
    // 3. Crear tabla `access_audits`
    // ------------------------------------------------------------------
    if (!(await tableExists(queryInterface, 'access_audits'))) {
      await queryInterface.createTable('access_audits', {
        id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
        user_id: {
          allowNull: true,
          type: Sequelize.INTEGER,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        action: {
          allowNull: false,
          type: Sequelize.ENUM(
            'login',
            'login_failed',
            'refresh',
            'logout',
            'password_reset_requested',
            'password_reset',
            'account_activated'
          ),
        },
        ip_address: { allowNull: true, type: Sequelize.STRING(45) },
        device: { allowNull: true, type: Sequelize.STRING(255) },
        user_agent: { allowNull: true, type: Sequelize.TEXT },
        success: { allowNull: false, type: Sequelize.BOOLEAN, defaultValue: true },
        details: { allowNull: true, type: Sequelize.TEXT },
        created_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      });

      await queryInterface.addIndex('access_audits', ['user_id']);
      await queryInterface.addIndex('access_audits', ['action']);
      await queryInterface.addIndex('access_audits', ['created_at']);
    }

    // ------------------------------------------------------------------
    // 4. Crear tabla `password_reset_tokens`
    // ------------------------------------------------------------------
    if (!(await tableExists(queryInterface, 'password_reset_tokens'))) {
      await queryInterface.createTable('password_reset_tokens', {
        id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
        user_id: {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        token: { allowNull: false, type: Sequelize.STRING(255) },
        expires_at: { allowNull: false, type: Sequelize.DATE },
        used: { allowNull: false, type: Sequelize.BOOLEAN, defaultValue: false },
        created_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
        updated_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      });

      await queryInterface.addIndex('password_reset_tokens', ['user_id']);
      await queryInterface.addIndex('password_reset_tokens', ['token'], { unique: true });
    }
  },

  async down(queryInterface) {
    for (const tableName of ['password_reset_tokens', 'access_audits', 'refresh_tokens']) {
      if (await tableExists(queryInterface, tableName)) {
        await queryInterface.dropTable(tableName);
      }
    }

    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_access_audits_action";');

    const usersTable = 'users';
    if (await tableExists(queryInterface, usersTable)) {
      for (const columnName of ['accessToken', 'refreshToken', 'resetToken', 'resetTokenExpires']) {
        if (await columnExists(queryInterface, usersTable, columnName)) {
          await queryInterface.removeColumn(usersTable, columnName);
        }
      }
    }
  },
};
