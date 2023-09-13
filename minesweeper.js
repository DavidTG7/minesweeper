export const TILE_STATUS = {
  HIDDEN: "hidden",
  MINE: "mine",
  NUMBER: "number",
  MARKED: "marked",
};

export const createBoard = (boardSize, numberOfMine) => {
  const board = [];
  const minePositions = getMinePositions(boardSize, numberOfMine);

  for (let x = 0; x < boardSize; x++) {
    const row = [];
    for (let y = 0; y < boardSize; y++) {
      const cell = document.createElement("div");
      cell.dataset.status = TILE_STATUS.HIDDEN;

      const tile = {
        cell,
        x,
        y,
        mine: minePositions.some(positionMatch.bind(null, { x, y })),
        get status() {
          return this.cell.dataset.status;
        },
        set status(value) {
          this.cell.dataset.status = value;
        },
      };

      row.push(tile);
    }
    board.push(row);
  }

  return board;
};

export const markTile = (tile) => {
  if (tile.status !== TILE_STATUS.HIDDEN && tile.status !== TILE_STATUS.MARKED)
    return;

  if (tile.status === TILE_STATUS.MARKED) tile.status = TILE_STATUS.HIDDEN;
  else tile.status = TILE_STATUS.MARKED;
};

export const revealTile = (board, tile) => {
  if (tile.status !== TILE_STATUS.HIDDEN) return;

  if (tile.mine) {
    tile.status = TILE_STATUS.MINE;
    return;
  }

  tile.status = TILE_STATUS.NUMBER;

  const adjacentsTiles = nearbyTiles(board, tile);
  const mines = adjacentsTiles.filter((t) => t.mine);

  if (mines.length === 0) {
    adjacentsTiles.forEach(revealTile.bind(null, board));
  } else {
    tile.cell.textContent = mines.length;
  }
};

export const checkWin = (board) => {
  return board.every((row) => {
    return row.every((tile) => {
      return (
        tile.status === TILE_STATUS.NUMBER ||
        (tile.mine &&
          (tile.status === TILE_STATUS.HIDDEN ||
            tile.status === TILE_STATUS.MARKED))
      );
    });
  });
};

export const checkLose = (board) => {
  return board.some((row) => {
    return row.some((tile) => {
      return tile.status === TILE_STATUS.MINE;
    });
  });
};

const getMinePositions = (boardSize, numberOfMines) => {
  const positions = [];

  while (positions.length < numberOfMines) {
    const position = {
      x: randomNumber(boardSize),
      y: randomNumber(boardSize),
    };

    if (!positions.some(positionMatch.bind(null, position))) {
      positions.push(position);
    }
  }

  return positions;
};

const positionMatch = (a, b) => {
  return a.x === b.x && a.y === b.y;
};

const randomNumber = (size) => {
  return Math.floor(Math.random() * size);
};

const nearbyTiles = (board, { x, y }) => {
  const tiles = [];

  for (let xOffset = -1; xOffset <= 1; xOffset++) {
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      const tile = board[x + xOffset]?.[y + yOffset];
      if (tile) tiles.push(tile);
    }
  }

  return tiles;
};
