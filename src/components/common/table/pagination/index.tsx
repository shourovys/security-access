import React from 'react'
import useUpdateRouteQuery from '../../../../hooks/useUpdateRouteQuery'
import RowsPerPageSelector from '../RowsPerPageSelector'
import DisplayComponent from './DisplayComponent'
import PageNumberButton from './PageNumberButton'
import PaginationControls from './PaginationControls'

interface IPaginationProps {
  totalRows: number
  currentPage: number
  rowsPerPage: number
  currentPath: string
  onPageChange: (_page: number) => void
  onRowsPerPageChange?: (_rowsPerPage: number) => void
  rowsPerPageDisabled?: boolean
}

const Pagination: React.FC<IPaginationProps> = ({
  totalRows,
  currentPage,
  rowsPerPage,
  currentPath,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageDisabled,
}) => {
  const updateRouteQuery = useUpdateRouteQuery()
  const totalPages = Math.ceil(totalRows / rowsPerPage)
  const pageNumbers = Array.from(Array(totalPages).keys(), (x) => x + 1)
  console.log('🚀 ~ pageNumbers:', pageNumbers)

  let startIndex: number, endIndex: number
  if (totalPages <= 5) {
    startIndex = 0
    endIndex = totalPages - 1
  } else if (currentPage <= 3) {
    startIndex = 0
    endIndex = 4
  } else if (currentPage >= totalPages - 2) {
    startIndex = totalPages - 5
    endIndex = totalPages - 1
  } else {
    startIndex = currentPage - 3
    endIndex = currentPage + 1
  }

  const displayedPages = pageNumbers.slice(startIndex, endIndex + 1)

  // handling pagination
  const isPrevDisabled = (): boolean => currentPage <= 1
  const isNextDisabled = (): boolean => currentPage >= totalPages

  const handlePrevNextPaginate = (direction: 1 | -1) => {
    if (direction === -1 && isPrevDisabled()) {
      return
    }
    if (direction === 1 && isNextDisabled()) {
      return
    }
    updateRouteQuery({
      query: { page: currentPage + direction },
      pathName: currentPath,
    })
    onPageChange(currentPage + direction)
  }

  const handleNumberPaginate = (clickedPage: number) => {
    updateRouteQuery({
      query: { page: clickedPage },
      pathName: currentPath,
    })
    onPageChange(clickedPage)
  }

  const from = totalRows ? (currentPage - 1) * rowsPerPage + 1 : 0
  const to =
    (currentPage - 1) * rowsPerPage + rowsPerPage < totalRows
      ? (currentPage - 1) * rowsPerPage + rowsPerPage
      : totalRows

  return (
    <div className="flex items-center justify-between px-2 py-1 bg-white sm:px-6">
      <div className="flex justify-between flex-1 sm:hidden">
        <PaginationControls
          onClick={() => handlePrevNextPaginate(-1)}
          direction={-1}
          disabled={isPrevDisabled()}
        />
        <PaginationControls
          onClick={() => handlePrevNextPaginate(1)}
          direction={1}
          disabled={isNextDisabled()}
        />
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <DisplayComponent from={from} to={to} totalRows={totalRows} />
        {onRowsPerPageChange && (
          <RowsPerPageSelector
            totalRows={totalRows}
            rowsPerPage={rowsPerPage}
            currentPath={currentPath}
            onRowsPerPageChange={onRowsPerPageChange}
            disabled={rowsPerPageDisabled}
          />
        )}
        <nav
          className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          <PaginationControls
            onClick={() => handlePrevNextPaginate(-1)}
            direction={-1}
            disabled={isPrevDisabled()}
          />
          {totalPages > 5 && currentPage > 3 && (
            <>
              <PageNumberButton
                pageNumber={1}
                currentPage={currentPage}
                onClick={handleNumberPaginate}
              />
              {currentPage > 4 && (
                <span className="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium text-gray-700 bg-white border border-gray-300">
                  ...
                </span>
              )}
            </>
          )}
          {displayedPages.map((page) => (
            <PageNumberButton
              key={page}
              pageNumber={page}
              currentPage={currentPage}
              onClick={handleNumberPaginate}
            />
          ))}
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <>
              {currentPage < totalPages - 3 && (
                <span className="relative inline-flex items-center px-4 py-2 -mr-px text-sm font-medium text-gray-700 bg-white border border-gray-300">
                  ...
                </span>
              )}
              <PageNumberButton
                pageNumber={totalPages}
                currentPage={currentPage}
                onClick={handleNumberPaginate}
              />
            </>
          )}
          <PaginationControls
            onClick={() => handlePrevNextPaginate(1)}
            direction={1}
            disabled={isNextDisabled()}
          />
        </nav>
      </div>
    </div>
  )
}

export default Pagination
