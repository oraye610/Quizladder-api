
'use strict';

const env = require('../config/env');
const hostRepository = require('../repositories/host.repository');
const { User } = require('../models');

if (env.nodeEnv === 'production') {
  throw new Error('current-user.js is the Week 11 stand-in. Replace it before production.');
}

async function currentUser(req, res, next) {
  try {
    const demoUser = req.get('X-Demo-User');

    if (!demoUser) {
      req.user = null;
      return next();
    }

    // Check HOST first.
    const host = await hostRepository.findByUsername(demoUser);

    if (host) {
      req.user = {
        host_id: host.host_id,
        username: host.username,
        role: 'HOST',
      };

      return next();
    }

    // Check STUDENT using school_id.
    const user = await User.findOne({
      where: { school_id: demoUser },
    });

    req.user = user
      ? {
          user_id: user.user_id,
          school_id: user.school_id,
          full_name: user.full_name,
          role: user.role,
        }
      : null;

    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = currentUser;
