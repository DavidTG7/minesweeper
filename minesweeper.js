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
