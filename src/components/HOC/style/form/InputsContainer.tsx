interface IProps {
  children: JSX.Element | JSX.Element[]
}

function InputsContainer({ children }: IProps) {
  return <div className="w-full space-y-3">{children}</div>
}

export default InputsContainer
