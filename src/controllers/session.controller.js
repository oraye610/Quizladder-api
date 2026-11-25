
'use strict';

const sessionService = require('../services/session.service');

async function create(req, res, next) {
  try {
    const session = await sessionService.create(
      req.body,
      req.user
    );

    return res.status(201).json({
      data: session,
    });
  } catch (error) {
    return next(error);
  }
}

async function getByCode(req, res, next) {
  try {
    const session = await sessionService.findOrFail(
      req.params.code
    );

    return res.status(200).json({
      data: session,
    });
  } catch (error) {
    return next(error);
  }
}

async function changeStatus(req, res, next) {
  try {
    const session = await sessionService.changeStatus(
      req.params.code,
      req.body.status,
      req.user
    );

    return res.status(200).json({
      data: session,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  create,
  getByCode,
  changeStatus,
};
