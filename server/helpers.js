module.exports = {
  copyBoard,
  checkForWin,
  flipCoin,
  randomLocation,
  openLocation
}

function flipCoin () {
  return Math.random() < 0.5
}

function randomLocation () {
  return {
    row: ~~(Math.random() * 3),
    col: ~~(Math.random() * 3)
  }
}

function openLocation (board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      if (!board[i][j].length) return {row: i, col: j, moves: 3}
    }
  }
}

function checkForWin (letter, board, row, col) {
  // check for diagonal win
  if (board[1][1] === letter && checkDiagonal(letter, board) ||
      board[1][1] === letter && checkDiagonal(letter, rotateBoard(board))) {
    return true
  }
  // check for horizontal, vertical win
  if (checkHorizontal(letter, board, row) ||
      checkHorizontal(letter, rotateBoard(board), col)) {
    return true
  }
  return false
}

function copyBoard (board) {
  let result = []
  board.forEach((row) => result.push(row.slice()))
  return result
}

function rotateBoard (board) {
  let result = []
  let boardCopy = copyBoard(board)

  for (var i = 0; i < 3; i++) {
    result.push(boardCopy.map(row => { return row.shift() }).reverse())
  }
  return result
}

function checkDiagonal (letter, board) {
  return board[0][0] === letter &&
    board[1][1] === letter &&
    board[2][2] === letter
}

function checkHorizontal (letter, board, row) {
  return board[row][0] === letter &&
    board[row][1] === letter &&
    board[row][2] === letter
}

