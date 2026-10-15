'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('turns', {
      turn_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      session_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'game_sessions',
          key: 'session_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      player_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'players',
          key: 'player_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      turn_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      dice_result: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      event_type: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'NONE',
      },
      event_target_player_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: 'players',
          key: 'player_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      event_amount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      question_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: 'questions',
          key: 'question_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      started_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      ended_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addConstraint('turns', {
      fields: ['dice_result'],
      type: 'check',
      name: 'turns_dice_result_check',
      where: {
        [Sequelize.Op.or]: [
          { dice_result: null },
          {
            dice_result: {
              [Sequelize.Op.between]: [1, 6],
            },
          },
        ],
      },
    });

    await queryInterface.addConstraint('turns', {
      fields: ['event_type'],
      type: 'check',
      name: 'turns_event_type_check',
      where: {
        event_type: ['NONE', 'QUESTION', 'PUNISHMENT'],
      },
    });

    await queryInterface.addConstraint('turns', {
      fields: ['event_amount'],
      type: 'check',
      name: 'turns_event_amount_check',
      where: {
        [Sequelize.Op.or]: [
          { event_amount: null },
          {
            event_amount: {
              [Sequelize.Op.between]: [-6, 2],
            },
          },
        ],
      },
    });
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('turns');
  }
};
