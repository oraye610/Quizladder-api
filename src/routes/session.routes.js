
'use strict';

const express = require('express');
const router = express.Router();

const sessionController = require('../controllers/session.controller');
const sessionValidator = require('../validators/session.validator');
const validate = require('../middlewares/validate');
const requireUser = require('../middlewares/require-user');

// Create a new game session (HOST only).
router.post(
  '/',
  requireUser('HOST'),
  sessionValidator.createRules,
  validate,
  sessionController.create
);

// Get a session using its join code.
router.get(
  '/:code',
  sessionValidator.joinCodeRules,
  validate,
  sessionController.getByCode
);

// Change session status (HOST only).
router.patch(
  '/:code',
  requireUser('HOST'),
  sessionValidator.joinCodeRules,
  sessionValidator.statusRules,
  validate,
  sessionController.changeStatus
);

module.exports = router;
