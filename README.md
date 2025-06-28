# React Chess Game

A web-based chess game built with React and Tailwind CSS.  
Features click-to-move, full chess rules (including castling, en passant, check, checkmate, stalemate), pawn promotion, and a chess clock for both players.

## Deploy Link
[Live Demo](https://chess-game-react-rho.vercel.app)

## Features

- Interactive chessboard with click-to-move
- Full chess rules: legal move validation, check, checkmate, stalemate, castling, en passant, pawn promotion
- Game timer for both players (default: 10 minutes each)
- Game over detection (checkmate, stalemate, timeout)
- Responsive and modern UI

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/chess-game.git
    cd chess-game
    ```

2. Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

3. Start the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
  ├── App.jsx
  ├── Board.jsx
  ├── Square.jsx
  ├── Piece.jsx
  ├── main.jsx
  ├── index.css
  └── assets/
        └── [piece images]
```

## Customization

- **Change timer:** Edit the `whiteTime` and `blackTime` initial values in `App.jsx`.
- **Piece images:** Place your PNGs in `public/assets/` as `k_w.png`, `q_b.png`, etc.

## License

MIT