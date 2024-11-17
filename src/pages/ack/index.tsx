import { sendPostRequest } from '../../api/swrConfig'
import { homeApi } from '../../api/urls'
import Page from '../../components/HOC/Page'
import Table from '../../components/HOC/style/table/Table'
import TableContainer from '../../components/HOC/style/table/TableContainer'
import Pagination from '../../components/common/table/Pagination'
import TableEmptyRows from '../../components/common/table/TableEmptyRows'
import TableHeader from '../../components/common/table/TableHeader'
import TableNoData from '../../components/common/table/TableNoData'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import TableBodyLoading from '../../components/loading/table/TableBodyLoading'
import AckDashboardTableRow from '../../components/pages/ackDashboard/AckDashboardTableRow'
import AckDashboardTableToolbar from '../../components/pages/ackDashboard/AckDashboardTableToolbar'
import useTable, { emptyRows } from '../../hooks/useTable'
import QueryString from 'qs'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { THandleFilterInputChange } from '../../types/components/common'
import { ITableHead } from '../../types/components/table'
import { IAckDashboardFormData } from '../../types/pages/ackDashboard'
import { IListServerResponse } from '../../types/pages/common'
import { ILogResult } from '../../types/pages/log'
import { addSuccessfulToast, errorToast } from '../../utils/toast'
import t from '../../utils/translator'

const TABLE_HEAD: ITableHead[] = [
  { id: 'LogNo', label: t`Log No`, filter: true },
  { id: 'EventTime', label: t`Event Time`, filter: true },
  { id: 'EventName', label: t`Event Name`, filter: true },
  { id: 'DeviceName', label: t`Device Name`, filter: true },
  { id: 'PersonName', label: t`Person Name`, filter: true },
]

function ACK() {
  const location = useLocation()
  const {
    page,
    rowsPerPage,
    order,
    orderBy,
    selected,
    handleChangePage,
    handleSort,
    handleOrder,
    handleChangeRowsPerPage,
    handleSelectRow,
    handleSelectAllRow,
  } = useTable({ defaultOrderBy: TABLE_HEAD[0].id })

  // apply property use for apply filter. filter will apply when apply is true
  const initialFilterState: IAckDashboardFormData = {
    comment: '',
  }
  // state to store the toolbar from values
  const [listFormState, setListFormState] = useState(initialFilterState)

  const handleInputChange: THandleFilterInputChange = (name, value) => {
    setListFormState((state) => ({ ...state, [name]: value }))
  }

  // create the query object for the API call
  const apiQueryParams = {
    offset: (page - 1) * rowsPerPage,
    limit: rowsPerPage,
    sort_by: orderBy,
    order,
  }

  const apiQueryString = QueryString.stringify(apiQueryParams)

  const { isLoading, data, mutate } = useSWR<IListServerResponse<ILogResult[]>>(
    homeApi.arkList(apiQueryString)
  )

  // Define the mutation function to send the form data to the server
  const { trigger, isMutating } = useSWRMutation(homeApi.arkComment, sendPostRequest, {
    onSuccess: () => {
      // again load data
      mutate()
      addSuccessfulToast()
    },
  })

  const handleSubmit = () => {
    if (!listFormState.comment) {
      errorToast('Comment is required')
      return null
    }
    if (!selected.length) {
      errorToast('Please select logs')
      return null
    }

    trigger({
      LogNos: selected,
      Comment: listFormState.comment,
    })
  }

  const isNotFound = !data?.data.length && !isLoading

  return (
    <Page>
      <Breadcrumbs
        pageTitle={t`ACK`}
        pageRoutes={[
          {
            href: '/ack',
            text: t`ACK`,
          },
        ]}
      />
      <TableContainer>
        <AckDashboardTableToolbar
          listFormState={listFormState}
          handleSubmit={handleSubmit}
          isSubmitting={isMutating}
          handleInputChange={handleInputChange}
          selected={selected}
        />

        <Table>
          <TableHeader
            order={order}
            orderBy={orderBy}
            numSelected={selected.length}
            rowCount={data?.data.length}
            handleSort={handleSort}
            handleOrder={handleOrder}
            selectAllRow={(isAllSelected: boolean) => {
              if (data?.data) {
                handleSelectAllRow(
                  isAllSelected,
                  data?.data.map((result) => result.LogNo.toString())
                )
              }
            }}
            headerData={TABLE_HEAD}
          />
          <tbody className="divide-y divide-gray-200">
            {!isLoading && (
              <>
                {data?.data.map((row) => (
                  <AckDashboardTableRow
                    key={row.LogNo}
                    row={row}
                    selected={selected}
                    handleSelectRow={handleSelectRow}
                  />
                ))}
                <TableEmptyRows
                  emptyRows={data?.data ? emptyRows(page, rowsPerPage, data?.count) : 0}
                />
              </>
            )}
          </tbody>
        </Table>
        <TableBodyLoading isLoading={isLoading} tableRowPerPage={rowsPerPage} />
        <TableNoData isNotFound={isNotFound} />
        <Pagination
          totalRows={data?.count || 0}
          currentPage={page}
          rowsPerPage={rowsPerPage}
          currentPath={location.pathname}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Page>
  )
}

export default ACK
