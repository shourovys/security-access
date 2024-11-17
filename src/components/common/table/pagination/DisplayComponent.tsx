// DisplayComponent.tsx
import React from 'react'
import t from '../../../../utils/translator'

interface DisplayComponentProps {
  from: number
  to: number
  totalRows: number
}

const DisplayComponent: React.FC<DisplayComponentProps> = ({ from, to, totalRows }) => {
  return (
    <div>
      <p className="text-sm text-gray-700">
        {t`Showing`} <span className="font-medium">{to}</span> {t`to`}{' '}
        <span className="font-medium">{from}</span> {t`of`}{' '}
        <span className="font-medium">{totalRows}</span> {t`results`}
      </p>
    </div>
  )
}

export default DisplayComponent
