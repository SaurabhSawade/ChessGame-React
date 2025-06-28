
import React from 'react'
export default function Piece({ piece }) {
  const { type, color } = piece
  const pieceImg = `/assets/${type}_${color}.png`
  return (
    <img
      src={pieceImg}
      alt={`${color} ${type}`}
      className="w-[70%] h-[70%] select-none pointer-events-none"
      style={{ objectFit: 'contain' }}
    />
  )
}