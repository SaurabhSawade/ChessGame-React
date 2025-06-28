// import React, { useEffect, useState } from 'react'
// import BoardSquare from './BoardSquare'
// import Promote from './Promote'
// import { gameSubject } from './Game'
// import './index.css';

// function Board({ board }) {
//   const [promotion, setPromotion] = useState(null)

//   useEffect(() => {
//     const subscribe = gameSubject.subscribe(({ pendingPromotion }) => {
//       setPromotion(pendingPromotion)
//     })
//     return () => subscribe.unsubscribe()
//   }, [])

//   // Render the board row by row, from top (rank 8, row 0) to bottom (rank 1, row 7)
//   return (
//     <div className="relative">
//       <div className="grid grid-cols-8 w-[600px] h-[600px] border-4 border-black">
//         {board.map((row, rowIdx) =>
//           row.map((piece, colIdx) => {
//             const position = getPosition(rowIdx, colIdx)
//             const black = (rowIdx + colIdx) % 2 === 1
//             return (
//               <BoardSquare
//                 key={`${rowIdx}-${colIdx}`}
//                 piece={piece}
//                 position={position}
//                 black={black}
//               />
//             )
//           })
//         )}
//       </div>
//       {promotion && <Promote promotion={promotion} />}
//     </div>
//   )
// }

// // row 0 = rank 8, row 7 = rank 1
// function getPosition(row, col) {
//   const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
//   return `${files[col]}${8 - row}`
// }

// export default Board


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