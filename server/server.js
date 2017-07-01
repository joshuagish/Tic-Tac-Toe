const express = require('express')
const path = require('path')
const app = express()
var http = require('http').createServer(app)
var io = require('socket.io')(http)

const board = require('./board')
const users = require('./users')

app.set('port', process.env.PORT || 2020)
app.use(express.static(path.join(__dirname, './../build')))

io.on('connection', socket => {
  console.log('a user has connected on socket', socket.id)
  board.initSocket(socket)

  socket.on('newGame', (body) => {
    if (typeof body === 'function') {
      let boardId = board.newBoard()
      let uid = users.newUser(boardId)
      body(uid)
    } else {
      let boardId = users.getBoardId(body)
      board.newBoard(boardId)
      socket.emit(body + '_game', board.getBoard(boardId))
    }
  })

  socket.on('getGame', (uid) => {
    let boardId = users.getBoardId(uid)
    socket.emit(uid + '_game', board.getBoard(boardId))
  })

  socket.on('move', (event) => {
    let boardId = users.getBoardId(event.uid)
    board.setMove(event.uid, boardId, event.row, event.col)
    socket.emit(event.uid + '_game', board.getBoard(boardId))
  })
})

http.listen(app.get('port'), () => {
  console.log(`server listening at ${app.get('port')}`)
})
