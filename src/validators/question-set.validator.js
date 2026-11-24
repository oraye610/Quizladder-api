
'use strict';

const { param, body, check } = require('express-validator');

const idParam = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Question set ID must be a positive integer.'),
];

const createRules = [
  body('name')
    .isString()
    .withMessage('Question set name must be a string.')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Question set name is required.')
    .isLength({ min: 3, max: 100 })
    .withMessage('Question set name must be between 3 and 100 characters.'),
];

const updateRules = [
  ...idParam,

  check()
    .custom((value, { req }) => {
      if (!req.body || Object.keys(req.body).length === 0) {
        throw new Error('At least one field is required to update.');
      }
      return true;
    }),

  body('name')
    .optional()
    .isString()
    .withMessage('Question set name must be a string.')
    .bail()
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
