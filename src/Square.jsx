export default function Square({ children, black, selected, highlighted, onClick, onMouseEnter, onMouseLeave }) {
  let bgColor = black ? 'bg-[#B59963]' : 'bg-[#F0D9B5]'
  if (selected) bgColor = 'bg-yellow-400'
  else if (highlighted) bgColor = 'bg-green-100' // Highlight possible move

  return (
    <div
      className={`${bgColor} w-full h-19 flex items-center justify-center cursor-pointer`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  )
}