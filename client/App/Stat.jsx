import React from 'react'

export default function Stat({ title, score }) {
  return (
    <div className="stat-cell">
      <div className="title">{title}</div>
      <div className="score">{score}</div>
    </div>
  )
}
