import aiMove from './aiMove.js'
import { checkForWin, flipCoin, openLocation, randomLocation } from './helpers.js'

let socketEmitter
let boards = []

export const getBoard = (id) => boards[id]

export const newBoard = (id) => {
  const boardId = id ?? boards.length
  boards[boardId] = [
    [[], [], []],
    [[], [], []],
    [[], [], []],
  ]

  // Randomly let the computer go first
  if (flipCoin()) {
    const loc = randomLocation()
    boards[boardId][loc.row][loc.col] = 'O'
  }

  return boardId
}

export const setMove = (userId, boardId, row, col) => {
  const board = boards[boardId]
  if (!board[row][col].length) {
    board[row][col] = 'X'

    if (checkForWin('X', board, row, col)) {
      socketEmitter(userId, 'stat', 'player')
    } else {
      const movesLeft = openLocation(board)
      if (movesLeft) {
        const move = aiMove(board)
        board[move.row][move.col] = 'O'
        if (checkForWin('O', board, move.row, move.col)) {
          socketEmitter(userId, 'stat', 'computer')
        } else if (!openLocation(board)) {
          socketEmitter(userId, 'stat', 'tie')
        }
      } else {
        socketEmitter(userId, 'stat', 'tie')
      }
    }
  }
}

export const setEmitter = (emitter) => {
  socketEmitter = emitter
}
