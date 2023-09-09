import {
  createBoard,
  markTile,
  revealTile,
  TILE_STATUS,
} from "./minesweeper.js";

const BOARD_SIZE = 10;
const NUMBER_OF_MINES = 10;

const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES);
const boardElement = document.querySelector(".board");
const mineCounter = document.querySelector(".mine-counter");
const restartButton = document.querySelector(".restart-button");

restartButton.addEventListener("click", () => {
  location.reload();
})

boardElement.style.setProperty("--size", BOARD_SIZE);
mineCounter.textContent = NUMBER_OF_MINES;

board.forEach((row) => {
  row.forEach((tile) => {
    boardElement.append(tile.cell);
    tile.cell.addEventListener("click", () => {
      revealTile(board, tile);
    });
    tile.cell.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      markTile(tile);
      listMinesLeft();
    });
  });
});

const listMinesLeft = () => {
  const markedTilesCount = board.reduce((count, row) => {
    return (
      count + row.filter((tile) => tile.status === TILE_STATUS.MARKED).length
    );
  }, 0);

  mineCounter.textContent = NUMBER_OF_MINES - markedTilesCount;
};
