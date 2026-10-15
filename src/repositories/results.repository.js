// Hub Contract rule 7: retrieve players from finished QuizLadder games.
// Score is the final board position (100 for every finisher, since they must
// land exactly on tile 100). finish_position decides the rank.

const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

async function findFinishedGamePlayers(since) {
  const sql = `
    SELECT
      s.join_code AS session_code,
      s.started_at AS started_at,
      s.finished_at AS ended_at,
      u.school_id AS school_id,
      p.nickname AS nickname,
      p.position AS score,
      p.finish_position AS finish_position,
      (p.finished_at IS NOT NULL) AS completed
    FROM game_sessions AS s
    JOIN players AS p
      ON p.session_id = s.session_id
    JOIN users AS u
      ON u.user_id = p.user_id
    WHERE s.status = 'FINISHED'
      AND s.finished_at IS NOT NULL
      AND (
        CAST(:since AS timestamp) IS NULL
        OR s.finished_at > CAST(:since AS timestamp)
      )
    ORDER BY
      s.finished_at ASC,
      p.finish_position ASC NULLS LAST,
      p.position DESC,
      p.nickname ASC
  `;

  return sequelize.query(sql, {
    type: QueryTypes.SELECT,
    replacements: {
      since: since ? since.toISOString() : null,
    },
  });
}

module.exports = { findFinishedGamePlayers };
