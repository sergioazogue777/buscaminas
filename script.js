'use strict';

const state = {
  board: [], revealed: [], flagged: [], firstMove: true,
  gameOver: false, mines: 0, rows: 0, cols: 0
};

function readNumber(message, fallback, min, max) {
  const response = prompt(message, String(fallback));
  const value = Number(response);
  return response !== null && Number.isInteger(value) && value >= min && value <= max ? value : fallback;
}

function main() {
  state.cols = readNumber('Número de columnas (5-30)', 10, 5, 30);
  state.rows = readNumber('Número de filas (5-30)', 10, 5, 30);
  state.mines = readNumber('Número de minas', 15, 1, state.rows * state.cols - 1);

  const table = document.querySelector('table');
  table.replaceChildren();
  state.board = Array.from({ length: state.rows }, () => Array(state.cols).fill(0));
  state.revealed = Array.from({ length: state.rows }, () => Array(state.cols).fill(false));
  state.flagged = Array.from({ length: state.rows }, () => Array(state.cols).fill(false));

  for (let row = 0; row < state.rows; row++) {
    const tr = table.insertRow();
    for (let col = 0; col < state.cols; col++) {
      const cell = tr.insertCell();
      cell.className = 'cell';
      cell.setAttribute('aria-label', 'Casilla oculta');
      cell.addEventListener('click', () => reveal(row, col));
      cell.addEventListener('contextmenu', event => {
        event.preventDefault();
        toggleFlag(row, col);
      });
    }
  }
}

function neighbors(row, col) {
  const result = [];
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const y = row + dy, x = col + dx;
      if (y >= 0 && y < state.rows && x >= 0 && x < state.cols) result.push([y, x]);
    }
  }
  return result;
}

function placeMines(firstRow, firstCol) {
  const candidates = [];
  for (let row = 0; row < state.rows; row++) {
    for (let col = 0; col < state.cols; col++) {
      if (row !== firstRow || col !== firstCol) candidates.push([row, col]);
    }
  }
  // Fisher-Yates: each available cell has the same chance of receiving a mine.
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
  candidates.slice(0, state.mines).forEach(([row, col]) => { state.board[row][col] = -1; });
  for (let row = 0; row < state.rows; row++) {
    for (let col = 0; col < state.cols; col++) {
      if (state.board[row][col] === -1) continue;
      state.board[row][col] = neighbors(row, col).filter(([y, x]) => state.board[y][x] === -1).length;
    }
  }
}

function cellAt(row, col) {
  return document.querySelector('table').rows[row].cells[col];
}

function paint(row, col, image, label) {
  const cell = cellAt(row, col);
  cell.style.backgroundImage = 'url("' + image + '")';
  cell.setAttribute('aria-label', label);
}

function reveal(row, col) {
  if (state.gameOver || state.flagged[row][col] || state.revealed[row][col]) return;
  if (state.firstMove) {
    placeMines(row, col);
    state.firstMove = false;
  }
  const pending = [[row, col]];
  while (pending.length) {
    const [y, x] = pending.pop();
    if (state.revealed[y][x] || state.flagged[y][x]) continue;
    state.revealed[y][x] = true;
    const value = state.board[y][x];
    if (value === -1) {
      paint(y, x, 'minaQuePeta.png', 'Mina');
      finish(false);
      return;
    }
    paint(y, x, value + '.png', value ? value + ' minas cercanas' : 'Vacía');
    if (value === 0) neighbors(y, x).forEach(([ny, nx]) => {
      if (!state.revealed[ny][nx] && !state.flagged[ny][nx]) pending.push([ny, nx]);
    });
  }
  const uncovered = state.revealed.flat().filter(Boolean).length;
  if (uncovered === state.rows * state.cols - state.mines) finish(true);
}

function toggleFlag(row, col) {
  if (state.gameOver || state.revealed[row][col]) return;
  state.flagged[row][col] = !state.flagged[row][col];
  paint(row, col, state.flagged[row][col] ? 'bandera.png' : 'btn.png',
    state.flagged[row][col] ? 'Bandera' : 'Casilla oculta');
}

function finish(won) {
  state.gameOver = true;
  for (let row = 0; row < state.rows; row++) {
    for (let col = 0; col < state.cols; col++) {
      if (state.board[row][col] === -1 && !state.revealed[row][col]) {
        paint(row, col, state.flagged[row][col] ? 'minaBandera.png' : 'restoDeMinas.png', 'Mina');
      }
    }
  }
  const result = document.getElementById('result');
  result.textContent = won ? '¡Has ganado!' : 'Has perdido. Vuelve a intentarlo.';
}
window.addEventListener('DOMContentLoaded', main);
