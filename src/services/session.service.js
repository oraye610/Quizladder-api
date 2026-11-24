
'use strict';

const { sequelize } = require('../models');
const sessionRepository = require('../repositories/session.repository');
const questionSetRepository = require('../repositories/question-set.repository');
const boardRepository = require('../repositories/board.repository');
const { forbidden, notFound, conflict } = require('../errors/app-error');

const NEXT_STATUS = {
  WAITING: ['PLAYING', 'FINISHED'],
  PLAYING: ['FINISHED'],
  FINISHED: [],
};

async function findOrFail(code) {
  const session = await sessionRepository.findByCode(code);

  if (!session) {
    throw notFound('SESSION_NOT_FOUND', 'Session not found.');
  }

  return session;
}

async function create(data, user) {
  const questionSet = await questionSetRepository.findByIdAndHost(
    data.question_set_id,
    user.host_id
  );

  if (!questionSet) {
    throw notFound('QUESTION_SET_NOT_FOUND', 'Question set not found.');
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const joinCode = String(
      Math.floor(100000 + Math.random() * 900000)
    );

    try {
      return await sequelize.transaction(async (transaction) => {
        const board = await boardRepository.createWithTiles(transaction);

        return sessionRepository.create({
          host_id: user.host_id,
          question_set_id: questionSet.question_set_id,
          board_id: board.board_id,
          join_code: joinCode,
          status: 'WAITING',
          created_at: new Date(),
          started_at: null,
          finished_at: null,
        }, transaction);
      });
    } catch (error) {
      const isJoinCodeConflict =
        error.name === 'SequelizeUniqueConstraintError' &&
        (
          error.errors?.some((item) => item.path === 'join_code') ||
          error.fields?.join_code !== undefined ||
          error.parent?.constraint === 'game_sessions_join_code_key'
        );

      if (isJoinCodeConflict && attempt < 4) {
        continue;
      }

      if (isJoinCodeConflict) {
        throw conflict(
          'JOIN_CODE_GENERATION_FAILED',
          'Could not generate a unique join code.'
        );
      }

      throw error;
    }
  }
}

async function changeStatus(code, status, user) {
  const session = await findOrFail(code);

  if (
    String(session.host_id) !== String(user.host_id) &&
    user.role !== 'ADMIN'
  ) {
    throw forbidden('This game belongs to another host.');
  }

  if (!NEXT_STATUS[session.status]?.includes(status)) {
    throw conflict(
      'INVALID_STATUS_CHANGE',
      `A ${session.status} game cannot become ${status}.`
    );
  }

  const changes = { status };

  if (status === 'PLAYING') {
    changes.started_at = new Date();
  }

  if (status === 'FINISHED') {
    changes.finished_at = new Date();
  }

  return sessionRepository.update(session, changes);
}

module.exports = {
  findOrFail,
  create,
  changeStatus,
};
