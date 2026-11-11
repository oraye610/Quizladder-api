
'use strict';

module.exports = (sequelize, DataTypes) => {
  const QuestionSet = sequelize.define(
    'QuestionSet',
    {
      question_set_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: 'question_sets',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  return QuestionSet;
};
