import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import Board from './Board'
import Stat from './Stat'

const socket = io('http://localhost:2020')

const DEFAULT_BOARD = [
  [[], [], []],
  [[], [], []],
  [[], [], []],
]

const DEFAULT_STATS = [
  { title: 'computer', score: 0 },
  { title: 'tie', score: 0 },
  { title: 'player', score: 0 },
]

export default function App() {
  const [board, setBoard] = useState(DEFAULT_BOARD)
  const [stats, setStats] = useState(DEFAULT_STATS)
  const [gameFinished, setGameFinished] = useState(false)

  useEffect(() => {
    setStatsListener()
    setBoardListener()
    const userId = sessionStorage.getItem('userId')
    if (userId) {
      socket.emit('getGame', userId)
    } else {
      createNewGame()
    }
  }, [])

  const createNewGame = (userId) => {
    if (userId) {
      socket.emit('newGame', userId)
    } else {
      socket.emit('newGame', (userId) => {
        sessionStorage.setItem('userId', userId)
        socket.emit('getGame', userId)
      })
    }
  }

  const setBoardListener = () => {
    socket.on('game', (game) => {
      if (!game) return createNewGame()
      setBoard(game)
    })
  }

  const setStatsListener = () => {
    socket.on('stat', (stat) => {
      if (stat === 'computer') stats[0].score++
      if (stat === 'tie') stats[1].score++
      if (stat === 'player') stats[2].score++
      setGameFinished(true)
      setStats(stats)

      // start new game in 1.5 seconds
      setTimeout(() => {
        createNewGame()
        setGameFinished(false)
      }, 1500)
    })
  }

  return (
    <div id="game">
      <div id="game__container">
        <div id="title">TIC-TAC-TOE</div>
        <Board status={board} gameFinished={gameFinished} socket={socket} />
        <div id="stats">
          {stats.map((obj, index) => {
            return <Stat key={index} title={obj.title} score={obj.score} />
          })}
        </div>
      </div>
    </div>
  )
}
