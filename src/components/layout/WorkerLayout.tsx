import classNames from 'classnames'
// eslint-disable-next-line import/no-extraneous-dependencies
import Navbar from './Navbar'
import NavMenu from './NavMenu'

interface IWorkerLayoutProps {
  children: JSX.Element | JSX.Element[]
}

function WorkerLayout({ children }: IWorkerLayoutProps): JSX.Element {
  return (
    <div className="flex flex-col h-full min-h-screen transition-all duration-500 ease-in-out bg-gray-bg">
      <div className="h-[48px] md:h-[56px]">
        <div className="fixed top-0 left-0 right-0 z-50 bg-gray-bg">
          <Navbar />
        </div>
      </div>
      <div className="flex flex-col grow h-full ">
        <div className="top-0 left-0 z-40 ">
          <NavMenu />
        </div>
        <main
          className={classNames(
            'relative flex-1 pb-6 h-full md:pb-8 focus:outline-none overflow-x-hidden min-h-[calc(100vh-56px)] no-scrollbar duration-300'
          )}
        >
          <div className="h-full mx-auto md:px-5">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default WorkerLayout
