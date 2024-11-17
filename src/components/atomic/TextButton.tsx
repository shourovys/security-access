import classNames from 'classnames'
import React from 'react'
import { Link } from 'react-router-dom'
import { TButtonColor, TButtonType } from '../../types/components/buttons'
import Icon, { TIcon } from '../../utils/icons'
import { errorToast } from '../../utils/toast'
import LoadingSvg from '../loading/atomic/LoadingSvg'

interface IInputProps {
  type?: TButtonType
  icon?: TIcon
  color?: TButtonColor
  iconClass?: string
  isLoading?: boolean
  disabled?: boolean
  disabledText?: string
  link?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  children: string
}

function TextButton({
  type = 'button',
  icon,
  color,
  iconClass,
  isLoading,
  disabled,
  disabledText,
  link,
  onClick,
  children,
}: IInputProps) {
  const buttonIcon = isLoading ? (
    <div
      className={classNames(
        color === 'primary' && 'text-textBtnPrimaryText',
        // color === 'danger' && 'text-textBtnDangerText',
        color === 'info' && 'text-textBtnInfoText',
        color === 'apply' && 'text-applyTextButtonText',
        color === 'cancel' && 'text-cancelTextButtonText'
      )}
    >
      <LoadingSvg size="small" />
    </div>
  ) : (
    icon && (
      <Icon
        icon={icon}
        className={classNames(
          color === 'primary' && 'text-btnPrimaryBg',
          color === 'danger' && 'text-btnDangerBg',
          color === 'info' && 'text-btnInfoBg',
          color === 'apply' && 'text-applyButtonBg',
          color === 'cancel' && 'text-cancelButtonBg',
          iconClass
        )}
      />
    )
  )

  if (disabled) {
    return (
      <button
        className={classNames(
          'flex items-center w-full gap-2 px-4 py-1.5 text-sm',
          isLoading ? 'text-gray-400' : 'text-black',
          disabled && 'opacity-50'
        )}
        type={type}
        onClick={() => errorToast(disabledText)}
      >
        {buttonIcon}
        {children}
      </button>
    )
  }

  if (link) {
    return (
      <Link
        to={link}
        className={classNames(
          'flex items-center w-full gap-2 px-4 py-1.5 text-sm',
          isLoading ? 'text-gray-400' : 'text-black'
        )}
      >
        {buttonIcon}
        {children}
      </Link>
    )
  }
  return (
    <button
      className={classNames(
        'flex items-center w-full gap-2 px-4 py-1.5 text-sm',
        isLoading ? 'text-gray-400' : 'text-black'
      )}
      type={type}
      onClick={onClick}
    >
      {buttonIcon}
      {children}
    </button>
  )
}

export default TextButton
