'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('questions', {
      question_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      question_set_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'question_sets',
          key: 'question_set_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      question_text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('questions');
  }
};
