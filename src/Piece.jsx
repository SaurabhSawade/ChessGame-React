// // import React from 'react'
// // import { useDrag, DragPreviewImage } from 'react-dnd'

// import k_w from './assets/k_w.png'
// import q_w from './assets/q_w.png'
// import r_w from './assets/r_w.png'
// import n_w from './assets/n_w.png'
// import b_w from './assets/b_w.png'
// import p_w from './assets/p_w.png'
// import k_b from './assets/k_b.png'
// import q_b from './assets/q_b.png'
// import r_b from './assets/r_b.png'
// import n_b from './assets/n_b.png'
// import b_b from './assets/b_b.png'
// import p_b from './assets/p_b.png'

// const pieceImages = {
//   k_w,
//   q_w,
//   r_w,
//   n_w,
//   b_w,
//   p_w,
//   k_b,
//   q_b,
//   r_b,
//   n_b,
//   b_b,
//   p_b,
// }

// export default function Piece({ piece: { type, color }, position }) {
//   const pieceKey = `${type}_${color}`
//   const pieceImg = pieceImages[pieceKey]

//   const [{ isDragging }, drag, preview] = useDrag(() => ({
//     type: 'piece',
//     item: { id: `${position}_${type}_${color}` },
//     collect: (monitor) => ({
//       isDragging: !!monitor.isDragging(),
//     }),
//   }))

//   return (
//     <>
//       <DragPreviewImage connect={preview} src={pieceImg} />
//       <div
//         className="piece-container"
//         ref={drag}
//         style={{ opacity: isDragging ? 0 : 1 }}
//       >
//         <img src={pieceImg} alt={`${type} ${color}`} className="piece" />
//       </div>
//     </>
//   )
// }
import React from 'react'
import { useDrag, DragPreviewImage } from 'react-dnd'
import './index.css';

export default function Piece({ piece: { type, color }, position }) {
  const [{ isDragging }, drag, preview] = useDrag({
    type: 'piece',
    item: { id: `${position}_${type}_${color}` },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  const pieceImg = `/assets/${type}_${color}.png` // <-- No require(), must be in public/assets/

  return (
    <>
      <DragPreviewImage connect={preview} src={pieceImg} />
      <div
        ref={drag}
        style={{ opacity: isDragging ? 0 : 1 }}
        className="cursor-grab w-full h-full flex items-center justify-center"
      >
        <img src={pieceImg}
         alt={`${color} ${type}`} 
         className="w-[70%] h-[70%] p-1 select-none pointer-events-none"
         style={{ objectFit: 'contain' }}
        />
      </div>
    </>
  )
}