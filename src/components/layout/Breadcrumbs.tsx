import classNames from 'classnames'
import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import useSWRGlobalState from '../../hooks/useSWRGlobalState'
import useWindowWide from '../../hooks/useWindowWide'
// eslint-disable-next-line import/no-extraneous-dependencies
import Sticky from 'react-stickynode'
import routeProperty from '../../routes/routeProperty'
import { IActionsButton } from '../../types/components/actionButtons'
import capitalize from '../../utils/capitalize'
import Icon, { dashIcon, homeIcon } from '../../utils/icons'
import generateBreadcrumbs, { TPageRoutes } from '../../utils/routeMaker'
import t from '../../utils/translator'
import ActionButtons from '../common/ActionButtons'

interface IBreadcrumbsProps {
  pageTitle?: string
  pageRoutes?: TPageRoutes
  breadcrumbsActions?: IActionsButton[]
  breadcrumbsActionsButtons?: IActionsButton[] // use for add & edit pages - apply & cancel button
  children?: ReactNode
}

export default function Breadcrumbs({
  pageTitle: propsPageTitle,
  pageRoutes: propsPageRoutes,
  breadcrumbsActions,
  breadcrumbsActionsButtons,
  children,
}: IBreadcrumbsProps) {
  const location = useLocation()

  const { title: pageTitle, pageRoutes } = generateBreadcrumbs(location.pathname + location.search)

  const [sideMenuStatus] = useSWRGlobalState<'open' | 'close' | null>('SIDE_MENU_STATUS', null)

  const isWidthMd = useWindowWide('md')
  return (
    <Sticky
      enabled={true}
      top={isWidthMd ? 56 : 48.2}
      innerZ={20}
      innerClass={classNames(
        sideMenuStatus && (sideMenuStatus === 'open' ? 'sidebar_open_width' : 'sidebar_close_width')
      )}
    >
      <section
        // style={style}
        className={classNames(
          'transition-all ease-in-out bg-gray-bg border-gray-50 duration-300'
          // isSticky && 'bg-gray-bg pt-12 md:pt-14 border-b-4 border-gray-50'
        )}
      >
        <div className="flex items-center justify-between max-w-full px-4 py-3 overflow-x-auto sm:flex-nowrap md:py-4 md:px-0 gap-y-1 gap-x-8">
          <nav
            className="flex gap-y-1.5 items-center flex-wrap gap-x-6 lg:gap-x-12 lg:min-h-[36px] w-fit max-w-fit"
            aria-label={t`Breadcrumb`}
          >
            <h1 className="text-lg font-semibold text-black capitalize md:text-xl">
              {propsPageTitle ? t(capitalize(propsPageTitle)) : t(capitalize(pageTitle))}
            </h1>
            <ol className="items-center hidden gap-2 md:gap-4 sm:flex">
              <li>
                <div>
                  <Link to={routeProperty.floorDashboard.path(1)} className="customer_text_hover">
                    <Icon
                      icon={homeIcon}
                      className="w-3 h-3 shrink-0 md:w-4 md:h-4"
                      aria-hidden="true"
                    />
                    <span className="sr-only">{t`Home`}</span>
                  </Link>
                </div>
              </li>
              {propsPageRoutes
                ? propsPageRoutes.map((page) => (
                    <li key={page.text}>
                      <div className="flex items-center">
                        <Icon
                          icon={dashIcon}
                          className="w-4 h-4 shrink-0 text-block"
                          aria-hidden="true"
                        />
                        <Link
                          to={page.href}
                          className="ml-2 text-xs font-medium capitalize md:text-sm md:ml-4 customer_text_hover"
                        >
                          {t`${page.text}`}
                        </Link>
                      </div>
                    </li>
                  ))
                : pageRoutes.map((page) => (
                    <li key={page.text}>
                      <div className="flex items-center">
                        <Icon
                          icon={dashIcon}
                          className="w-4 h-4 shrink-0 text-block"
                          aria-hidden="true"
                        />
                        <Link
                          to={page.href}
                          className="ml-2 text-xs font-medium capitalize md:text-sm md:ml-4 customer_text_hover"
                        >
                          {t(capitalize(page.text))}
                        </Link>
                      </div>
                    </li>
                  ))}
            </ol>
          </nav>
          {children && (
            <div className="flex-1 shrink w-max">
              <div className="grid justify-center">{children}</div>
            </div>
          )}
          {/* action buttons */}
          <div className="flex items-center gap-3.5 lg:gap-4 shrink-0">
            <div className="lg:hidden">
              {breadcrumbsActionsButtons ? (
                <ActionButtons actionButtons={breadcrumbsActionsButtons} allowsShow />
              ) : null}
            </div>
            {breadcrumbsActions ? (
              <ActionButtons actionButtons={breadcrumbsActions} allowsShow />
            ) : null}
            <div className="hidden lg:block">
              {breadcrumbsActionsButtons ? (
                <ActionButtons actionButtons={breadcrumbsActionsButtons} allowsShow />
              ) : null}
            </div>
          </div>
          {/* {children && (
            <div className="flex items-center justify-end w-full sm:hidden">
              <div className="">{children}</div>
            </div>
          )} */}
        </div>
      </section>
    </Sticky>
  )
}
