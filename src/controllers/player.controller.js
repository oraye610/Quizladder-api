
'use strict';

const playerService = require('../services/player.service');

async function join(req, res, next) {
  try {
    const result = await playerService.joinOrRejoin(
      req.params.code,
      req.body,
      req.user
    );

    return res.status(result.isRejoin ? 200 : 201).json({
      data: result.player,
    });
  } catch (error) {
    return next(error);
  }
}

async function list(req, res, next) {
  try {
    const players = await playerService.listBySession(
      req.params.code
    );

    return res.status(200).json({
      data: players,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  join,
  list,
};
