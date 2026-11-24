
'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('hosts', [
      {
        username: 'librarian2',
        password_hash: 'demo-only-not-a-real-hash',
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(
      'hosts',
      { username: 'librarian2' },
      {}
    );
  },
};


