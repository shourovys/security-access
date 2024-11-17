import { forwardRef } from 'react'
import useSWR from 'swr'
import { fetcher } from '../../../api/swrConfig'
import { smartReportApi } from '../../../api/urls'
import { emptyRows } from '../../../hooks/useTable'
import { ITableHead } from '../../../types/components/table'
import { IListServerResponse } from '../../../types/pages/common'
import { ILogResult } from '../../../types/pages/log'
import Table from '../../HOC/style/table/Table'
import TableContainer from '../../HOC/style/table/TableContainer'
import TableEmptyRows from '../../common/table/TableEmptyRows'
import TableHeader from '../../common/table/TableHeader'
import TableNoData from '../../common/table/TableNoData'
import TableBodyLoading from '../../loading/table/TableBodyLoading'
import SmartReportTableRow from './SmartReportTableRow'
interface IProps {
  order: 'asc' | 'desc'
  orderBy: string
  tableHead: ITableHead[]
  apiQueryStringWithOutPagination: string
  showColumns: (keyof ILogResult)[]
}

const SmartReportPrintModal = forwardRef<HTMLDivElement, IProps>(
  ({ order, orderBy, tableHead, apiQueryStringWithOutPagination, showColumns }, ref) => {
    const { isLoading, data } = useSWR<IListServerResponse<ILogResult[]>>(
      smartReportApi.list(apiQueryStringWithOutPagination),
      fetcher
    )

    const isNotFound = !data?.data.length && !isLoading

    return (
      <TableContainer ref={ref} shadow={false}>
        <h1 className="text-2xl font-medium text-center mb-4">Smart Report</h1>

        <Table>
          <TableHeader
            order={order}
            orderBy={orderBy}
            rowCount={data?.data.length}
            handleSort={() => {}}
            handleOrder={() => {}}
            headerData={tableHead.map((head) => ({
              id: head.id,
              label: head.label,
              filter: false,
            }))}
          />
          <tbody>
            {!isLoading && (
              <>
                {data?.data.map((row) => (
                  <SmartReportTableRow key={row.FormatNo} row={row} showColumns={showColumns} />
                ))}
                <TableEmptyRows emptyRows={data?.data ? emptyRows(1, 10, data?.count) : 0} />
              </>
            )}
          </tbody>
        </Table>
        <TableBodyLoading isLoading={isLoading} />
        <TableNoData isNotFound={isNotFound} />
      </TableContainer>
    )
  }
)

export default SmartReportPrintModal
