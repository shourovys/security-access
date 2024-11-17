import { Menu, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useSWRMutation from 'swr/mutation'
import { fetcher } from '../../api/swrConfig'
import { authApi } from '../../api/urls'
import useAuth from '../../hooks/useAuth'
import routeProperty from '../../routes/routeProperty'
import { IActionsButton } from '../../types/components/actionButtons'
import { IOemData } from '../../types/pages/oem'
import { IMAGE_URL } from '../../utils/config'
import Icon, { avatarIcon, menuIcon } from '../../utils/icons'
import isOemNoPresent from '../../utils/isOemNoPresent'
import t from '../../utils/translator'
import SideDrawer from '../HOC/SideDrawer'
import Modal from '../HOC/modal/Modal'
import TextButton from '../atomic/TextButton'
import Flyout from '../common/Flyout'
import FavoriteModal from './FavoriteModal'
import Hamburger from './Hamburger'
import NavbarMenu from './NavbarMenu'
import ProfileModal from './ProfileModal'

function Navbar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { user, license, partition, logout: contextLogout, layout } = useAuth()

  const [openProfileModal, setOpenProfileModal] = useState(false)
  const [openFavoriteModal, setOpenFavoriteModal] = useState(false)

  const { trigger: logout, isMutating } = useSWRMutation(authApi.logout, fetcher, {
    onSuccess: () => {
      navigate(routeProperty.login.path(), { state: { previousPath: pathname } })
      contextLogout()
    },
  })

  const handleLogout = async () => {
    window.sessionStorage.removeItem('UserId')
    window.sessionStorage.removeItem('Password')
    await logout()
  }

  const handleProfileModalOpen = () => {
    setOpenProfileModal(true)
  }

  const handleFavoriteModalOpen = () => {
    setOpenFavoriteModal(true)
  }

  const userNavigation: IActionsButton[] = [
    ...(layout === 'Master' ? [{ text: t`Profile`, onClick: handleProfileModalOpen }] : []),
    ...(layout === 'Master' ? [{ text: t`Favorite`, onClick: handleFavoriteModalOpen }] : []),

    { text: t`Logout`, onClick: handleLogout, isLoading: isMutating },
  ]

  const [oemData, setOemData] = useState<IOemData | null>()

  useEffect(() => {
    if (isOemNoPresent(license?.OemNo)) {
      fetch(`/oem/${license?.OemNo}/data.json`)
        .then((r) => r.json()) // Corrected variable name from 'data' to 'text'
        .then((text: IOemData) => {
          setOemData(text)
        })
        .catch((error) => {
          console.error('Error fetching EULA data:', error)
        })
    }
  }, [license?.OemNo])

  return (
    <div className="z-50 flex flex-col">
      <div className="relative z-10 flex h-12 shadow shrink-0 bg-navbarBg md:h-14">
        <Link
          to={routeProperty.floorDashboard.path(1)}
          className="flex items-center px-4 shrink-0 "
        >
          <img
            className="w-auto h-7 md:h-8"
            src={
              partition?.ImageFile
                ? IMAGE_URL + partition?.ImageFile
                : isOemNoPresent(license?.OemNo)
                ? `/oem/${license?.OemNo}/images/mainLogo.png`
                : '/images/logo/full_logo.svg'
            }
            alt={oemData?.name}
          />
        </Link>
        <div className="flex justify-end flex-1 px-4 py-2">
          <div className="flex items-center gap-8 ml-4 md:gap-10 md:ml-6">
            {/*{layout === 'Master' && (*/}
            {/*  <div*/}
            {/*    onClick={handleFavoriteModalOpen}*/}
            {/*    className="items-center hidden gap-2 font-semibold rounded-full cursor-pointer sm:flex bg-navbarBtnBg text-navbarBtnText hover:bg-navbarBtnHoverBg hover:text-navbarBtnHoverText md:rounded-md md:h-full customer_text_hover"*/}
            {/*  >*/}
            {/*    <Icon icon={favoriteIcon} className="w-5 h-5" />*/}
            {/*    <span className="hidden text-sm md:block">{t`Favorite`}</span>*/}
            {/*  </div>*/}
            {/*)}*/}

            {/* mobile menu button  */}
            {layout === 'Master' && (
              <SideDrawer drawer={Hamburger} className="md:hidden" drawerClass="bg-navbarBtnBg">
                <span className="flex items-center gap-2 font-semibold rounded-full bg-navbarBtnBg text-navbarBtnText hover:bg-navbarBtnHoverBg hover:text-navbarBtnHoverText md:h-full md:hidden customer_text_hover focus:outline-none">
                  <Icon icon={menuIcon} className="w-5 h-5" />
                </span>
              </SideDrawer>
            )}
            {/* desktop menu button  */}
            {layout === 'Master' && (
              <Flyout flyout={NavbarMenu} className="hidden md:block md:h-full">
                <div className="items-center hidden gap-2 font-semibold rounded-full outline-none bg-navbarBtnBg text-navbarBtnText hover:bg-navbarBtnHoverBg hover:text-navbarBtnHoverText md:h-full md:flex customer_text_hover md:rounded-md">
                  <Icon icon={menuIcon} className="w-5 h-5" />
                  <span className="hidden text-sm md:block">{t`Sitemap`}</span>
                </div>
              </Flyout>
            )}
            {/* Profile dropdown */}
            <Menu as="div" className="relative" style={{ width: 'fit-content' }}>
              <div>
                <Menu.Button className="flex items-center justify-center max-w-xs gap-2 text-sm rounded-full bg-navbarBtnBg text-navbarBtnText hover:bg-navbarBtnHoverBg hover:text-navbarBtnHoverText md:rounded-md md:h-full md:p-1">
                  <div className="hidden leading-4 text-right capitalize md:block">
                    <div style={{ fontSize: '.9rem' }}>{user?.UserId}</div>
                    <div style={{ fontSize: '.6rem' }} className="text-gray-700">
                      {user?.Role.RoleName}
                    </div>
                  </div>
                  {user?.Person?.ImageFile ? (
                    <img
                      className="w-8 h-8 rounded-full md:w-9 md:h-9 md:rounded-md"
                      src={IMAGE_URL + user?.Person?.ImageFile}
                      alt=""
                    />
                  ) : (
                    <Icon
                      icon={avatarIcon}
                      className="w-6 h-6 rounded-full md:w-7 md:h-7 md:rounded-md"
                    />
                  )}
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {userNavigation.map((item) => (
                    <Menu.Item key={item.text}>
                      <TextButton link={item.link} onClick={item.onClick}>
                        {item.text}
                      </TextButton>
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
      <Modal openModal={openProfileModal} setOpenModal={setOpenProfileModal}>
        <ProfileModal setOpenModal={setOpenProfileModal} />
      </Modal>
      <Modal openModal={openFavoriteModal} setOpenModal={setOpenFavoriteModal}>
        <FavoriteModal setOpenModal={setOpenFavoriteModal} />
      </Modal>
    </div>
  )
}

export default Navbar
