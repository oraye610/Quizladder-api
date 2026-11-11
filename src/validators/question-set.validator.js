'use strict';

const { param, body } = require('express-validator');

const idParam = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Question set ID must be a positive integer.'),
];

const createRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Question set name is required.')
    .isLength({ max: 100 })
    .withMessage('Question set name must not exceed 100 characters.'),
];

const updateRules = [
  ...idParam,
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Question set name cannot be empty.')
    .isLength({ max: 100 })
    .withMessage('Question set name must not exceed 100 characters.'),
];

module.exports = {
  idParam,
  createRules,
  updateRules,
};