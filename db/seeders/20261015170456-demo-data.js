'use strict';

// Demo data for QuizLadder: one finished game (3 players reached tile 100
// exactly) and one game still in progress.

const SCHOOL_IDS = ['2023-00123', '2023-00456', '2023-00789', '2024-00111', '2024-00222', 'FAC-0042'];
const JOIN_CODES = ['482913', '735104'];
const HOST_USERNAME = 'librarian';
const QUESTION_SET_NAME = 'Library Basics';

const LADDERS = { 4: 25, 13: 46, 33: 49, 42: 63, 50: 69, 74: 92 };
const SNAKES = { 27: 5, 40: 3, 43: 18, 54: 31, 62: 19, 66: 45, 76: 58, 89: 53, 95: 75, 98: 78 };
const EVENTS = [7, 15, 22, 30, 45, 53, 68, 77, 85, 93];

function buildTiles(boardId) {
  const tiles = [];
  for (let n = 1; n <= 100; n += 1) {
    let tileType = 'NORMAL';
    let destination = null;
    if (LADDERS[n]) {
      tileType = 'LADDER';
      destination = LADDERS[n];
    } else if (SNAKES[n]) {
      tileType = 'SNAKE';
      destination = SNAKES[n];
    } else if (EVENTS.includes(n)) {
      tileType = 'EVENT';
    }
    tiles.push({ board_id: boardId, tile_number: n, tile_type: tileType, destination_tile: destination });
  }
  return tiles;
}

const at = (iso) => new Date(iso);

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const insert = (table, rows) => queryInterface.bulkInsert(table, rows, { transaction, returning: true });

      const users = await insert('users', [
        { school_id: SCHOOL_IDS[0], full_name: 'Ana Dela Cruz', email: 'ana.delacruz@sorsu.edu.ph', role: 'STUDENT' },
        { school_id: SCHOOL_IDS[1], full_name: 'Ben Reyes', email: 'ben.reyes@sorsu.edu.ph', role: 'STUDENT' },
        { school_id: SCHOOL_IDS[2], full_name: 'Carla Santos', email: 'carla.santos@sorsu.edu.ph', role: 'STUDENT' },
        { school_id: SCHOOL_IDS[3], full_name: 'Dino Villanueva', email: 'dino.villanueva@sorsu.edu.ph', role: 'STUDENT' },
        { school_id: SCHOOL_IDS[4], full_name: 'Eli Gonzales', email: 'eli.gonzales@sorsu.edu.ph', role: 'STUDENT' },
        { school_id: SCHOOL_IDS[5], full_name: 'Faye Bautista', email: 'faye.bautista@sorsu.edu.ph', role: 'FACULTY' },
      ]);
      const [ana, ben, carla, dino, eli, faye] = users.map((u) => u.user_id);

      // Demo only: not a real password hash.
      const [host] = await insert('hosts', [
        { username: HOST_USERNAME, password_hash: 'demo-only-not-a-real-hash' },
      ]);

      const [questionSet] = await insert('question_sets', [{ name: QUESTION_SET_NAME }]);

      const questionData = [
        ['What system do most libraries use to arrange books by subject?', ['Dewey Decimal Classification', 'Alphabetical by color', 'Date of purchase', 'Page count'], 1],
        ['What do you need to borrow a book from the SorSU library?', ['A library card or school ID', 'A bus ticket', 'A phone charger', 'Nothing at all'], 1],
        ['Which part of a book lists topics and the pages they appear on?', ['Cover', 'Index', 'Spine', 'Dedication'], 2],
        ['What does OPAC stand for?', ['Open Print Access Center', 'Online Public Access Catalog', 'Official Paper Archive Copy', 'Optical Page Scanner'], 2],
        ['Which of these should you NOT do in the library?', ['Return books on time', 'Ask the librarian for help', 'Eat noisy snacks near the shelves', 'Use the catalog'], 3],
      ];

      const questions = await insert(
        'questions',
        questionData.map(([text]) => ({ question_set_id: questionSet.question_set_id, question_text: text }))
      );

      const answers = [];
      questions.forEach((q, i) => {
        const [, choices, correct] = questionData[i];
        choices.forEach((answerText, c) => {
          answers.push({
            question_id: q.question_id,
            choice_index: c + 1,
            answer_text: answerText,
            is_correct: c + 1 === correct,
          });
        });
      });
      await insert('answers', answers);
      const [q1, q2, q3] = questions.map((q) => q.question_id);

      const [board1, board2] = (await insert('boards', [{ size: 100 }, { size: 100 }])).map((b) => b.board_id);
      await insert('tiles', [...buildTiles(board1), ...buildTiles(board2)]);

      const [finished, playing] = (await insert('game_sessions', [
        {
          host_id: host.host_id,
          question_set_id: questionSet.question_set_id,
          board_id: board1,
          join_code: JOIN_CODES[0],
          status: 'FINISHED',
          created_at: at('2026-10-10T00:55:00Z'),
          started_at: at('2026-10-10T01:00:00Z'),
          finished_at: at('2026-10-10T01:40:00Z'),
        },
        {
          host_id: host.host_id,
          question_set_id: questionSet.question_set_id,
          board_id: board2,
          join_code: JOIN_CODES[1],
          status: 'PLAYING',
          created_at: at('2026-10-14T01:55:00Z'),
          started_at: at('2026-10-14T02:00:00Z'),
          finished_at: null,
        },
      ])).map((s) => s.session_id);

      const players = await insert('players', [
        { session_id: finished, user_id: ana, nickname: 'AnaReads', avatar_color: 'RED', position: 100, finish_position: 1, finished_at: at('2026-10-10T01:30:00Z'), joined_at: at('2026-10-10T00:56:00Z') },
        { session_id: finished, user_id: ben, nickname: 'BookwormBen', avatar_color: 'BLUE', position: 100, finish_position: 2, finished_at: at('2026-10-10T01:35:00Z'), joined_at: at('2026-10-10T00:57:00Z') },
        { session_id: finished, user_id: carla, nickname: 'CarlaQuiz', avatar_color: 'GREEN', position: 100, finish_position: 3, finished_at: at('2026-10-10T01:40:00Z'), joined_at: at('2026-10-10T00:57:30Z') },
        { session_id: finished, user_id: dino, nickname: 'DinoDice', avatar_color: 'YELLOW', position: 87, finish_position: null, finished_at: null, joined_at: at('2026-10-10T00:58:00Z') },
        { session_id: playing, user_id: ana, nickname: 'AnaReads', avatar_color: 'RED', position: 34, finish_position: null, finished_at: null, joined_at: at('2026-10-14T01:56:00Z') },
        { session_id: playing, user_id: eli, nickname: 'EliExplorer', avatar_color: 'BLUE', position: 29, finish_position: null, finished_at: null, joined_at: at('2026-10-14T01:57:00Z') },
        { session_id: playing, user_id: faye, nickname: 'ProfFaye', avatar_color: 'GREEN', position: 41, finish_position: null, finished_at: null, joined_at: at('2026-10-14T01:58:00Z') },
      ]);
      const [pAna, pBen, pCarla, pDino, pAna2, pEli, pFaye] = players.map((p) => p.player_id);

      const turn = (session, player, n, dice, start, end, extra = {}) => ({
        session_id: session,
        player_id: player,
        turn_number: n,
        dice_result: dice,
        event_type: 'NONE',
        event_target_player_id: null,
        event_amount: null,
        question_id: null,
        started_at: at(start),
        ended_at: end ? at(end) : null,
        ...extra,
      });

      await insert('turns', [
        turn(finished, pAna, 1, 5, '2026-10-10T01:25:00Z', '2026-10-10T01:26:00Z', { event_type: 'QUESTION', question_id: q1, event_amount: 2 }),
        turn(finished, pBen, 2, 3, '2026-10-10T01:26:00Z', '2026-10-10T01:27:00Z'),
        turn(finished, pCarla, 3, 6, '2026-10-10T01:27:00Z', '2026-10-10T01:28:00Z', { event_type: 'PUNISHMENT', event_target_player_id: pDino, event_amount: -3 }),
        turn(finished, pDino, 4, 2, '2026-10-10T01:28:00Z', '2026-10-10T01:29:00Z', { event_type: 'QUESTION', question_id: q2, event_amount: -1 }),
        // Ana lands exactly on 100 (96 + 4).
        turn(finished, pAna, 5, 4, '2026-10-10T01:29:00Z', '2026-10-10T01:30:00Z'),
        // Ben lands exactly on 100 (97 + 3).
        turn(finished, pBen, 6, 3, '2026-10-10T01:34:00Z', '2026-10-10T01:35:00Z'),
        turn(finished, pDino, 7, 1, '2026-10-10T01:36:00Z', '2026-10-10T01:37:00Z'),
        // Carla lands exactly on 100 (94 + 6).
        turn(finished, pCarla, 8, 6, '2026-10-10T01:39:00Z', '2026-10-10T01:40:00Z'),
        turn(playing, pAna2, 1, 3, '2026-10-14T02:01:00Z', '2026-10-14T02:02:00Z'),
        turn(playing, pEli, 2, 5, '2026-10-14T02:02:00Z', '2026-10-14T02:03:00Z', { event_type: 'QUESTION', question_id: q3, event_amount: 2 }),
        turn(playing, pFaye, 3, 6, '2026-10-14T02:03:00Z', '2026-10-14T02:04:00Z', { event_type: 'PUNISHMENT', event_target_player_id: pAna2, event_amount: -2 }),
        turn(playing, pAna2, 4, 2, '2026-10-14T02:04:00Z', null),
      ]);
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.sequelize.transaction(async (transaction) => {
      const run = (sql, replacements) => queryInterface.sequelize.query(sql, { transaction, replacements });
      const sessions = 'SELECT session_id FROM game_sessions WHERE join_code IN (:codes)';
      const sets = 'SELECT question_set_id FROM question_sets WHERE name = :setName';
      const codes = { codes: JOIN_CODES };

      await run(`DELETE FROM turns WHERE session_id IN (${sessions})`, codes);
      await run(`DELETE FROM players WHERE session_id IN (${sessions})`, codes);
      const boards = await run('SELECT board_id FROM game_sessions WHERE join_code IN (:codes)', codes);
      const boardIds = boards[0].map((b) => b.board_id);
      await run('DELETE FROM game_sessions WHERE join_code IN (:codes)', codes);
      if (boardIds.length) {
        await run('DELETE FROM tiles WHERE board_id IN (:boardIds)', { boardIds });
        await run('DELETE FROM boards WHERE board_id IN (:boardIds)', { boardIds });
      }
      await run(`DELETE FROM answers WHERE question_id IN (SELECT question_id FROM questions WHERE question_set_id IN (${sets}))`, { setName: QUESTION_SET_NAME });
      await run(`DELETE FROM questions WHERE question_set_id IN (${sets})`, { setName: QUESTION_SET_NAME });
      await run('DELETE FROM question_sets WHERE name = :setName', { setName: QUESTION_SET_NAME });
      await run('DELETE FROM hosts WHERE username = :username', { username: HOST_USERNAME });
      await run('DELETE FROM users WHERE school_id IN (:schoolIds)', { schoolIds: SCHOOL_IDS });
    });
  }
};
