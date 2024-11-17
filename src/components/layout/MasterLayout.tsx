// eslint-disable-next-line import/no-extraneous-dependencies
import useLocalStorage from '../../hooks/useLocalStorage'
import useSWRGlobalState from '../../hooks/useSWRGlobalState'
import Navbar from './Navbar'
import TopAndSideMenu from './TopAndSideMenu'

interface IMasterLayoutProps {
  children: JSX.Element | JSX.Element[]
}

function MasterLayout({ children }: IMasterLayoutProps): JSX.Element {
  const [isSidebarShowing, setIsSideBarShowing] = useLocalStorage<boolean>(
    'IS_SIDE_MENU_SHOWING',
    true
  )
  const [, setSideMenuStatus] = useSWRGlobalState<'open' | 'close' | null>('SIDE_MENU_STATUS', null)

  const toggleSidebar = (isShowing: boolean) => {
    setIsSideBarShowing(isShowing)
    setSideMenuStatus(isShowing ? 'open' : 'close')
  }

  return (
    <div className="flex flex-col h-full min-h-screen transition-all duration-500 ease-in-out bg-gray-bg">
      <div className="h-[48px] md:h-[56px]">
        <div className="fixed top-0 left-0 right-0 z-50 bg-gray-bg">
          <Navbar />
        </div>
      </div>
      <TopAndSideMenu>{children}</TopAndSideMenu>
      {/* <div className="flex flex-col h-full grow md:flex-row">
        <div className="top-0 left-0 z-40 hidden md:h-screen md:fixed md:block">
          <Sidebar
            isSidebarShowing={isSidebarShowing}
            toggleSidebar={() => toggleSidebar(!isSidebarShowing)}
          />
        </div>
        <main
          className={classNames(
            'relative flex-1 pb-6 h-full md:pb-8 focus:outline-none overflow-x-hidden min-h-[calc(100vh-56px)] no-scrollbar duration-300',
            isSidebarShowing ? 'md:ml-52' : 'md:ml-12'
          )}
        >
          <div className="h-full mx-auto md:px-5">{children}</div>
        </main>
      </div> */}
    </div>
  )
}

export default MasterLayout
