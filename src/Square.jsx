import React from 'react'
import './index.css';
export default function Square({ children, black }) {
  const bgColor = black ? 'bg-[#B59963]' : 'bg-[#F0D9B5]'
  return (
    <div className={`${bgColor} w-full h-19 flex items-center justify-center p-1`}>
      {children}
    </div>
  )
}