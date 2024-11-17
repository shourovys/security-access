// PageNumberButton.tsx
import classNames from 'classnames'
import React from 'react'

interface PageNumberButtonProps {
  pageNumber: number
  currentPage: number
  onClick: (pageNumber: number) => void
}

const PageNumberButton: React.FC<PageNumberButtonProps> = ({
  pageNumber,
  currentPage,
  onClick,
}) => {
  return (
    <button
      onClick={() => onClick(pageNumber)}
      className={classNames(
        'relative inline-flex items-center p-1 min-w-[30px] h-[30px] justify-center text-sm font-medium text-gray-700 ',
        currentPage === pageNumber
          ? 'text-paginationActivePageText bg-paginationActivePageBg hover:bg-paginationHoveBg'
          : 'bg-white hover:text-paginationHoverText hover:bg-paginationHoverBg border border-gray-300 hover:border-paginationHoverBg'
      )}
    >
      {pageNumber}
    </button>
  )
}

export default PageNumberButton
