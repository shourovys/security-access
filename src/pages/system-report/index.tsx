import classNames from 'classnames'
import useSWR from 'swr'
import { systemReport } from '../../api/urls'
import Page from '../../components/HOC/Page'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import SystemReportCards from '../../components/pages/systemReport/SystemReportCards'
import SystemReportList from '../../components/pages/systemReport/SystemReportList'
import useAuth from '../../hooks/useAuth'
import routeProperty from '../../routes/routeProperty'
import { IListServerResponse } from '../../types/pages/common'
import { ISystemStatus } from '../../types/pages/dashboard'
import t from '../../utils/translator'

export default function SystemReport() {
  const { isLoading, data } = useSWR<IListServerResponse<ISystemStatus>>(systemReport.dashboard)
  const { layout } = useAuth()

  return (
    <Page title={t`Information`}>
      <Breadcrumbs
        pageRoutes={[
          {
            href: routeProperty.systemReport.path(),
            text: t`System Report`,
          },
        ]}
      />
      {/* <div className="px-4 md:px-3"> */}
      <div
        className={classNames(
          'grid gap-4',
          layout === 'Master' && 'lg:grid-cols-2'
          // layout === 'Master' ? 'md:py-7' : 'md:py-3'
        )}
      >
        <SystemReportCards data={data?.data} />
        {layout === 'Master' && (
          <SystemReportList isLoading={isLoading} data={data?.data.DeviceStatus} />
        )}
      </div>
      {/* </div> */}
    </Page>
  )
}
