const helpers = require('./helpers')
let possibleMoves

module.exports = (board) => {
  initMoves()
  findMoves(helpers.copyBoard(board), 'O')
  findMoves(helpers.copyBoard(board), 'X')
  let oRes = findBestMove(possibleMoves.O, board)
  let xRes = findBestMove(possibleMoves.X, board)
  return oRes.moves <= xRes.moves ? oRes : xRes
}

function findMoves (board, letter, moves = 1) {
  if (moves > 3) return

  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      if (!board[i][j].length) {
        let tmpBoard = helpers.copyBoard(board)
        tmpBoard[i][j] = letter
        let won = helpers.checkForWin(letter, tmpBoard, i, j)
        if (won) {
          possibleMoves[letter][moves].push(i + '.' + j)
        } else {
          findMoves(tmpBoard, letter, moves + 1)
        }
      }
    }
  }
}

function findBestMove (score, board) {
  let moves = score['1'].length ? 1 : score['2'].length ? 2 : 3
  let best = score[moves]

  let options = {}
  best.forEach((coordinate) => {
    if (options[coordinate]) options[coordinate]++
    else options[coordinate] = 1
  })

  var highest = 0
  var res
  for (var key in options) {
    if (options[key] > highest) highest = options[key]
    res = key.split('.')
  }
  return res ? {row: res[0], col: res[1], moves: moves} : helpers.openLocation(board)
}

function initMoves () {
  possibleMoves = {
    X: {1: [], 2: [], 3: []},
    O: {1: [], 2: [], 3: []}
  }
}
