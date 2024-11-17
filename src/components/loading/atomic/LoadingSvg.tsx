import classNames from 'classnames'
import { TColor, TSize } from '../../../types/components/common'

interface IProps {
  size?: TSize
  color?: TColor
}

function LoadingSvg({ size = 'base', color }: IProps) {
  return (
    <svg
      className={classNames(
        size === 'small' && 'w-3.5 h-3.5',
        size === 'base' && 'w-4 h-4',
        size === 'large' && 'w-4 h-4',
        size === 'extraLarge' && 'w-10 h-10',
        color === 'primary' && 'text-btnPrimaryText',
        color === 'danger' && 'text-btnDangerText',
        color === 'info' && 'text-btnInfoText',
        color === 'apply' && 'text-applyButtonText',
        color === 'cancel' && 'text-cancelButtonText',
        'animate-spin-fast'
      )}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

export default LoadingSvg
