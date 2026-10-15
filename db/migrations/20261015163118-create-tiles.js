'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable('tiles', {
      tile_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      board_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'boards',
          key: 'board_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      tile_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      tile_type: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      destination_tile: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    });

    await queryInterface.addConstraint('tiles', {
      fields: ['board_id', 'tile_number'],
      type: 'unique',
      name: 'tiles_board_id_tile_number_unique',
    });

    await queryInterface.addConstraint('tiles', {
      fields: ['tile_number'],
      type: 'check',
      name: 'tiles_tile_number_check',
      where: {
        tile_number: {
          [Sequelize.Op.between]: [1, 100],
        },
      },
    });

    await queryInterface.addConstraint('tiles', {
      fields: ['tile_type'],
      type: 'check',
      name: 'tiles_tile_type_check',
      where: {
        tile_type: ['NORMAL', 'EVENT', 'SNAKE', 'LADDER'],
      },
    });

    await queryInterface.addConstraint('tiles', {
      fields: ['destination_tile'],
      type: 'check',
      name: 'tiles_destination_tile_check',
      where: {
        [Sequelize.Op.or]: [
          { destination_tile: null },
          {
            destination_tile: {
              [Sequelize.Op.between]: [1, 100],
            },
          },
        ],
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('tiles');
  }
};
