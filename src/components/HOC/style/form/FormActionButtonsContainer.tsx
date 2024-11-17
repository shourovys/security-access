import classNames from 'classnames'

interface IProps {
  padding?: boolean
  allowsShow?: boolean
  children: JSX.Element | JSX.Element[]
}

function FormActionButtonsContainer({ padding = true, allowsShow, children }: IProps) {
  return (
    <>
      {allowsShow ? (
        <div
          className={classNames(
            'flex items-center justify-center gap-4',
            padding && 'py-4 md:py-6'
          )}
        >
          {children}
        </div>
      ) : (
        <div className="w-full h-10 border-t-4 md:h-12 border-gray-50 sm:hidden">
          <div
            className={classNames(
              'fixed bottom-0 flex items-center justify-center w-full gap-4 bg-gray-bg ',
              padding && 'pt-2 pb-4 md:pt-4 md:mb-4'
            )}
          >
            {children}
          </div>
        </div>
      )}
    </>
  )
}

export default FormActionButtonsContainer
