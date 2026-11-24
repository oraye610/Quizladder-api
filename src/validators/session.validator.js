
'use strict';

const { param, body } = require('express-validator');

const joinCodeRules = [
  param('code')
    .isLength({ min: 6, max: 6 })
    .withMessage('Join code must be exactly 6 characters.')
    .isNumeric()
    .withMessage('Join code must contain only numbers.'),
];

const createRules = [
  body('question_set_id')
    .isInt({ min: 1 })
    .withMessage('Question set ID must be a positive integer.'),
];

const statusRules = [
  body('status')
    .trim()
    .isIn(['PLAYING', 'FINISHED'])
    .withMessage('Status must be PLAYING or FINISHED.'),
];

module.exports = {
  joinCodeRules,
  createRules,
  statusRules,
};
