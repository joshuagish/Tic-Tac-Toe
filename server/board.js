const aiMove = require('./aiMove')
const helpers = require('./helpers')

let socket
let boards = []

module.exports = {
  newBoard,
  getBoard,
  setMove,
  initSocket
}

function getBoard (id) {
  return boards[id]
}

function newBoard (id) {
  let boardId = id !== undefined ? id : boards.length
  boards[boardId] = [
    [[], [], []],
    [[], [], []],
    [[], [], []]
  ]

  // Randomly let the computer go first
  if (helpers.flipCoin()) {
    let loc = helpers.randomLocation()
    boards[boardId][loc.row][loc.col] = 'O'
  }

  return boardId
}

function setMove (uid, boardId, row, col) {
  let board = boards[boardId]
  if (!board[row][col].length) {
    board[row][col] = 'X'
    if (helpers.checkForWin('X', board, row, col)) {
      socket.emit(uid + '_stat', 'player')
    } else {
      let movesLeft = helpers.openLocation(board)
      if (movesLeft) {
        let move = aiMove(board)
        board[move.row][move.col] = 'O'
        if (helpers.checkForWin('O', board, move.row, move.col)) {
          socket.emit(uid + '_stat', 'computer')
        } else if (!helpers.openLocation(board)) {
          socket.emit(uid + '_stat', 'tie')
        }
      } else {
        socket.emit(uid + '_stat', 'tie')
      }
    }
  }
}

function initSocket (socketio) {
  socket = socketio
}

