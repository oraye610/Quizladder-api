// What the Library Game Hub shows about YOUR game (Hub Contract, rule 1).
// Lab Step 6: replace every CHANGE_ME value with your own.
const pkg = require('../../package.json');

module.exports = {
  slug: 'quizladder',            // your group's game, lower case with hyphens, for example shelf-climb
  name: 'QuizLadder',            // the name players will see
  team: 'GROUP 8',            // your group's name and section, for example Bookworms (3-1)
  developer: 'oraye610',       // YOUR GitHub username: this build is yours
  description: 'A multiplayer educational Snake and Ladder game for the SorSU Bulan Campus library.',     // one sentence about how the game is played
  min_players: 2,               // change to the limits your game is designed for
  max_players: 4,
  version: pkg.version,         // read from package.json, do not edit here
};
