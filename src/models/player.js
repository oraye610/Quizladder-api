
'use strict';

module.exports = (sequelize, DataTypes) => {
  const Player = sequelize.define(
    'Player',
    {
      player_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      session_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      nickname: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      avatar_color: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      finish_position: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      finished_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      joined_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: 'players',
      timestamps: false,
    }
  );

  return Player;
};

