import { ReactNode } from 'react'

interface IProps {
  children: ReactNode
}

function FormCardInputTwoPart({ children }: IProps) {
  return <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">{children}</div>
}

export default FormCardInputTwoPart
