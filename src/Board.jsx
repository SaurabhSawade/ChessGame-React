
import Square from './Square'
import Piece from './Piece'


export default function Board({
  board,
  selected,
  onSquareClick,
  hoveredMoves,
  setHoveredMoves,
  turn,
  canMove
}) {
  return (
    <div className="grid grid-cols-8 w-[600px] h-[600px] border-4 border-black">
      {board.map((row, rowIdx) =>
        row.map((piece, colIdx) => {
          const isSelected = selected && selected.row === rowIdx && selected.col === colIdx
          const black = (rowIdx + colIdx) % 2 === 1
          const isHighlighted = hoveredMoves.some(
            (move) => move.row === rowIdx && move.col === colIdx
          )

          return (
            <Square
              key={`${rowIdx}-${colIdx}`}
              black={black}
              selected={isSelected}
              highlighted={isHighlighted}
              onClick={() => onSquareClick(rowIdx, colIdx)}
              onMouseEnter={() => {
                if (piece && piece.color === turn) {
                  const moves = []
                  for (let r = 0; r < 8; r++) {
                    for (let c = 0; c < 8; c++) {
                      if (
                        canMove(
                          board,
                          { row: rowIdx, col: colIdx },
                          { row: r, col: c },
                          turn,
                          true
                        )
                      ) {
                        moves.push({ row: r, col: c })
                      }
                    }
                  }
                  setHoveredMoves(moves)
                }
              }}
              onMouseLeave={() => setHoveredMoves([])}
            >
              {piece && <Piece piece={piece} />}
            </Square>
          )
        })
      )}
    </div>
  )
}