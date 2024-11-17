import classNames from 'classnames'
import { Link, useLocation } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { ReactRoutes } from '../../routes/routeProperty'
import { IRoute } from '../../types/routes'
import checkPermission from '../../utils/checkPermission'
import Icon from '../../utils/icons'

interface IProps {
  item: IRoute
}

function NavMenuIconButton({ item }: IProps) {
  const location = useLocation()

  const isActive = item.path() === location.pathname

  return (
    <Link
      key={item.routePath}
      to={item.path()}
      className={classNames(
        isActive
          ? 'text-primary border-primary'
          : 'text-gray-500 hover:text-gray-900 border-gray-300 hover:bg-white custom_transition',
        'group flex justify-center items-center px-3 py-1.5 text-xs   gap-1.5 md:gap-2 relative'
      )}
      // title={item.name}
    >
      {item.icon && (
        <Icon
          icon={item.icon}
          className={classNames(
            isActive ? 'text-primary' : 'text-gray-600  group-hover:text-gray-500 ',
            'shrink-0 outline-none group text-base '
          )}
        />
      )}

      <span
        className={classNames(
          'text-sm leading-4 text-center whitespace-nowrap custom_transition opacity-100 transition-opacity rounded-md'
        )}
      >
        {item.label}
      </span>
    </Link>
  )
}

// interface INavbarProps {}

function NavMenu() {
  const { permissions, license } = useAuth()

  const serialOrder: Record<string, number> = {
    '50': 0,
    '51': 1,
    '52': 2,
    '53': 3,
    '40': 4,
    '47': 5,
    '5': 8,
    '48': 7,
  }

  const premisedRoutes = ReactRoutes.filter(
    (route) => route.label && route.id && checkPermission(route.permissions, permissions, license)
  ).sort((routeA, routeB) => {
    const orderA = serialOrder[routeA.id?.toString() ?? ''] ?? Number.MAX_SAFE_INTEGER
    const orderB = serialOrder[routeB.id?.toString() ?? ''] ?? Number.MAX_SAFE_INTEGER
    return orderA - orderB
  })

  return (
    <div
      className={classNames(
        'duration-300 z-40 top-0 justify-center bottom-0 flex mx-4 mt-5 relative '
      )}
    >
      <nav className="bg-gray-200 rounded flex p-0.5  overflow-auto">
        {premisedRoutes.map((item) => (
          <NavMenuIconButton item={item} key={item.routePath} />
        ))}
      </nav>
    </div>
  )
}

export default NavMenu
