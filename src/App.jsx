import React, { useEffect, useState, useRef } from 'react';
import { gameSubject, initGame, resetGame } from './Game';
import Board from './Board';
import './index.css';

function App() {
  const [board, setBoard] = useState([]);
  const [isGameOver, setIsGameOver] = useState();
  const [result, setResult] = useState();
  const [turn, setTurn] = useState('w');
  const [whiteTime, setWhiteTime] = useState(600); // 10 minutes in seconds
  const [blackTime, setBlackTime] = useState(600);
  const timerRef = useRef();

  useEffect(() => {
    initGame();
    const subscribe = gameSubject.subscribe((game) => {
      setBoard(game.board);
      setIsGameOver(game.isGameOver);
      setResult(game.result);
      setTurn(game.turn);
    });
    return () => subscribe.unsubscribe();
  }, []);

  useEffect(() => {
    if (isGameOver) {
      clearInterval(timerRef.current);
      return;
    }
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (turn === 'w') {
        setWhiteTime((t) => (t > 0 ? t - 1 : 0));
      } else {
        setBlackTime((t) => (t > 0 ? t - 1 : 0));
      }
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [turn, isGameOver]);

  useEffect(() => {
    if (whiteTime === 0 || blackTime === 0) {
      clearInterval(timerRef.current);
      setIsGameOver(true);
      setResult(whiteTime === 0 ? 'Black wins on time!' : 'White wins on time!');
    }
  }, [whiteTime, blackTime]);

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-900">
      <div className="flex justify-between w-[600px] mb-4 text-white text-xl">
        <div>White: {formatTime(whiteTime)}</div>
        <div>Black: {formatTime(blackTime)}</div>
      </div>
      {isGameOver && (
        <div className="flex flex-col items-center justify-center text-white">
          <h2 className="text-lg font-bold">GAME OVER</h2>
          <button
            onClick={resetGame}
            className="mt-4 px-4 py-2 bg-neutral-700 text-white border border-white rounded-lg hover:bg-neutral-600"
          >
            NEW GAME
          </button>
        </div>
      )}
      <div className="w-[600px] h-[600px]">
        <Board board={board} turn={turn} />
      </div>
      {result && (
        <p className="text-white text-sm mt-4">{result}</p>
      )}
    </div>
  );
}

export default App;