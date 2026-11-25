
'use strict';

const { param, body } = require('express-validator');

const joinCodeRules = [
  param('code')
    .isLength({ min: 6, max: 6 })
    .withMessage('Join code must be exactly 6 characters.')
    .isNumeric()
    .withMessage('Join code must contain only numbers.'),
];

const joinRules = [
  body('nickname')
    .trim()
    .notEmpty()
    .withMessage('Nickname cannot be empty.')
    .isLength({ min: 2, max: 30 })
    .withMessage('Nickname must be between 2 and 30 characters.'),

  body('avatar_color')
    .trim()
    .toUpperCase()
    .isIn(['RED', 'BLUE', 'GREEN', 'YELLOW'])
    .withMessage('Avatar color must be RED, BLUE, GREEN, or YELLOW.'),
];

module.exports = {
  joinCodeRules,
  joinRules,
};
