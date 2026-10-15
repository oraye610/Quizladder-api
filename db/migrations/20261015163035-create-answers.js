'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('answers', {
      answer_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      question_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'questions',
          key: 'question_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      choice_index: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      answer_text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      is_correct: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    });

    await queryInterface.addConstraint('answers', {
      fields: ['question_id', 'choice_index'],
      type: 'unique',
      name: 'answers_question_id_choice_index_unique',
    });

    await queryInterface.addConstraint('answers', {
      fields: ['choice_index'],
      type: 'check',
      name: 'answers_choice_index_check',
      where: {
        choice_index: {
          [Sequelize.Op.between]: [1, 4],
        },
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('answers');
  }
};
