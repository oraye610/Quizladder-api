
'use strict';

const sessionService = require('./session.service');
const playerRepository = require('../repositories/player.repository');
const {
  badRequest,
  conflict,
} = require('../errors/app-error');

const VALID_AVATAR_COLORS = [
  'RED',
  'BLUE',
  'GREEN',
  'YELLOW',
];

async function joinOrRejoin(code, data, user) {
  const session = await sessionService.findOrFail(code);

  // Check for an existing player first.
  const existingPlayer = await playerRepository.findSeat(
    session.session_id,
    user.user_id
  );

  // Existing players may rejoin even when the game is PLAYING.
  if (existingPlayer) {
    return {
      player: existingPlayer,
      isRejoin: true,
    };
  }

  // New players can only join while the game is WAITING.
  if (session.status !== 'WAITING') {
    throw conflict(
      'SESSION_NOT_JOINABLE',
      'You can only join a game while it is WAITING.'
    );
  }

  const nickname = data.nickname?.trim();
  const avatarColor = data.avatar_color?.toUpperCase();

  if (!nickname) {
    throw badRequest(
      'INVALID_NICKNAME',
      'Nickname cannot be empty.'
    );
  }

  if (!VALID_AVATAR_COLORS.includes(avatarColor)) {
    throw badRequest(
      'INVALID_AVATAR_COLOR',
      'Avatar color must be RED, BLUE, GREEN, or YELLOW.'
    );
  }

  // Let database constraint errors reach the global error handler.
  const player = await playerRepository.create({
    session_id: session.session_id,
    user_id: user.user_id,
    nickname,
    avatar_color: avatarColor,
    position: 1,
    finish_position: null,
    finished_at: null,
    joined_at: new Date(),
  });

  return {
    player,
    isRejoin: false,
  };
}

async function listBySession(code) {
  const session = await sessionService.findOrFail(code);

  return playerRepository.findAllBySession(session.session_id);
}

module.exports = {
  joinOrRejoin,
  listBySession,
};
