interface IProps {
  progress: number
  backgroundColor?: string
  foregroundColor?: string
  width?: number
}

function ProgressBar({
  progress,
  backgroundColor = 'bg-gray-500',
  foregroundColor = 'bg-primary',
  width,
}: IProps) {
  const percentage = `${progress}%`

  return (
    <div className={`relative h-2.5 rounded-full ${backgroundColor}`} style={{ width: width }}>
      <div
        className={`absolute inset-y-0 left-0 ${foregroundColor} rounded-full`}
        style={{ width: percentage }}
      />
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white pt-[1px]">
        {percentage}
      </span>
    </div>
  )
}

export default ProgressBar
