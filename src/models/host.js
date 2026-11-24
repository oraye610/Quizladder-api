'use strict';

module.exports = (sequelize, DataTypes) => {
  const Host = sequelize.define('Host', {
    host_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  }, {
    tableName: 'hosts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  });

  return Host;
};