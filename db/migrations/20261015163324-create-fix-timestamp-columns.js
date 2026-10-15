'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const columns = [
      ['hosts', 'created_at'],
      ['question_sets', 'created_at'],
      ['game_sessions', 'created_at'],
      ['game_sessions', 'started_at'],
      ['game_sessions', 'finished_at'],
      ['players', 'finished_at'],
      ['players', 'joined_at'],
      ['turns', 'started_at'],
      ['turns', 'ended_at'],
    ];

    for (const [table, column] of columns) {
      await queryInterface.sequelize.query(`
        ALTER TABLE "${table}"
        ALTER COLUMN "${column}"
        TYPE TIMESTAMP WITHOUT TIME ZONE
        USING "${column}" AT TIME ZONE 'UTC';
      `);
    }
  },

  async down (queryInterface, Sequelize) {
      const columns = [
      ['hosts', 'created_at'],
      ['question_sets', 'created_at'],
      ['game_sessions', 'created_at'],
      ['game_sessions', 'started_at'],
      ['game_sessions', 'finished_at'],
      ['players', 'finished_at'],
      ['players', 'joined_at'],
      ['turns', 'started_at'],
      ['turns', 'ended_at'],
    ];

    for (const [table, column] of columns) {
      await queryInterface.sequelize.query(`
        ALTER TABLE "${table}"
        ALTER COLUMN "${column}"
        TYPE TIMESTAMP WITH TIME ZONE
        USING "${column}" AT TIME ZONE 'UTC';
      `);
    }
  },
};
