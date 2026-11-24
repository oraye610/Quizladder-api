
'use strict';

const { Session } = require('../models');

function findByCode(code) {
  return Session.findOne({
    where: { join_code: code },
  });
}

function create(data, transaction) {
  return Session.create(data, { transaction });
}

function update(session, changes) {
  return session.update(changes);
}

module.exports = {
  findByCode,
  create,
  update,
};
