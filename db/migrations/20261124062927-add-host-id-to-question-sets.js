
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'question_sets',
        'host_id',
        {
          type: Sequelize.BIGINT,
          allowNull: true,
          references: {
            model: 'hosts',
            key: 'host_id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        { transaction }
      );

      // Check whether question sets already exist.
      const [questionSets] = await queryInterface.sequelize.query(
        'SELECT question_set_id FROM question_sets LIMIT 1',
        { transaction }
      );

      // Only backfill existing records.
      if (questionSets.length > 0) {
        const [hosts] = await queryInterface.sequelize.query(
          'SELECT host_id FROM hosts ORDER BY host_id ASC LIMIT 1',
          { transaction }
        );

        if (hosts.length === 0) {
          throw new Error(
            'Cannot assign existing question sets: no host record exists.'
          );
        }

        await queryInterface.bulkUpdate(
          'question_sets',
          { host_id: hosts[0].host_id },
          {},
          { transaction }
        );
      }

      // Make host_id required after backfilling.
      await queryInterface.changeColumn(
        'question_sets',
        'host_id',
        {
          type: Sequelize.BIGINT,
          allowNull: false,
          references: {
            model: 'hosts',
            key: 'host_id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        { transaction }
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('question_sets', 'host_id');
  },
};
