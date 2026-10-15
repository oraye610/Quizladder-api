'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('players', 'user_id', {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });

    await queryInterface.addConstraint('players', {
      fields: ['session_id', 'user_id'],
      type: 'unique',
      name: 'players_session_id_user_id_unique',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('players', 'players_session_id_user_id_unique');
    await queryInterface.removeColumn('players', 'user_id');
  }
};
