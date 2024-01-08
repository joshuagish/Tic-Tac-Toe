import { copyBoard, checkForWin, openLocation, traverseBoard } from './helpers.js'

export default (board) => {
  const oWinningMoves = findWinningMoves(board, 'O')
  const xWinningMOves = findWinningMoves(board, 'X')
  const oRes = findBestMove(oWinningMoves, board)
  const xRes = findBestMove(xWinningMOves, board)
  return oRes.moves <= xRes.moves ? oRes : xRes
}

function findWinningMoves (board, letter) {
  const possibleMoves = { 1: [], 2: [], 3: [] }

  const findWinningMove = (board, moves = 1) => {
    if (moves > 3) return

    traverseBoard(board, (cell, row, col) => {
      if (!cell.length) {
        const tmpBoard = copyBoard(board)
        tmpBoard[row][col] = letter
        const won = checkForWin(letter, tmpBoard, row, col)
        if (won) {
          possibleMoves[moves].push(row + '.' + col)
        } else {
          findWinningMove(tmpBoard, moves + 1)
        }
      }
    })
  }
  findWinningMove(copyBoard(board))

  return possibleMoves
}

function findBestMove (score, board) {
  const moves = score['1'].length ? 1 : score['2'].length ? 2 : 3
  const best = score[moves]

  const options = {}
  best.forEach((coordinate) => {
    if (options[coordinate]) options[coordinate]++
    else options[coordinate] = 1
  })

  let highest = 0
  let res
  for (const key in options) {
    if (options[key] > highest) highest = options[key]
    res = key.split('.')
  }
  return res ? {row: res[0], col: res[1], moves: moves} : openLocation(board)
}
