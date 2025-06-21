import React, { useEffect, useState } from 'react'
import Square from './Square'
import Piece from './Piece'
import { useDrop } from 'react-dnd'
import { handleMove } from './Game'
import { gameSubject } from './Game'
import Promote from './Promote'
import './index.css';

export default function BoardSquare({ piece, black, position }) {
  const [promotion, setPromotion] = useState(null)

  const [, drop] = useDrop({
    accept: 'piece',
    drop: (item) => {
      const [fromPosition] = item.id.split('_')
      handleMove(fromPosition, position)
    },
  })

  useEffect(() => {
    const subscribe = gameSubject.subscribe(({ pendingPromotion }) => {
      if (pendingPromotion && pendingPromotion.to === position) {
        setPromotion(pendingPromotion)
      } else {
        setPromotion(null)
      }
    })

    return () => subscribe.unsubscribe()
  }, [position])

  return (
    <div ref={drop} className="w-full h-full flex items-center justify-center">
      <Square black={black}>
        {promotion ? (
          <Promote promotion={promotion} />
        ) : piece ? (
          <Piece piece={piece} position={position} />
        ) : null}
      </Square>
    </div>
  )
}