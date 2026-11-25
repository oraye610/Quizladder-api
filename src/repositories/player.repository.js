
'use strict';

const { Player } = require('../models');

// Find an existing player in a session.
function findSeat(sessionId, userId) {
  return Player.findOne({
    where: {
      session_id: sessionId,
      user_id: userId,
    },
  });
}

// Count players currently in a session.
function countBySession(sessionId) {
  return Player.count({
    where: { session_id: sessionId },
  });
}

// Get all players in a session.
function findAllBySession(sessionId) {
  return Player.findAll({
    where: { session_id: sessionId },
    attributes: [
      'player_id',
      'nickname',
      'position',
      'finish_position',
    ],
    order: [['joined_at', 'ASC']],
  });
}

// Create a new player.
function create(data) {
  return Player.create(data);
}

module.exports = {
  findSeat,
  countBySession,
  findAllBySession,
  create,
};
