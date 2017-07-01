import React, { Component } from 'react'
import { react } from 'react-dom'
import Board from './Board.jsx'
import Stat from './Stat.jsx'

var socket = io()

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      board: [
        [ [], [], [] ],
        [ [], [], [] ],
        [ [], [], [] ]
      ],
      stats: [
        {title: 'computer', score: 0},
        {title: 'tie', score: 0},
        {title: 'player', score: 0}
      ],
      gameFinished: false
    }
  }

  componentDidMount () {
    const uid = localStorage.getItem('uid')
    if (uid) {
      this.setBoardListener(uid)
      this.setStatsListener(uid)
      socket.emit('getGame', uid)
    } else {
      this.createNewGame()
    }
  }

  createNewGame (uid) {
    if (uid) {
      socket.emit('newGame', uid)
    } else {
      socket.emit('newGame', (uid) => {
        localStorage.setItem('uid', uid)
        this.setBoardListener(uid)
        this.setStatsListener(uid)
        socket.emit('getGame', uid)
      })
    }
  }

  setBoardListener (uid) {
    socket.on(uid + '_game', (game) => {
      if (!game) return this.createNewGame()
      this.setState({ board: game })
    })
  }

  setStatsListener (uid) {
    socket.on(uid + '_stat', (stat) => {
      let stats = this.state.stats
      if (stat === 'computer') stats[0].score++
      if (stat === 'tie') stats[1].score++
      if (stat === 'player') stats[2].score++
      this.setState({
        stats: stats,
        gameFinished: true
      })

      // start new game in 1.5 seconds
      setTimeout(() => {
        this.createNewGame(uid)
        this.setState({ gameFinished: false })
      }, 1500)
    })
  }

  render () {
    return (
      <div id='game'>
        <div id='game-container'>
          <div id='title'>TIC-TAC-TOE</div>
          <Board status={this.state.board} gameFinished={this.state.gameFinished} socket={socket} />
          <div id='stats'>
            {this.state.stats.map((obj, index) => {
              return <Stat key={index} title={obj.title} score={obj.score} />
            })}
          </div>
        </div>
      </div>
    )
  }
}

export default App
