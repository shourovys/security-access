import classNames from 'classnames'

interface PageButtonProps {
  pageNumber: number | string
  currentPage: number
  handleNumberPaginate: (pageNumber: number) => void
}

function PageButton({ pageNumber, currentPage, handleNumberPaginate }: PageButtonProps) {
  return (
    <button
      key={pageNumber}
      aria-current="page"
      onClick={() => handleNumberPaginate(pageNumber as number)}
      className={classNames(
        'relative z-10 inline-flex items-center justify-center w-10 py-2 text-sm font-medium border rounded-md cursor-pointer focus:z-20',
        pageNumber === currentPage
          ? 'bg-indigo-50 text-primary border-primary'
          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
      )}
    >
      {pageNumber}
    </button>
  )
}

export default PageButton
