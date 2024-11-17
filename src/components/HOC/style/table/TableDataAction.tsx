import classNames from 'classnames'
import { ReactNode } from 'react'

interface IProps {
  selected?: boolean
  children: ReactNode
}

function TableDataAction({ selected, children }: IProps) {
  return (
    <td
      className={classNames(
        'custom_transition sticky left-0 bg-white px-3 text-sm text-center text-gray-700 whitespace-nowrap group-hover:bg-gray-100 ',
        selected && 'bg-blue-50'
      )}
    >
      <div className="flex items-center justify-start">
        <button
          onClick={(event) => {
            event.stopPropagation()
          }}
        >
          {children}
        </button>
      </div>
    </td>
  )
}

export default TableDataAction
