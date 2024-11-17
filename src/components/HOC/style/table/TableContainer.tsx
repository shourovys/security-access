import classNames from 'classnames'
import { forwardRef, ReactNode } from 'react'

interface IProps {
  padding?: boolean
  shadow?: boolean
  children: ReactNode
}

const TableContainer = forwardRef<HTMLDivElement, IProps>(
  ({ padding = true, shadow = true, children }, ref) => {
    return (
      <div
        ref={ref}
        className={classNames('bg-white rounded-md', shadow && 'shadow', padding && 'p-4 md:p-3')}
      >
        {children}
      </div>
    )
  }
)

export default TableContainer
