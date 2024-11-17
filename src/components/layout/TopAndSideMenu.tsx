import classNames from 'classnames'
import useLocalStorage from '../../hooks/useLocalStorage'
import useSWRGlobalState from '../../hooks/useSWRGlobalState'
import SideMenu from './SideMenu'

interface IProps {
  children: JSX.Element | JSX.Element[]
}

const TopAndSideMenu = ({ children }: IProps) => {
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
    <div className="">
      {/* <TopMenu
        isSidebarShowing={isSidebarShowing}
        selectedRouteGroup={selectedRouteGroup}
        setSelectedRouteGroup={setSelectedRouteGroup}
      /> */}
      <div className="flex flex-col h-full grow md:flex-row">
        <div className="top-0 left-0 z-40 hidden md:h-screen md:fixed md:block">
          <SideMenu
            isSidebarShowing={isSidebarShowing}
            toggleSidebar={() => toggleSidebar(!isSidebarShowing)}
          />
        </div>
        <main
          className={classNames(
            'relative flex-1 pb-6 h-full md:pb-8 focus:outline-none overflow-x-hidden min-h-[calc(100vh-56px)] md:min-h-[calc(100vh-98px)] no-scrollbar duration-300',
            isSidebarShowing ? 'md:ml-40 lg:ml-52' : 'md:ml-12'
          )}
        >
          <div className="h-full mx-auto md:px-5">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default TopAndSideMenu
