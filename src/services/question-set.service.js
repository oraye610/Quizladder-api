
'use strict';

const questionSetRepository = require('../repositories/question-set.repository');
const { notFound } = require('../errors/app-error');

async function list() {
  return questionSetRepository.findAll();
}

async function get(id) {
  const questionSet = await questionSetRepository.findById(id);

  if (!questionSet) {
    throw notFound(
      'QUESTION_SET_NOT_FOUND',
      'Question set not found.'
    );
  }

  return questionSet;
}

async function create(data) {
  return questionSetRepository.create(data);
}

async function update(id, changes) {
  const questionSet = await get(id);

  return questionSetRepository.update(questionSet, changes);
}

async function remove(id) {
  const questionSet = await get(id);

  await questionSetRepository.remove(questionSet);
}

module.exports = {
  list,
  get,
  create,
  update,
  remove,
};
