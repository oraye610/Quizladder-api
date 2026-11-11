
'use strict';

const { matchedData } = require('express-validator');
const questionSetService = require('../services/question-set.service');

// Only return the fields needed by the API.
function toJson(questionSet) {
  return {
    question_set_id: questionSet.question_set_id,
    name: questionSet.name,
    created_at: questionSet.created_at,
  };
}

// GET /question-sets
async function list(req, res) {
  const questionSets = await questionSetService.list();

  res.status(200).json(questionSets.map(toJson));
}

// GET /question-sets/:id
async function get(req, res) {
  const { id } = matchedData(req, {
    locations: ['params'],
  });

  const questionSet = await questionSetService.get(id);

  res.status(200).json(toJson(questionSet));
}

// POST /question-sets
async function create(req, res) {
  const data = matchedData(req, {
    locations: ['body'],
  });

  const questionSet = await questionSetService.create(data);

  res.status(201).json(toJson(questionSet));
}

// PATCH /question-sets/:id
async function update(req, res) {
  const { id } = matchedData(req, {
    locations: ['params'],
  });

  const changes = matchedData(req, {
    locations: ['body'],
  });

  const questionSet = await questionSetService.update(id, changes);

  res.status(200).json(toJson(questionSet));
}

// DELETE /question-sets/:id
async function remove(req, res) {
  const { id } = matchedData(req, {
    locations: ['params'],
  });

  await questionSetService.remove(id);

  res.status(204).end();
}

module.exports = {
  list,
  get,
  create,
  update,
  remove,
};
