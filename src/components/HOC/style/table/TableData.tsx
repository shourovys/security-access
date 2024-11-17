import { ReactNode } from 'react'
import { TTextAlign } from '../../../../types/components/common'

interface IProps {
  align?: TTextAlign
  children: ReactNode
}

function TableData({ align = 'center', children }: IProps) {
  return (
    <td className={`text-[14px] whitespace-nowrap text-[#000000a6] text-${align}`}>{children}</td>
  )
}

export default TableData
