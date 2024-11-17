import classNames from 'classnames'
import React, { ReactNode } from 'react'
import LoadingTextWithSvg from '../loading/atomic/LoadingTextWithSvg'

interface IProps {
  title: string
  isEditMode: boolean
  isSelected: boolean
  isLoading?: boolean
  disabled?: boolean
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
  children: ReactNode
  style?: React.CSSProperties
  onMouseDown?: (event: React.MouseEvent<HTMLButtonElement>) => void
  onMouseUp?: (event: React.MouseEvent<HTMLButtonElement>) => void
  onTouchStart?: (event: React.TouchEvent<HTMLButtonElement>) => void
  onTouchEnd?: (event: React.TouchEvent<HTMLButtonElement>) => void
}

function DashboardButton({
  title,
  isEditMode,
  isSelected,
  isLoading,
  disabled,
  onClick,
  className,
  children,
  style,
  onMouseDown,
  onMouseUp,
  onTouchStart,
  onTouchEnd,
}: IProps) {
  return (
    <button
      title={title}
      className={classNames(
        'text-[10px] font-normal relative rounded-md gap-1 sm:px-1',
        'px-2 pt-1',
        `bg-btnDangerBg text-btnDangerText border-2`,
        isSelected ? ' border-primary' : '',
        isLoading ? 'cursor-wait' : disabled ? 'cursor-auto' : 'cursor-pointer',
        disabled && 'opacity-50 cursor-auto',
        !disabled && !isSelected && 'hover:shadow-all-side',
        isEditMode ? 'cursor-move' : 'cursor-pointer',
        className
      )}
      onClick={onClick}
      style={style}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      disabled={disabled && !isEditMode}
    >
      {isLoading ? <LoadingTextWithSvg size={'base'} /> : children}
    </button>
  )
}

export default DashboardButton
