import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import { Link, matchPath, useLocation } from 'react-router-dom'
import { routesArrayInGroup } from '../../routes/menu'
import { ILabeledRoute, IRoute } from '../../types/routes'
import capitalize from '../../utils/capitalize'
import Icon, { TIcon } from '../../utils/icons'
import t from '../../utils/translator'

interface IProps {
  icon: TIcon
  label: string
  isActive: boolean
  selectedRouteGroup: string
  openSubMenu: boolean
  handleClick: (label: string) => void
  activeRouteGroup: ILabeledRoute[]
  isSidebarShowing: boolean
}

function SideMenuIconButton({
  icon,
  label,
  isActive,
  selectedRouteGroup,
  openSubMenu,
  handleClick,
  activeRouteGroup,
  isSidebarShowing,
}: IProps) {
  const [isHoverTooltip, setIsHoverTooltip] = useState(false)
  const [alignmentClass, setAlignmentClass] = useState<boolean | null>(null)

  const mainMenuItemRef = useRef<HTMLDivElement>(null)
  const subMenuRef = useRef<HTMLDivElement>(null)

  const { pathname } = useLocation()

  const isRouteActiveGroup = routesArrayInGroup[label]?.find((route: IRoute) =>
    matchPath(pathname, route.routePath)
  )

  useEffect(() => {
    if (isRouteActiveGroup) {
      handleClick(label)
    }
  }, [pathname])

  useEffect(() => {
    if (alignmentClass === null) {
      const mainMenuItemRect = mainMenuItemRef.current?.getBoundingClientRect()
      const subMenuRect = subMenuRef.current?.getBoundingClientRect()

      if (mainMenuItemRect && subMenuRect) {
        if (subMenuRect.bottom > window.innerHeight) {
          setAlignmentClass(true)
        } else {
          setAlignmentClass(false)
        }
      }
    }
  }, [selectedRouteGroup, mainMenuItemRef.current])

  const handleGroupClick = () => {
    handleClick(label)
  }

  const isCurrentRouteGroup = (routePath: string) => {
    const p = pathname.includes('?') ? pathname.split('?')[0] : pathname
    return routePath.split('/')[1] === p.split('/')[1]
  }

  return (
    <div
      className={classNames(
        'flex cursor-pointer relative md:mx-1 md:mb-0.5 text-xs rounded-md font-medium',
        isActive ? 'bg-sidebarBtnHoverBg' : '',
        isRouteActiveGroup
          ? 'text-sidebarBtnActiveText bg-sidebarBtnActiveBg'
          : 'text-sidebarBtnText bg-sidebarBtnBg hover:text-sidebarBtnHoverText hover:bg-sidebarBtnHoverBg custom_transition',
        alignmentClass ? 'items-center' : 'items-start'
      )}
      onClick={handleGroupClick}
      ref={mainMenuItemRef}
    >
      <div
        className="group md:overflow-hidden flex justify-center md:justify-start items-center gap-1.5 md:gap-1 px-3 md:px-0.5 py-1.5 md:py-2"
        onMouseEnter={() => setIsHoverTooltip(true)}
        onMouseLeave={() => setIsHoverTooltip(false)}
      >
        <Icon
          icon={icon}
          className={classNames(
            isRouteActiveGroup
              ? 'text-sidebarBtnActiveText'
              : 'text-sidebarBtnText md:text-sidebarBtnText group-hover:text-sidebarBtnHoverText md:group-hover:text-sidebarBtnHoverText',
            'shrink-0 outline-none group text-base h-[18px] lg:h-[22px] w-[18px] lg:w-[22px] mx-1 md:mx-2 lg:mx-1.5 cursor-pointer'
          )}
        />
        {!isSidebarShowing && isHoverTooltip && (
          <span
            className={classNames(
              'ease-in-out duration-300 tooltip fixed w-max z-40 ml-10 bg-gray-700 text-white p-1 rounded-md'
            )}
          >
            {t(capitalize(label))}
          </span>
        )}

        <span
          className={classNames(
            'text-sm leading-4 text-center whitespace-nowrap custom_transition opacity-100 transition-opacity rounded-md',
            !isSidebarShowing && 'md:scale-0 md:group-hover:scale-100'
          )}
        >
          {t(capitalize(label))}
        </span>
      </div>

      {/* sub menu items */}
      {isActive && openSubMenu && (
        <div
          className={classNames(
            'fixed w-40 bg-sidebarBg p-1 -mt-1.5 rounded-md',
            isSidebarShowing ? 'left-40 lg:left-52' : 'left-12'
          )}
          ref={subMenuRef} // Ref to the sub-menu
        >
          {activeRouteGroup.map((route: ILabeledRoute, routeIndex) => (
            <Link to={route.path()} key={routeIndex}>
              <div key={route.path()} className="cursor-pointer">
                <div
                  className={classNames(
                    'group md:overflow-hidden flex font justify-center md:justify-start items-center px-3 md:px-0.5 md:mx-1 py-1.5 md:py-2 text-sm md:rounded-md font-medium gap-1.5 md:gap-1 rounded-full cursor-pointer',
                    isCurrentRouteGroup(route.path()) ? 'border-primary' : 'border-transparent',
                    isCurrentRouteGroup(route.path())
                      ? 'text-sidebarBtnActiveText bg-sidebarBtnActiveBg'
                      : 'text-sidebarBtnText bg-sidebarBtnBg hover:text-sidebarBtnHoverText hover:bg-sidebarBtnHoverBg custom_transition'
                  )}
                >
                  <Icon
                    icon={route.icon}
                    className={classNames(
                      'group shrink-0 outline-none group h-[18px] lg:h-[22px] w-[18px] lg:w-[22px] mx-1 md:mx-1.5 cursor-pointer'
                    )}
                  />
                  {t`${route.label}`}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default SideMenuIconButton
