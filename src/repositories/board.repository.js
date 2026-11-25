
'use strict';

const { Board, Tile } = require('../models');

const LADDERS = {
  4: 25,
  13: 46,
  33: 49,
  42: 63,
  50: 69,
  74: 92,
};

const SNAKES = {
  27: 5,
  40: 3,
  43: 18,
  54: 31,
  62: 19,
  66: 45,
  76: 58,
  89: 53,
  95: 75,
  98: 78,
};

const EVENTS = [7, 15, 22, 30, 45, 53, 68, 77, 85, 93];

function buildTiles(boardId) {
  const tiles = [];

  for (let number = 1; number <= 100; number += 1) {
    let tileType = 'NORMAL';
    let destination = null;

    if (LADDERS[number]) {
      tileType = 'LADDER';
      destination = LADDERS[number];
    } else if (SNAKES[number]) {
      tileType = 'SNAKE';
      destination = SNAKES[number];
    } else if (EVENTS.includes(number)) {
      tileType = 'EVENT';
    }

    tiles.push({
      board_id: boardId,
      tile_number: number,
      tile_type: tileType,
      destination_tile: destination,
    });
  }

  return tiles;
}

async function createWithTiles(transaction) {
  const options = transaction ? { transaction } : {};

  const board = await Board.create(
    { size: 100 },
    options
  );

  await Tile.bulkCreate(
    buildTiles(board.board_id),
    options
  );

  return board;
}

module.exports = {
  createWithTiles,
  buildTiles,
};
