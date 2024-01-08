import express from 'express'
import { URL } from 'url'
import { Server as SocketIo } from 'socket.io'
import httpServer from 'http'
import { getBoard, setEmitter, newBoard, setMove } from './board.js'
import { newUser, getBoardId } from './users.js'

const app = express()
const http = httpServer.createServer(app)
const userConnections = {}

const io = new SocketIo(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

app.set('port', process.env.PORT || 2020)
app.use(express.static(new URL('../.../build', import.meta.url).pathname))

const emitMessage = (userId, message, payload) => {
  const socketId = userConnections[userId]
  if (socketId) io.to(socketId).emit(message, payload)
}

io.on('connection', (socket) => {
  console.log(`a user has connected on socket ${socket.id}`)
  setEmitter(emitMessage)

  socket.on('newGame', (payload) => {
    if (typeof payload === 'function') {
      const boardId = newBoard()
      const userId = newUser(boardId)
      userConnections[userId] = socket.id
      payload(userId)
    } else {
      const boardId = getBoardId(payload)
      newBoard(boardId)
      emitMessage(payload, 'game', getBoard(boardId))
    }
  })

  socket.on('getGame', (userId) => {
    const boardId = getBoardId(userId)
    userConnections[userId] = socket.id
    emitMessage(userId, 'game', getBoard(boardId))
  })

  socket.on('move', (event) => {
    const boardId = getBoardId(event.userId)
    setMove(event.userId, boardId, event.row, event.col)
    emitMessage(event.userId, 'game', getBoard(boardId))
  })

  socket.conn.on('close', () => {
    Object.entries(userConnections).forEach(([userId, connection]) => {
      if (connection === socket.id) {
        console.log(`a user ${userId} has disconnected on socket ${socket.id}`)
        delete userConnections[userId]
      }
    })
  })
})

http.listen(app.get('port'), () => {
  console.log(`server listening at ${app.get('port')}`)
})
