
'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const env = require('../config/env');
const dbConfig = require('../config/database')[env.nodeEnv];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

// Models
const User = require('./user')(sequelize, DataTypes);
const QuestionSet = require('./question-set')(sequelize, DataTypes);
const Host = require('./host')(sequelize, DataTypes);
const Session = require('./session')(sequelize, DataTypes);
const Player = require('./player')(sequelize, DataTypes);
const Board = require('./board')(sequelize, DataTypes);
const Tile = require('./tile')(sequelize, DataTypes);

// Host and Session
Host.hasMany(Session, { foreignKey: 'host_id' });
Session.belongsTo(Host, { foreignKey: 'host_id' });

// QuestionSet and Session
QuestionSet.hasMany(Session, { foreignKey: 'question_set_id' });
Session.belongsTo(QuestionSet, { foreignKey: 'question_set_id' });

// Board and Session
Board.hasOne(Session, { foreignKey: 'board_id' });
Session.belongsTo(Board, { foreignKey: 'board_id' });

// Board and Tile
Board.hasMany(Tile, { foreignKey: 'board_id' });
Tile.belongsTo(Board, { foreignKey: 'board_id' });

// Session and Player
Session.hasMany(Player, { foreignKey: 'session_id' });
Player.belongsTo(Session, { foreignKey: 'session_id' });

// User and Player
User.hasMany(Player, { foreignKey: 'user_id' });
Player.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  Sequelize,
  DataTypes,
  User,
  QuestionSet,
  Host,
  Session,
  Player,
  Board,
  Tile,
};
