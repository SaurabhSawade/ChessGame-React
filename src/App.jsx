import React, { useState,useEffect, useRef } from 'react'
import Board from './Board'

// Helper: deep clone board
function cloneBoard(board) {
  return board.map(row => row.map(cell => (cell ? { ...cell } : null)))
}

// Find the king's position for a color
function findKing(board, color) {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col]
      if (piece && piece.type === 'k' && piece.color === color) {
        return { row, col }
      }
    }
  }
  return null
}

// Check if a square is attacked by the opponent
function isSquareAttacked(board, square, attackerColor, enPassant) {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col]
      if (piece && piece.color === attackerColor) {
        if (canMove(board, { row, col }, square, attackerColor, true, enPassant)) {
          return true
        }
      }
    }
  }
  return false
}

// Main move logic, with support for castling and en passant
function canMove(board, from, to, turn, ignoreCheck = false, enPassant = null, castlingRights = null) {
  const piece = board[from.row][from.col]
  if (!piece || piece.color !== turn) return false
  const target = board[to.row][to.col]
  if (target && target.color === turn) return false

  const dr = to.row - from.row
  const dc = to.col - from.col

  // En passant
  if (
    piece.type === 'p' &&
    enPassant &&
    to.row === enPassant.row &&
    to.col === enPassant.col &&
    Math.abs(dc) === 1 &&
    ((piece.color === 'w' && dr === -1) || (piece.color === 'b' && dr === 1))
  ) {
    return true
  }

  switch (piece.type) {
    case 'p': { // Pawn
      const dir = piece.color === 'w' ? -1 : 1
      // Move forward
      if (dc === 0 && !target) {
        if (dr === dir) return true
        // Double move from start
        if (
          (piece.color === 'w' && from.row === 6 || piece.color === 'b' && from.row === 1) &&
          dr === 2 * dir &&
          !board[from.row + dir][from.col]
        ) {
          return true
        }
      }
      // Capture
      if (Math.abs(dc) === 1 && dr === dir && target && target.color !== piece.color) {
        return true
      }
      // En passant handled above
      return false
    }
    case 'r': { // Rook
      if (dr !== 0 && dc !== 0) return false
      const stepR = dr === 0 ? 0 : dr / Math.abs(dr)
      const stepC = dc === 0 ? 0 : dc / Math.abs(dc)
      let r = from.row + stepR, c = from.col + stepC
      while (r !== to.row || c !== to.col) {
        if (board[r][c]) return false
        r += stepR
        c += stepC
      }
      return true
    }
    case 'n': // Knight
      return (Math.abs(dr) === 2 && Math.abs(dc) === 1) || (Math.abs(dr) === 1 && Math.abs(dc) === 2)
    case 'b': { // Bishop
      if (Math.abs(dr) !== Math.abs(dc)) return false
      const stepR = dr / Math.abs(dr)
      const stepC = dc / Math.abs(dc)
      let r = from.row + stepR, c = from.col + stepC
      while (r !== to.row && c !== to.col) {
        if (board[r][c]) return false
        r += stepR
        c += stepC
      }
      return true
    }
    case 'q': { // Queen
      if (dr === 0 || dc === 0) {
        // Rook-like
        const stepR = dr === 0 ? 0 : dr / Math.abs(dr)
        const stepC = dc === 0 ? 0 : dc / Math.abs(dc)
        let r = from.row + stepR, c = from.col + stepC
        while (r !== to.row || c !== to.col) {
          if (board[r][c]) return false
          r += stepR
          c += stepC
        }
        return true
      }
      if (Math.abs(dr) === Math.abs(dc)) {
        // Bishop-like
        const stepR = dr / Math.abs(dr)
        const stepC = dc / Math.abs(dc)
        let r = from.row + stepR, c = from.col + stepC
        while (r !== to.row && c !== to.col) {
          if (board[r][c]) return false
          r += stepR
          c += stepC
        }
        return true
      }
      return false
    }
    case 'k': { // King
      if (Math.abs(dr) <= 1 && Math.abs(dc) <= 1) {
        // Can't move into check (unless ignoreCheck is true)
        if (ignoreCheck) return true
        const tempBoard = cloneBoard(board)
        tempBoard[to.row][to.col] = piece
        tempBoard[from.row][from.col] = null
        if (isSquareAttacked(tempBoard, to, turn === 'w' ? 'b' : 'w')) return false
        return true
      }
      // Castling
      if (castlingRights && dr === 0 && Math.abs(dc) === 2) {
        if (piece.hasMoved) return false
        // King-side
        if (dc === 2) {
          if (!castlingRights[turn].kingside) return false
          if (board[from.row][from.col + 1] || board[from.row][from.col + 2]) return false
          // Can't castle through or into check
          if (
            !ignoreCheck &&
            (isSquareAttacked(board, { row: from.row, col: from.col }, turn === 'w' ? 'b' : 'w') ||
              isSquareAttacked(board, { row: from.row, col: from.col + 1 }, turn === 'w' ? 'b' : 'w') ||
              isSquareAttacked(board, { row: from.row, col: from.col + 2 }, turn === 'w' ? 'b' : 'w'))
          )
            return false
          const rook = board[from.row][from.col + 3]
          if (!rook || rook.type !== 'r' || rook.color !== turn || rook.hasMoved) return false
          return true
        }
        // Queen-side
        if (dc === -2) {
          if (!castlingRights[turn].queenside) return false
          if (
            board[from.row][from.col - 1] ||
            board[from.row][from.col - 2] ||
            board[from.row][from.col - 3]
          )
            return false
          if (
            !ignoreCheck &&
            (isSquareAttacked(board, { row: from.row, col: from.col }, turn === 'w' ? 'b' : 'w') ||
              isSquareAttacked(board, { row: from.row, col: from.col - 1 }, turn === 'w' ? 'b' : 'w') ||
              isSquareAttacked(board, { row: from.row, col: from.col - 2 }, turn === 'w' ? 'b' : 'w'))
          )
            return false
          const rook = board[from.row][from.col - 4]
          if (!rook || rook.type !== 'r' || rook.color !== turn || rook.hasMoved) return false
          return true
        }
      }
      return false
    }
    default:
      return false
  }
}

// Initial board setup with hasMoved for castling
function getInitialBoard() {
  return [
    [
      { type: 'r', color: 'b', hasMoved: false }, { type: 'n', color: 'b' }, { type: 'b', color: 'b' }, { type: 'q', color: 'b' },
      { type: 'k', color: 'b', hasMoved: false }, { type: 'b', color: 'b' }, { type: 'n', color: 'b' }, { type: 'r', color: 'b', hasMoved: false }
    ],
    Array(8).fill({ type: 'p', color: 'b' }),
    ...Array(4).fill(Array(8).fill(null)),
    Array(8).fill({ type: 'p', color: 'w' }),
    [
      { type: 'r', color: 'w', hasMoved: false }, { type: 'n', color: 'w' }, { type: 'b', color: 'w' }, { type: 'q', color: 'w' },
      { type: 'k', color: 'w', hasMoved: false }, { type: 'b', color: 'w' }, { type: 'n', color: 'w' }, { type: 'r', color: 'w', hasMoved: false }
    ]
  ]
}

export default function App() {
  const [board, setBoard] = useState(getInitialBoard())
  const [selected, setSelected] = useState(null)
  const [turn, setTurn] = useState('w')
  const [promotion, setPromotion] = useState(null)
  const [enPassant, setEnPassant] = useState(null)
  const [castlingRights, setCastlingRights] = useState({
    w: { kingside: true, queenside: true },
    b: { kingside: true, queenside: true }
  })
  const [status, setStatus] = useState('')
  const [gameOver, setGameOver] = useState(false)
  const [whiteTime, setWhiteTime] = useState(600); // 10 minutes in seconds
  const [blackTime, setBlackTime] = useState(600);
  const timerRef = useRef();

  const [hoveredMoves, setHoveredMoves] = useState([]);


  //timer logic
    useEffect(() => {
    if (gameOver || promotion) {
      clearInterval(timerRef.current)
      return
    }
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      if (turn === 'w') {
        setWhiteTime(t => (t > 0 ? t - 1 : 0))
      } else {
        setBlackTime(t => (t > 0 ? t - 1 : 0))
      }
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [turn, gameOver, promotion])

  useEffect(() => {
    if (whiteTime === 0 || blackTime === 0) {
      setGameOver(true)
      setStatus(whiteTime === 0 ? 'Black wins on time!' : 'White wins on time!')
      clearInterval(timerRef.current)
    }
  }, [whiteTime, blackTime])

    function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  // Check/checkmate/stalemate detection
  function isKingInCheck(board, color, enPassant) {
    const kingPos = findKing(board, color)
    if (!kingPos) return false
    return isSquareAttacked(board, kingPos, color === 'w' ? 'b' : 'w', enPassant)
  }

  function hasLegalMoves(board, color, enPassant, castlingRights) {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c]
        if (piece && piece.color === color) {
          for (let tr = 0; tr < 8; tr++) {
            for (let tc = 0; tc < 8; tc++) {
              if (
                (r !== tr || c !== tc) &&
                canMove(board, { row: r, col: c }, { row: tr, col: tc }, color, false, enPassant, castlingRights)
              ) {
                // Simulate move
                const tempBoard = cloneBoard(board)
                tempBoard[tr][tc] = { ...piece }
                tempBoard[r][c] = null
                if (piece.type === 'k') tempBoard[tr][tc].hasMoved = true
                if (!isKingInCheck(tempBoard, color, enPassant)) return true
              }
            }
          }
        }
      }
    }
    return false
  }

  function handleSquareClick(row, col) {
  if (gameOver) return
  const piece = board[row][col]
  if (promotion) return // Block moves during promotion

  if (selected) {
    if (
      (row !== selected.row || col !== selected.col) &&
      canMove(board, selected, { row, col }, turn, false, enPassant, castlingRights)
    ) {
      const movingPiece = board[selected.row][selected.col]
      let newBoard = cloneBoard(board)
      let newEnPassant = null
      let newCastlingRights = JSON.parse(JSON.stringify(castlingRights))

      // Pawn promotion
      if (
        movingPiece.type === 'p' &&
        ((movingPiece.color === 'w' && row === 0) || (movingPiece.color === 'b' && row === 7))
      ) {
        // Simulate promotion to queen for legality check
        newBoard[row][col] = { type: 'q', color: movingPiece.color }
        newBoard[selected.row][selected.col] = null
        if (isKingInCheck(newBoard, turn, enPassant)) {
          // Illegal: leaves king in check
          setSelected(null)
          return
        }
        setPromotion({ from: selected, to: { row, col }, color: movingPiece.color })
        return
      }

      // En passant capture
      if (
        movingPiece.type === 'p' &&
        enPassant &&
        row === enPassant.row &&
        col === enPassant.col
      ) {
        newBoard[selected.row][col] = null // Remove captured pawn
      }

      // Set en passant square
      if (
        movingPiece.type === 'p' &&
        Math.abs(row - selected.row) === 2
      ) {
        newEnPassant = {
          row: (row + selected.row) / 2,
          col
        }
      }

      // Castling move
      if (movingPiece.type === 'k' && Math.abs(col - selected.col) === 2) {
        // King-side
        if (col > selected.col) {
          newBoard[row][col - 1] = newBoard[row][7]
          newBoard[row][7] = null
          newBoard[row][col - 1].hasMoved = true
        } else {
          // Queen-side
          newBoard[row][col + 1] = newBoard[row][0]
          newBoard[row][0] = null
          newBoard[row][col + 1].hasMoved = true
        }
      }

      // Update hasMoved for king/rook
      if (movingPiece.type === 'k') {
        newBoard[selected.row][selected.col] = { ...movingPiece, hasMoved: true }
        newCastlingRights[turn].kingside = false
        newCastlingRights[turn].queenside = false
      }
      if (movingPiece.type === 'r') {
        if (selected.col === 0) newCastlingRights[turn].queenside = false
        if (selected.col === 7) newCastlingRights[turn].kingside = false
      }

      newBoard[row][col] = newBoard[selected.row][selected.col]
      newBoard[selected.row][selected.col] = null

      // LEGALITY CHECK: Don't allow move if it leaves your king in check
      if (isKingInCheck(newBoard, turn, newEnPassant)) {
        setSelected(null)
        return
      }

      // After move, check for check/checkmate/stalemate
      const nextTurn = turn === 'w' ? 'b' : 'w'
      let newStatus = ''
      let over = false
      if (isKingInCheck(newBoard, nextTurn, newEnPassant)) {
        if (!hasLegalMoves(newBoard, nextTurn, newEnPassant, newCastlingRights)) {
          newStatus = `Checkmate! ${turn === 'w' ? 'White' : 'Black'} wins`
          over = true
        } else {
          newStatus = 'Check!'
        }
      } else if (!hasLegalMoves(newBoard, nextTurn, newEnPassant, newCastlingRights)) {
        newStatus = 'Stalemate!'
        over = true
      }

      setBoard(newBoard)
      setSelected(null)
      setTurn(nextTurn)
      setEnPassant(newEnPassant)
      setCastlingRights(newCastlingRights)
      setStatus(newStatus)
      setGameOver(over)
    } else if (piece && piece.color === turn) {
      setSelected({ row, col })
    } else {
      setSelected(null)
    }
  } else if (piece && piece.color === turn) {
    setSelected({ row, col })
  }
}

  // Handle pawn promotion (choose piece)
  function handlePromotion(type = 'q') {
  if (!promotion) return
  const { from, to, color } = promotion
  const movingPiece = board[from.row][from.col]
  const newBoard = cloneBoard(board)
  newBoard[to.row][to.col] = { type, color }
  newBoard[from.row][from.col] = null

  // LEGALITY CHECK: Don't allow promotion if it leaves your king in check
  if (isKingInCheck(newBoard, turn, enPassant)) {
    setPromotion(null)
    setSelected(null)
    return
  }

  // After promotion, check for check/checkmate/stalemate
  const nextTurn = turn === 'w' ? 'b' : 'w'
  let newStatus = ''
  let over = false
  if (isKingInCheck(newBoard, nextTurn, enPassant)) {
    if (!hasLegalMoves(newBoard, nextTurn, enPassant, castlingRights)) {
      newStatus = `Checkmate! ${turn === 'w' ? 'White' : 'Black'} wins`
      over = true
    } else {
      newStatus = 'Check!'
    }
  } else if (!hasLegalMoves(newBoard, nextTurn, enPassant, castlingRights)) {
    newStatus = 'Stalemate!'
    over = true
  }

  setBoard(newBoard)
  setPromotion(null)
  setSelected(null)
  setTurn(nextTurn)
  setStatus(newStatus)
  setGameOver(over)
}
  function resetGame() {
    setBoard(getInitialBoard())
    setSelected(null)
    setTurn('w')
    setPromotion(null)
    setEnPassant(null)
    setCastlingRights({
      w: { kingside: true, queenside: true },
      b: { kingside: true, queenside: true }
    })
    setStatus('')
    setGameOver(false)
    setWhiteTime(600) // Reset White's timer
    setBlackTime(600) // Reset Black's timer
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-900">
      <div className="flex justify-between w-[600px] mb-4 text-white text-xl">
        <div>White: {formatTime(whiteTime)}</div>
        <div>Turn: {turn === 'w' ? 'White' : 'Black'}</div>
        <div>Black: {formatTime(blackTime)}</div>
        <button onClick={resetGame} className="bg-gray-700 px-4 py-1 rounded hover:bg-gray-600">Reset</button>
      </div>
      {/* <Board
        board={board}
        selected={selected}
        onSquareClick={handleSquareClick}
        promotion={promotion}
        onPromote={handlePromotion}
      /> */}
      <Board
          board={board}
          selected={selected}
          onSquareClick={handleSquareClick}
          promotion={promotion}
          onPromote={handlePromotion}
          hoveredMoves={hoveredMoves}
          setHoveredMoves={setHoveredMoves}
          turn={turn}
          canMove={canMove}
       />
      {promotion && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white p-4 rounded shadow flex gap-4">
            {['q', 'r', 'b', 'n'].map(type => (
              <button
                key={type}
                onClick={() => handlePromotion(type)}
                className="w-16 h-16 flex items-center justify-center border border-black rounded hover:bg-gray-200"
              >
                <img
                  src={`/assets/${type}_${promotion.color}.png`}
                  alt={type}
                  className="w-12 h-12"
                />
              </button>
            ))}
          </div>
        </div>
      )}
      {status && (
        <div className="mt-4 text-white text-lg font-bold">{status}</div>
      )}
      {gameOver && (
        <div className="mt-2 text-white text-lg font-bold">Game Over</div>
      )}
    </div>
  )
}