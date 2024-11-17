import { Disclosure } from '@headlessui/react'
import classNames from 'classnames'
import { Link, useLocation } from 'react-router-dom'
import usePermittedLabelRoutes from '../../hooks/usePermittedLabelRoutes'
import capitalize from '../../utils/capitalize'
import menuIcons from '../../utils/menuIcons'
import t from '../../utils/translator'

interface IProps {
  close: () => void
}

export default function Hamburger({ close }: IProps) {
  const { pathname } = useLocation()
  const permittedLabeledRoutes = usePermittedLabelRoutes(true)

  const navigation = Object.keys(permittedLabeledRoutes).map((routeType) => ({
    icon: menuIcons[routeType],
    name: routeType,
    children: permittedLabeledRoutes[routeType].map((navRoute) => ({
      name: navRoute.label,
      href: navRoute.path(),
      permissions: navRoute.permissions,
    })),
  }))

  return (
    <div className="flex flex-col grow overflow-y-auto">
      <div className="flex flex-col grow mt-5 py-0.5">
        <nav className="flex-1 px-1 space-y-1 " aria-label={t`Sidebar`}>
          {navigation.map((item) =>
            !item.children ? (
              <div key={item.name}>
                <Link
                  to="/"
                  className={classNames(
                    // item.current
                    //     ? "bg-gray-100 text-gray-900"
                    //     :
                    // "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 ",
                    'group w-full flex items-center pl-2 py-2 text-sm font-medium rounded-md capitalize'
                  )}
                >
                  {item.name}
                </Link>
              </div>
            ) : (
              <Disclosure as="div" key={item.name} className="space-y-1">
                {({ open }) => (
                  <>
                    <Disclosure.Button
                      className={classNames(
                        item.children.map((child) => child.href).includes(pathname)
                          ? 'bg-mobileMenuBtnActiveBg text-mobileMenuBtnActiveText  '
                          : 'bg-mobileMenuBtnBg text-mobileMenuBtnText hover:bg-mobileMenuBtnActiveBg hover:text-mobileMenuBtnActiveText',
                        'group w-full flex items-center pl-2 pr-1 py-2 text-left text-sm font-medium rounded-md focus:outline-none focus:ring-2'
                      )}
                    >
                      <span className="flex-1 capitalize">{t(capitalize(item.name))}</span>
                      <svg
                        className={classNames(
                          open ? 'text-gray-400 rotate-90' : 'text-gray-300',
                          'ml-3 shrink-0 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150'
                        )}
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
                      </svg>
                    </Disclosure.Button>
                    <Disclosure.Panel className="space-y-1">
                      {item.children.map((subItem) => (
                        <button key={subItem.name} onClick={() => close()} className="block w-full">
                          <Link
                            to={subItem.href}
                            className={classNames(
                              subItem.href === pathname
                                ? 'bg-mobileMenuBtnActiveBg text-mobileMenuBtnActiveText'
                                : 'bg-mobileMenuBtnBg text-mobileMenuBtnText hover:bg-mobileMenuBtnHoverBg hover:text-mobileMenuBtnHoverText',
                              'flex items-center w-full py-2 pr-2 text-sm font-medium rounded-md group pl-6 '
                            )}
                          >
                            {subItem.name}
                          </Link>
                        </button>
                      ))}
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            )
          )}
        </nav>
      </div>
    </div>
  )
}
