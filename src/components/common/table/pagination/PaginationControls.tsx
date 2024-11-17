// PaginationControls.tsx
import classNames from 'classnames'
import React from 'react'
import Icon, { leftArrowIcon, rightArrowIcon } from '../../../../utils/icons'

interface PaginationControlsProps {
  onClick: () => void
  direction: 1 | -1
  disabled?: boolean
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  onClick,
  direction,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        'relative inline-flex items-center p-1 min-w-[30px] h-[30px] justify-center text-sm font-medium border border-gray-300',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        direction === 1 ? 'rounded-r-md' : 'rounded-l-md'
      )}
    >
      <Icon
        icon={direction === -1 ? leftArrowIcon : rightArrowIcon}
        className="w-3.5 h-3.5"
        aria-hidden="true"
      />
    </button>
  )
}

export default PaginationControls
