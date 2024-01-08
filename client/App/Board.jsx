import React from 'react'

export default function Board({ socket, gameFinished, status }) {
  const selectCell = (x, y) => {
    if (!gameFinished) {
      socket.emit('move', {
        userId: sessionStorage.getItem('userId'),
        row: y,
        col: x,
      })
    }
  }

  return (
    <div className="board">
      {status.map((row, y) => (
        <div key={y} className="board__row">
          {row.map((col, x) => (
            <button className="board__cell" key={`${x}-${y}`} onClick={() => selectCell(x, y)}>
              {status[y][x].length ? status[y][x] : ''}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}
