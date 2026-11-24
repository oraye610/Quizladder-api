
'use strict';

const { QuestionSet } = require('../models');

function findAll() {
  return QuestionSet.findAll({
    order: [['question_set_id', 'ASC']],
  });
}

function findById(id) {
  return QuestionSet.findByPk(id);
}

function findByIdAndHost(id, hostId) {
  return QuestionSet.findOne({
    where: {
      question_set_id: id,
      host_id: hostId,
    },
  });
}

function create(data) {
  return QuestionSet.create(data);
}

function update(questionSet, changes) {
  return questionSet.update(changes);
}

function remove(questionSet) {
  return questionSet.destroy();
}

module.exports = {
  findAll,
  findById,
  findByIdAndHost,
  create,
  update,
  remove,
};
