'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('players', {
      player_id: {
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
      nickname: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      avatar_color: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      position: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      finish_position: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      finished_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      joined_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addConstraint('players', {
      fields: ['session_id', 'nickname'],
      type: 'unique',
      name: 'players_session_id_nickname_unique',
    });

    await queryInterface.addConstraint('players', {
      fields: ['session_id', 'avatar_color'],
      type: 'unique',
      name: 'players_session_id_avatar_color_unique',
    });

    await queryInterface.addConstraint('players', {
      fields: ['position'],
      type: 'check',
      name: 'players_position_check',
      where: {
        position: {
          [Sequelize.Op.between]: [1, 100],
        },
      },
    });

    await queryInterface.addConstraint('players', {
      fields: ['avatar_color'],
      type: 'check',
      name: 'players_avatar_color_check',
      where: {
        avatar_color: ['RED', 'BLUE', 'GREEN', 'YELLOW'],
      },
    });

    await queryInterface.addConstraint('players', {
      fields: ['finish_position'],
      type: 'check',
      name: 'players_finish_position_check',
      where: {
        [Sequelize.Op.or]: [
          { finish_position: null },
          {
            finish_position: {
              [Sequelize.Op.between]: [1, 4],
            },
          },
        ],
      },
    });
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('players');
  }
};
