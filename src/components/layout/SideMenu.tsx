import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import usePermittedLabelRoutes from '../../hooks/usePermittedLabelRoutes'
import Icon, { leftArrowIcon, rightArrowIcon } from '../../utils/icons'
import menuIcons from '../../utils/menuIcons'
import t from '../../utils/translator'
import SideMenuIconButton from './SideMenuIconButton'

interface SidebarProps {
  isSidebarShowing: boolean
  toggleSidebar: () => void
}

function SideMenu({ isSidebarShowing, toggleSidebar }: SidebarProps) {
  const { pathname } = useLocation()

  const permittedLabeledRoutes = usePermittedLabelRoutes()

  const [openSubMenu, setOpenSubMenu] = useState(false)

  // const [isHovering, setIsHovering] = useState(false)

  // const handleMouseEnter = () => setIsHovering(true)
  // const handleMouseLeave = () => setIsHovering(false)

  const handleToggleSidebar = () => {
    toggleSidebar()
    // setIsHovering(false)
  }

  const [selectedRouteGroup, setSelectedRouteGroup] = useState<string>(
    Object.keys(permittedLabeledRoutes)[0]
  )

  const activeRouteGroup = permittedLabeledRoutes[selectedRouteGroup]

  const handleSelectedRouteGroupChange = (label: string) => {
    setSelectedRouteGroup(label)
    setOpenSubMenu(true)
  }

  useEffect(() => {
    setOpenSubMenu(false)
  }, [pathname])

  const subMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (subMenuRef.current && !subMenuRef.current.contains(event.target as Node)) {
        setOpenSubMenu(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <div
      className={classNames(
        'duration-300 z-40 md:bg-sidebarBg top-0 bottom-0 flex mx-4 mt-5 md:mx-0 md:mt-0 md:shrink-0 md:h-full relative ',
        isSidebarShowing ? 'md:w-40 lg:w-52' : 'md:w-12 '
        // isHovering && 'md:hover:w-52'
      )}
    >
      <span
        role="button"
        className={classNames(
          'absolute z-40 items-center justify-center w-7 h-7 text-sidebarBtnText bg-sidebarBg border-2 shadow border-white rounded-full cursor-pointer hidden md:flex top-16 -right-3.5'
        )}
        onClick={handleToggleSidebar}
        title={t`Menu collapse button`}
        // onMouseEnter={!isSidebarShowing && isHovering ? handleMouseEnter : undefined}
        // onMouseLeave={!isSidebarShowing && isHovering ? handleMouseLeave : undefined}
      >
        <Icon icon={isSidebarShowing ? leftArrowIcon : rightArrowIcon} className="text-lg" />
      </span>

      <div className="w-full md:pt-14 md:mt-8 md:border-r border-gray-primary">
        <nav
          className="flex flex-row gap-1.5 lg:gap-2.5 pr-12 mb-1 overflow-x-auto md:flex-col md:mb-0 md:pr-0 scrollbar-hide md:overflow-x-hidden  md:overflow-y-auto md:grow group:"
          // onMouseEnter={handleMouseEnter}
          // onMouseLeave={handleMouseLeave}
          ref={subMenuRef}
        >
          {/*<SideMenuIconButton*/}
          {/*  icon={menuIcons.favorite}*/}
          {/*  label={'favorite'}*/}
          {/*  isActive={'favorite' === selectedRouteGroup}*/}
          {/*  handleClick={setSelectedRouteGroup}*/}
          {/*  isSidebarShowing={isSidebarShowing}*/}
          {/*  isHovering={isHovering}*/}
          {/*/>*/}
          {Object.keys(permittedLabeledRoutes).map((routeType, index) => (
            <SideMenuIconButton
              key={index}
              icon={menuIcons[routeType]}
              label={routeType}
              isActive={routeType === selectedRouteGroup}
              selectedRouteGroup={selectedRouteGroup}
              openSubMenu={openSubMenu}
              handleClick={handleSelectedRouteGroupChange}
              activeRouteGroup={activeRouteGroup}
              isSidebarShowing={isSidebarShowing}
              // isHovering={isHovering}
            />
          ))}
        </nav>
      </div>
    </div>
  )
}

export default SideMenu
