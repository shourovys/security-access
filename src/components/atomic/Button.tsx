import classNames from 'classnames'
import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { TButtonColor, TButtonSize, TButtonType } from '../../types/components/buttons'
import LoadingTextWithSvg from '../loading/atomic/LoadingTextWithSvg'

interface IProps {
  type?: TButtonType
  size?: TButtonSize
  color?: TButtonColor
  isLoading?: boolean
  disabled?: boolean
  link?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
  children: ReactNode
  style?: React.CSSProperties
  onMouseDown?: (event: React.MouseEvent<HTMLButtonElement>) => void
  onMouseUp?: (event: React.MouseEvent<HTMLButtonElement>) => void
  onTouchStart?: (event: React.TouchEvent<HTMLButtonElement>) => void
  onTouchEnd?: (event: React.TouchEvent<HTMLButtonElement>) => void
}

function Button({
  type = 'button',
  size = 'base',
  color = 'primary',
  isLoading,
  disabled,
  link,
  onClick,
  className,
  children,
  style,
  onMouseDown,
  onMouseUp,
  onTouchStart,
  onTouchEnd,
}: IProps) {
  const buttonClassNames = classNames(
    'inline-flex items-center justify-center text-xs font-normal relative rounded-md gap-1 sm:px-1',
    size === 'small' && 'py-1 min-w-[74px]',
    size === 'base' && 'py-1 md:py-1.5  px-2 md:px-1 lg:px-2 min-w-[80px] lg:min-w-[100px] ',
    size === 'large' && 'py-1.5 md:py-2 large min-w-[80px] md:min-w-[100px]',
    (color === 'primary' || color === 'danger') &&
      `bg-btnPrimaryBg text-btnPrimaryText ${
        !disabled && 'hover:bg-btnPrimaryText hover:text-btnPrimaryBg'
      }`,
    color === 'info' &&
      `bg-btnInfoHoverBg text-btnInfoText ${
        !disabled && 'hover:bg-btnInfoText hover:text-btnInfoHoverBg'
      }`,
    // color === 'danger' &&
    //   `bg-btnDangerBg text-btnDangerText ${
    //     !disabled && 'hover:bg-btnDangerText hover:text-btnDangerBg'
    //   }`,
    color === 'apply' &&
      `bg-applyButtonBg text-applyButtonText ${
        !disabled && 'hover:bg-applyButtonText hover:text-applyButtonBg'
      }`,
    color === 'cancel' &&
      `bg-cancelButtonBg text-cancelButtonText ${
        !disabled && 'hover:bg-cancelButtonText hover:text-cancelButtonBg'
      }`,
    color === 'csv' &&
      `bg-csvBtnBg text-csvBtnText ${!disabled && 'hover:bg-csvBtnText hover:text-csvBtnBg'}`,
    isLoading ? 'cursor-wait' : disabled ? 'cursor-auto' : 'cursor-pointer',
    disabled ? 'opacity-50 cursor-auto' : 'hover:shadow-all-side',
    className
  )

  if (disabled) {
    return (
      <button
        className={buttonClassNames}
        type={type}
        style={style}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {isLoading ? <LoadingTextWithSvg size={size} /> : children}
      </button>
    )
  }

  if (link) {
    return (
      <Link to={link} className={buttonClassNames} style={style}>
        {isLoading ? <LoadingTextWithSvg size={size} /> : children}
      </Link>
    )
  }
  return (
    <button
      className={buttonClassNames}
      type={type}
      onClick={onClick}
      style={style}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {isLoading ? <LoadingTextWithSvg size={size} /> : children}
    </button>
  )
}

export default Button
