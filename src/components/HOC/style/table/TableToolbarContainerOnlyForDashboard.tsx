import classNames from 'classnames'
import React from 'react'

interface IProps {
  padding?: boolean
  getSetOpenModalFC?: (setOpenModal: React.Dispatch<React.SetStateAction<boolean>>) => void
  children: JSX.Element | JSX.Element[]
}

function TableToolbarContainerOnlyForDashboard({ padding = true, children }: IProps) {
  return (
    <div className={classNames('space-y-2 hidden md:block', padding && 'pb-3 md:pb-4')}>
      {children}
    </div>
  )
}

export default TableToolbarContainerOnlyForDashboard
