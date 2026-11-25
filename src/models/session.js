
'use strict';

module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define(
    'Session',
    {
      session_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      host_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      question_set_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      board_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      join_code: {
        type: DataTypes.CHAR(6),
        allowNull: false,
        unique: true,
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'WAITING',
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      started_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      finished_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'game_sessions',
      timestamps: false,
    }
  );

  return Session;
};
