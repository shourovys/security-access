import classNames from 'classnames'
import { Link, useLocation } from 'react-router-dom'
import usePermittedLabelRoutes from '../../hooks/usePermittedLabelRoutes'
import { ILabeledRoute } from '../../types/routes'
import capitalize from '../../utils/capitalize'
import Icon from '../../utils/icons'
import menuIcons from '../../utils/menuIcons'
import t from '../../utils/translator'

interface IProps {
  close: () => void
}

function NavbarMenu({ close }: IProps) {
  const { pathname } = useLocation()
  const permittedLabeledRoutes = usePermittedLabelRoutes(true)
  // const routeCategories = Object.keys(permittedLabeledRoutes).length
  // const gridStyles = {
  //   display: 'grid',
  //   gap: '2rem', // Adjust gap value as needed
  // }

  // const smallScreenStyles = {
  //   ...gridStyles,
  //   gridTemplateColumns: `repeat(${Math.floor(routeCategories / 3)}, minmax(0, 1fr))`,
  // }

  // const mediumScreenStyles = {
  //   ...gridStyles,
  //   gridTemplateColumns: `repeat(${Math.floor(routeCategories / 2.5)}, minmax(0, 1fr))`,
  // }

  // const largeScreenStyles = {
  //   ...gridStyles,
  //   gridTemplateColumns: `repeat(${routeCategories}, minmax(0, 1fr))`,
  // }

  return (
    //adjust responsiveness of sitemap--rubel
    <ul className="mx-auto mt-3 navbar-nav">
      <li className="static mx-auto">
        <div className="absolute right-5 mt-0 w-[calc(100%-2rem)] max-w-full lg:max-w-fit bg-white rounded-b-lg shadow-lg  min-h-max top-full  overflow-x-auto overflow-y-hidden max-h-[90vh]">
          <div className="z-[60] px-6 py-5 lg:px-8">
            <div
              className="grid justify-between grid-flow-col gap-[69px] columns-11"
            // style={
            //   window.innerWidth < 1024
            //     ? smallScreenStyles
            //     : window.innerWidth < 1224
            //       ? mediumScreenStyles
            //       : largeScreenStyles
            // }
            >
              {Object.keys(permittedLabeledRoutes).map((routeType, index) => (
                <div className="w-max min-w-max gap-y-10" key={index}>
                  <div className="space-y-2">
                    <div
                      className={classNames(
                        'flex items-center gap-2',
                        permittedLabeledRoutes[routeType]
                          .map((route: ILabeledRoute) => route.path())
                          .includes(pathname)
                          ? 'text-topMenuCustomBtnHoverText'
                          : 'text-topMenuCustomBtnText'
                      )}
                    >
                      <Icon icon={menuIcons[routeType]} />
                      <h3 className="text-sm font-medium capitalize ">
                        {t(capitalize(routeType))}
                      </h3>
                    </div>
                    <ul className="flex flex-col justify-between w-full gap-x-8  xl:max-h-full gap-y-1.5">
                      {permittedLabeledRoutes[routeType].map((route: ILabeledRoute, routeIndex) => (
                        <Link to={route.path()} key={routeIndex} onClick={close}>
                          <li key={route.path()} className="cursor-pointer">
                            <div
                              className={classNames(
                                'text-sm py-1',
                                route.path() === pathname
                                  ? 'text-topMenuCustomBtnHoverText'
                                  : 'text-topMenuCustomBtnText hover:text-topMenuCustomBtnHoverText'
                              )}
                            >
                              {t`${route.label}`}
                            </div>
                          </li>
                        </Link>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </li>
    </ul>
  )
}

export default NavbarMenu
