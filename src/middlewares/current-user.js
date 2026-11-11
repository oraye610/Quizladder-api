'use strict';

const env = require('../config/env');
const hostRepository = require('../repositories/host.repository');

if (env.nodeEnv === 'production') {
  throw new Error('current-user.js is the Week 11 stand-in. Replace it before production.');
}

async function currentUser(req, res, next) {
  const username = req.get('X-Demo-User');
  const host = username
    ? await hostRepository.findByUsername(username)
    : null;

  req.user = host
    ? {
        host_id: host.host_id,
        username: host.username,
        role: 'HOST',
      }
    : null;

  next();
}

module.exports = currentUser;