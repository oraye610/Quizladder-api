
'use strict';

const env = require('../config/env');
const hostRepository = require('../repositories/host.repository');
const { User } = require('../models');

if (env.nodeEnv === 'production') {
  throw new Error(
    'current-user.js is the Week 11 stand-in. Replace it before production.'
  );
}

async function currentUser(req, res, next) {
  try {
    const demoUser = req.get('X-Demo-User');

    console.log('\n========== CURRENT USER DEBUG ==========');
    console.log('X-Demo-User:', demoUser);

    if (!demoUser) {
      req.user = null;
      console.log('REQ.USER: null (no demo user)');
      console.log('========================================\n');
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

      console.log('IDENTIFIED AS HOST:', req.user);
      console.log('========================================\n');

      return next();
    }

    // Check STUDENT using school_id.
    const user = await User.findOne({
      where: { school_id: demoUser },
    });

    console.log(
      'DATABASE USER:',
      user ? user.toJSON() : 'USER NOT FOUND'
    );

    req.user = user
      ? {
          user_id: user.user_id,
          school_id: user.school_id,
          full_name: user.full_name,
          role: user.role,
        }
      : null;

    console.log('FINAL REQ.USER:', req.user);
    console.log('========================================\n');

    return next();
  } catch (error) {
    console.error('CURRENT USER MIDDLEWARE ERROR:', error);
    return next(error);
  }
}

module.exports = currentUser;
