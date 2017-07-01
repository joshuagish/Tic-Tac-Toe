import React, { Component } from 'react'

class Stat extends Component {
  render () {
    return (
      <div className='stat-cell'>
        <div className='title'>{this.props.title}</div>
        <div className='score'>{this.props.score}</div>
      </div>
    )
  }
}

export default Stat
