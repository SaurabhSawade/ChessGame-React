
import React from 'react'
export default function Square({ children, black, selected, onClick }) {
  const bgColor = selected
    ? 'bg-yellow-400'
    : black
    ? 'bg-[#B59963]'
    : 'bg-[#F0D9B5]'
  return (
    <div
      className={`${bgColor} w-full h-19 flex items-center justify-center cursor-pointer`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}