'use strict';

module.exports = (sequelize, DataTypes) => {
  const Tile = sequelize.define('Tile', {
    tile_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    board_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    tile_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tile_type: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    destination_tile: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: 'tiles',
    timestamps: false,
  });

  return Tile;
};