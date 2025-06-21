import { move } from './Game' // <-- Add this import
import './index.css';

export default function Promote({ promotion: { from, to, color } }) {
  const promotionPieces = ['r', 'n', 'b', 'q']

  return (
    <div className="flex justify-center gap-4 p-4 bg-gray-100 rounded-md">
      {promotionPieces.map((p, i) => {
        const pieceImg = `/assets/${p}_${color}.png`

        return (
          <div key={i}>
            <Square black={i % 2 === 0}>
              <div
                className="flex items-center justify-center w-full h-full cursor-pointer"
                onClick={() => move(from, to, p)}
              >
                <img
                  src={pieceImg}
                  alt={`${p} ${color}`}
                  className="max-w-[70%] max-h-[70%]"
                />
              </div>
            </Square>
          </div>
        )
      })}
    </div>
  )
}