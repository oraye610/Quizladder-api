'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('boards', {
      board_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      size: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 100,
      },
    });

    await queryInterface.addConstraint('boards', {
      fields: ['size'],
      type: 'check',
      name: 'boards_size_check',
      where: {
        size: 100,
      },
    });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('boards');
  }
};
