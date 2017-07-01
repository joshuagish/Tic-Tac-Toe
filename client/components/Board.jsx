import React, { Component } from 'react'

class Board extends Component {

  selectCell (x, y) {
    if (!this.props.gameFinished) {
      this.props.socket.emit('move', {
        uid: localStorage.getItem('uid'),
        row: y,
        col: x
      })
    }
  }

  render () {
    let status = this.props.status

    return (
      <div className='board'>
        {status.map((row, y) => {
          return <div key={y} className='board-row'>
            {row.map((column, x) => {
              return <div className='board-cell' key={x + '' + y} onClick={() => this.selectCell(x, y)}>{
                status[y][x].length ? status[y][x] : ''
              }</div>
            })}
          </div>
        })}
      </div>
    )
  }
}

export default Board
