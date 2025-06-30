

import React from 'react'
import Square from './Square'
import Piece from './Piece'

export default function Board({ board, selected, onSquareClick }) {
  return (
    <div className="grid grid-cols-8 w-[600px] h-[600px] border-4 border-black">
      {board.map((row, rowIdx) =>
        row.map((piece, colIdx) => {
          const isSelected = selected && selected.row === rowIdx && selected.col === colIdx
          const black = (rowIdx + colIdx) % 2 === 1
          return (
            <Square
              key={`${rowIdx}-${colIdx}`}
              black={black}
              selected={isSelected}
              onClick={() => onSquareClick(rowIdx, colIdx)}
            >
              {piece && <Piece piece={piece} />}
            </Square>
          )
        })
      )}
    </div>
  )
}