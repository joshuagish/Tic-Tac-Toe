export const flipCoin = () => Math.random() < 0.5

export const randomLocation = () => {
  return {
    row: ~~(Math.random() * 3),
    col: ~~(Math.random() * 3)
  }
}

export const openLocation = (board) => {
  let location
  traverseBoard(board, (cell, row, col) => {
    if (!location && !cell.length) {
      location = { row, col, moves: 3 }
    }
  })
  return location
}

export const checkForWin = (letter, board, row, col) => {
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

export const copyBoard = (board) => {
  const result = []
  board.forEach((row) => result.push(row.slice()))
  return result
}

export const rotateBoard = (board) => {
  const result = []
  const boardCopy = copyBoard(board);

  [...new Array(3)].forEach(() => {
    result.push(boardCopy.map(row => { return row.shift() }).reverse())
  })

  return result
}

export const checkDiagonal = (letter, board) => {
  return board[0][0] === letter &&
    board[1][1] === letter &&
    board[2][2] === letter
}

export const checkHorizontal = (letter, board, row) => {
  return board[row][0] === letter &&
    board[row][1] === letter &&
    board[row][2] === letter
}

export const traverseBoard = (board, callback) => {
  for (const [rowIndex, row] of board.entries()) {
    for (const [cellIndex, cell] of row.entries()) {
      callback(cell, rowIndex, cellIndex)
    }
  }
}
