import {
  createBoard,
  markTile,
  revealTile,
  TILE_STATUS,
  checkWin,
  checkLose,
} from "./minesweeper.js";

const BOARD_SIZE = 10;
const NUMBER_OF_MINES = 15;

const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES);
const boardElement = document.querySelector(".board");
const mineCounter = document.querySelector(".mine-counter");
const restartButton = document.querySelector(".restart-button");
const messageText = document.querySelector(".subtext");

restartButton.addEventListener("click", () => {
  location.reload();
});

boardElement.style.setProperty("--size", BOARD_SIZE);
mineCounter.textContent = NUMBER_OF_MINES;

board.forEach((row) => {
  row.forEach((tile) => {
    boardElement.append(tile.cell);
    tile.cell.addEventListener("click", () => {
      revealTile(board, tile);
      checkGameEnd();
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

const checkGameEnd = () => {
  const win = checkWin(board);
  const lose = checkLose(board);

  if (win || lose) {
    boardElement.addEventListener("click", stopProp, { capture: true });
    boardElement.addEventListener("contextmenu", stopProp, { capture: true });
  }

  if (win) {
    messageText.style.background = "green"
    messageText.style.padding = "0 10px"
    messageText.textContent = "You Win :D";
  }

  if (lose) {
    messageText.style.background = "darkred"
    messageText.style.padding = "0 10px"
    messageText.textContent = "You Lose :(";
    board.forEach((row) => {
      row.forEach((tile) => {
        if (tile.status === TILE_STATUS.MARKED) markTile(tile);
        if (tile.mine) revealTile(board, tile);
      });
    });
  }
};

const stopProp = (e) => {
  e.stopImmediatePropagation();
};
