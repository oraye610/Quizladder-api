// A database rule was broken -> what the client should hear.
module.exports = {
  // Question set cannot be deleted while questions still reference it.
  questions_question_set_id_fkey: {
    status: 409,
    code: 'QUESTION_SET_HAS_QUESTIONS',
    message: 'Cannot delete this question set because it still has questions.',
  },

  players_session_id_nickname_unique: {
    status: 409,
    code: 'NICKNAME_TAKEN',
    message: 'That nickname is already used in this game.',
  },
  // Duplicate question-set name.
  question_sets_name_key: {
    status: 409,
    code: 'QUESTION_SET_NAME_TAKEN',
    message: 'A question set with this name already exists.',
  },

  // Duplicate username.
  hosts_username_key: {
    status: 409,
    code: 'USERNAME_TAKEN',
    message: 'This username is already taken.',
  },

  // Duplicate choice index for the same question.
  answers_question_id_choice_index_unique: {
    status: 409,
    code: 'CHOICE_INDEX_TAKEN',
    message: 'This choice index is already used for the question.',
  },

  // Duplicate tile number on the same board.
  tiles_board_id_tile_number_unique: {
    status: 409,
    code: 'TILE_NUMBER_TAKEN',
    message: 'This tile number already exists on the board.',
  },
};