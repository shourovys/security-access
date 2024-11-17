import classNames from 'classnames'
import { lazy, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useFavoritePages } from '../../hooks/useFavoritePages'
import { ILabeledRoute } from '../../types/routes'
import Icon, { leftArrowIcon, rightArrowIcon } from '../../utils/icons'
import t from '../../utils/translator'

const FavoriteEdit = lazy(() => import('../../pages/favorite'))

interface IProps {
  route: ILabeledRoute
  isSidebarShowing: boolean
  isHovering: boolean
}

function SidebarIconButton({ route, isSidebarShowing, isHovering: isHover }: IProps) {
  const location = useLocation()

  const isActive = route.path() === location.pathname

  return (
    <Link
      key={route.label}
      to={route.path()}
      className={classNames(
        isActive
          ? 'text-sidebarBtnActiveText border-sidebarBtnActiveText bg-sidebarBtnActiveBg'
          : 'text-sidebarBtnText bg-sidebarBtnBg hover:text-sidebarBtnHoverText border-sidebarBtnHoverText hover:bg-sidebarBtnHoverBg custom_transition',
        'group md:overflow-hidden flex justify-center md:justify-start items-center px-3 md:px-0.5 md:mx-1 py-1.5 md:py-2 md:mb-0.5 text-sm md:rounded-md font-medium gap-1.5 md:gap-1 border md:border-0 rounded-full relative'
      )}
      // title={item.name}
    >
      <Icon
        icon={route.icon}
        className={classNames(
          isActive
            ? 'text-sidebarBtnActiveText'
            : 'text-sidebarBtnText md:text-sidebarBtnText group-hover:text-sidebarBtnHoverText md:group-hover:text-sidebarBtnHoverText',
          'shrink-0 outline-none group text-base md:text-xl md:h-[22px] md:w-[22px] md:mx-1.5'
        )}
      />

      <span
        className={classNames(
          'text-sm leading-4 text-center whitespace-nowrap custom_transition opacity-100 transition-opacity rounded-md',
          !isSidebarShowing && 'md:scale-0 md:group-hover:scale-100',
          isHover && 'md:scale-100'
        )}
      >
        {t`${route.label}`}
      </span>
    </Link>
  )
}

interface SidebarProps {
  isSidebarShowing: boolean
  toggleSidebar: () => void
}

function Sidebar({ isSidebarShowing, toggleSidebar }: SidebarProps) {
  const { favoritePages, isLoading } = useFavoritePages()

  const [isHovering, setIsHovering] = useState(false)

  const handleMouseEnter = () => setIsHovering(true)
  const handleMouseLeave = () => setIsHovering(false)

  const handleToggleSidebar = () => {
    toggleSidebar()
    setIsHovering(false)
  }

  return (
    <div
      className={classNames(
        'duration-300 z-40 md:bg-sidebarBg top-0 bottom-0 flex mx-4 mt-5 md:mx-0 md:mt-0 md:shrink-0 md:h-full relative ',
        isSidebarShowing ? 'md:w-52' : 'md:w-12 ',
        isHovering && 'md:hover:w-52'
      )}
    >
      <span
        role="button"
        className={classNames(
          'absolute z-40 items-center justify-center w-7 h-7 text-sidebarBtnText bg-sidebarBg border-2 shadow border-white rounded-full cursor-pointer hidden md:flex top-16 -right-3.5'
        )}
        onClick={handleToggleSidebar}
        title={t`Menu collapse button`}
        onMouseEnter={!isSidebarShowing && isHovering ? handleMouseEnter : undefined}
        onMouseLeave={!isSidebarShowing && isHovering ? handleMouseLeave : undefined}
      >
        <Icon icon={isSidebarShowing ? leftArrowIcon : rightArrowIcon} className="text-lg" />
      </span>

      <nav
        className="flex flex-row gap-3 pr-12 mb-1 overflow-x-auto md:pt-14 md:mt-8 md:flex-col md:mb-0 md:pr-0 md:border-r scrollbar-hide md:overflow-x-hidden border-gray-primary md:overflow-y-auto md:grow group:"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {favoritePages.map((route) => (
          <SidebarIconButton
            route={route}
            key={route.id}
            isSidebarShowing={isSidebarShowing}
            isHovering={isHovering}
          />
        ))}
        {/* {favoritePages.length < 10 && (
          <div className="hidden pt-4 border-t border-gray-300 md:block">
            <SidebarIconButton
              route={{
                id: '',
                label: t('Favorite',
                path: () => '/favorite',
                icon: favoriteIcon,
                permissions: '*',
              }}
              isSidebarShowing={isSidebarShowing}
              isHovering={isHovering}
            />
          </div>
        )} */}
      </nav>
    </div>
  )
}

export default Sidebar
