
'use strict';

const express = require('express');
const router = express.Router();

const playerController = require('../controllers/player.controller');
const playerValidator = require('../validators/player.validator');
const validate = require('../middlewares/validate');
const requireUser = require('../middlewares/require-user');

// Join or rejoin a game.
router.post(
  '/:code/players',
  requireUser(),
  playerValidator.joinCodeRules,
  playerValidator.joinRules,
  validate,
  playerController.join
);

// List players in a game.
router.get(
  '/:code/players',
  playerValidator.joinCodeRules,
  validate,
  playerController.list
);

module.exports = router;
