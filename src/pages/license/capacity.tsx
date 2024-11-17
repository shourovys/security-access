import { licenseApi } from '../../api/urls'
import classNames from 'classnames'
import Page from '../../components/HOC/Page'
import TableContainer from '../../components/HOC/style/table/TableContainer'
import TableData from '../../components/HOC/style/table/TableData'
import TableNoData from '../../components/common/table/TableNoData'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import TableBodyLoading from '../../components/loading/table/TableBodyLoading'
import { useMemo } from 'react'
import routeProperty from '../../routes/routeProperty'
import useSWR from 'swr'
import { IActionsButton } from '../../types/components/actionButtons'
import { ISingleServerResponse } from '../../types/pages/common'
import { ICapacityResult } from '../../types/pages/license'
import { licenseIcon } from '../../utils/icons'
import t from '../../utils/translator'

const TABLE_HEAD = [
  { id: 'Capacity', label: t`Capacity` },
  { id: 'Total', label: t`Total` },
  { id: 'Used', label: t('Used') },
  { id: 'Available', label: t`Available` },
]

function CapacityList() {
  const { isLoading, data } = useSWR<ISingleServerResponse<ICapacityResult[]>>(licenseApi.capacity)

  const breadcrumbsActions = useMemo<IActionsButton[]>(
    () => [
      {
        icon: licenseIcon,
        text: t`Close`,
        link: routeProperty.licenseInfo.path(),
      },
    ],
    []
  )

  const isNotFound = !data?.data.length && !isLoading

  return (
    <Page title={t`Capacity List`}>
      <Breadcrumbs
        breadcrumbsActions={breadcrumbsActions}
        // breadcrumbs navbar & router link
        pageRoutes={[
          {
            href: routeProperty.licenseInfo.path(),
            text: t`License`,
          },
          {
            href: routeProperty.licenseInfo.path(),
            text: t`Capacity`,
          },
        ]}
        //end --rubel
      />
      <TableContainer>
        <div className="flex flex-col overflow-y-hidden ">
          <div className="overflow-x-auto overflow-y-hidden sm:mx-0.5 lg:mx-0.5 rounded-xl border border-gray-200">
            <div className="min-w-full">
              <div className="overflow-x-auto ">
                <table className="min-w-full">
                  <thead className="bg-[#F0F1F3]">
                    <tr className="">
                      {TABLE_HEAD.map((item) => (
                        <th
                          key={item.id}
                          scope="col"
                          className={classNames(
                            'px-3 py-3.5 text-sm font-medium whitespace-nowrap'
                          )}
                        >
                          {item.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {!isLoading &&
                      data?.data.map((row) => (
                        <tr
                          className={classNames(
                            'custom_transition bg-white group hover:bg-gray-100 group'
                          )}
                          style={{
                            height: 39,
                          }}
                          key={row.id}
                        >
                          <TableData>{t(row.name)}</TableData>
                          <TableData>{row.total}</TableData>
                          <TableData>{row.used}</TableData>
                          <TableData>{row.remain}</TableData>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <TableBodyLoading
                  isLoading={isLoading}
                  tableRowPerPage={data?.data.length}
                  tableRowHeight={42}
                  sideBorder={false}
                />
                <TableNoData isNotFound={isNotFound} tableRowPerPage={11} tableRowHeight={39} />
              </div>
            </div>
          </div>
        </div>
      </TableContainer>
    </Page>
  )
}

export default CapacityList
