type Props = {
  children: JSX.Element | JSX.Element[]
}

function Table({ children }: Props) {
  return (
    <div className="flex flex-col overflow-y-hidden">
      <div className="overflow-x-auto overflow-y-hidden sm:mx-0.5 lg:mx-0.5">
        <div className="min-w-full">
          <div className="overflow-x-auto ">
            <table className="min-w-full">{children}</table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Table
