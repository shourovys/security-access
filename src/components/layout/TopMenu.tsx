import classNames from 'classnames'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import usePermittedLabelRoutes from '../../hooks/usePermittedLabelRoutes'
import { ILabeledRoute } from '../../types/routes'
import Icon from '../../utils/icons'
import t from '../../utils/translator'

interface SidebarProps {
  isSidebarShowing: boolean
  selectedRouteGroup: string
  setSelectedRouteGroup: React.Dispatch<React.SetStateAction<string>>
}

function TopMenu({ isSidebarShowing, selectedRouteGroup, setSelectedRouteGroup }: SidebarProps) {
  const permittedLabeledRoutes = usePermittedLabelRoutes()

  const { pathname } = useLocation()
  // const { favoritePages } = useFavoritePages()

  // const modifiedLabeledRoutes: ILabeledRoutes = {
  //   ...permittedLabeledRoutes,
  //   // favorite: favoritePages,
  // }

  const isCurrentRouteGroup = (routePath: string) => {
    const p = pathname.includes('?') ? pathname.split('?')[0] : pathname
    return routePath.split('/')[1] === p.split('/')[1]
  }

  return (
    <>
      <div className="h-[48.2px] hidden md:block " />
      <div className="fixed w-full  justify-end hidden md:flex md:top-[56.2px] top-[48.2px] z-30 bg-gray-bg custom_transition duration-300 ">
        <div
          className={classNames(
            'z-20 flex flex-col justify-center',
            isSidebarShowing ? 'sidebar_open_width ' : 'sidebar_close_width '
          )}
        >
          <div className="flex justify-center pt-2">
            <div className="bg-gray-200 rounded flex p-0.5  overflow-auto">
              {permittedLabeledRoutes[selectedRouteGroup].map(
                (route: ILabeledRoute, routeIndex) => (
                  <Link to={route.path()} key={routeIndex}>
                    <div key={route.path()} className="cursor-pointer">
                      <div
                        className={classNames(
                          isCurrentRouteGroup(route.path())
                            ? //Here remove (border) after bg-sidebarBtnActiveBg
                              'text-topMenuCustomBtnHoverText border-sidebarBtnActiveText bg-sidebarBtnActiveBg'
                            : 'text-gray-600 hover:text-black hover:bg-sidebarBtnHoverBg custom_transition',
                          'group flex justify-center items-center px-2 py-1.5 font-xs gap-1 rounded relative text-xs flex-grow w-max'
                        )}
                      >
                        <Icon
                          icon={route.icon}
                          className={classNames('shrink-0 outline-none group text-base ')}
                        />
                        {t`${route.label}`}
                      </div>
                    </div>
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TopMenu
