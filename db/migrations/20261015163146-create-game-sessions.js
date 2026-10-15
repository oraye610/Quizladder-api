'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable('game_sessions', {
      session_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      host_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'hosts',
          key: 'host_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
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
      board_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true,
        references: {
          model: 'boards',
          key: 'board_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      join_code: {
        type: Sequelize.CHAR(6),
        allowNull: false,
        unique: true,
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'WAITING',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      started_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      finished_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addConstraint('game_sessions', {
      fields: ['status'],
      type: 'check',
      name: 'game_sessions_status_check',
      where: {
        status: ['WAITING', 'PLAYING', 'FINISHED'],
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('game_sessions');
  }
};
