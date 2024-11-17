import { ReactNode } from 'react'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import Icon, { warningIcon } from '../../../../utils/icons'

interface IProps {
  twoPart?: boolean
  sameHeight?: boolean
  errorAlert?: string | null
  children: ReactNode
}

function FormContainer({ twoPart = true, sameHeight = false, errorAlert, children }: IProps) {
  if (twoPart && sameHeight) {
    return (
      <div className="">
        {errorAlert && (
          <div
            className="relative flex items-center px-4 py-2 mx-4 mb-5 space-x-2 text-orange-700 bg-orange-100 border border-orange-400 rounded sm:mx-0"
            role="alert"
          >
            <Icon icon={warningIcon} />
            <span className="block sm:inline">{errorAlert}</span>
            {/* <span className="absolute top-0 bottom-0 right-0 px-4 py-2">
            <svg
              className="w-6 h-6 text-red-500 fill-current"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </span> */}
          </div>
        )}
        <form className="grid gap-5 lg:grid-cols-2">{children}</form>
      </div>
    )
  }
  if (twoPart) {
    return (
      <div className="">
        {errorAlert && (
          <div
            className="relative flex items-center px-4 py-2 mx-4 mb-5 space-x-2 text-orange-700 bg-orange-100 border border-orange-400 rounded sm:mx-0"
            role="alert"
          >
            <Icon icon={warningIcon} />
            <span className="block sm:inline">{errorAlert}</span>
          </div>
        )}
        <ResponsiveMasonry columnsCountBreakPoints={{ 900: 1, 1180: 2 }}>
          <Masonry gutter="20px">{children} </Masonry>
        </ResponsiveMasonry>
      </div>
    )
  }
  return (
    <div className="">
      {errorAlert && (
        <div
          className="relative flex items-center px-4 py-2 mx-4 mb-5 space-x-2 text-orange-700 bg-orange-100 border border-orange-400 rounded sm:mx-0"
          role="alert"
        >
          <Icon icon={warningIcon} />
          <span className="block sm:inline">{errorAlert}</span>
        </div>
      )}
      <div className="space-y-5">{children}</div>
    </div>
  )
}

export default FormContainer
