import QueryString from 'qs'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendMultiDeleteRequest } from '../../api/swrConfig'
import { archiveScheduleApi } from '../../api/urls'
import Page from '../../components/HOC/Page'
import Table from '../../components/HOC/style/table/Table'
import TableContainer from '../../components/HOC/style/table/TableContainer'
import Pagination from '../../components/common/table/Pagination'
import TableAction from '../../components/common/table/TableAction'
import TableEmptyRows from '../../components/common/table/TableEmptyRows'
import TableHeader from '../../components/common/table/TableHeader'
import TableNoData from '../../components/common/table/TableNoData'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import TableBodyLoading from '../../components/loading/table/TableBodyLoading'
import ArchiveScheduleTableRow from '../../components/pages/archiveSchedule/ArchiveScheduleTableRow'
import ArchiveScheduleTableToolbar from '../../components/pages/archiveSchedule/ArchiveScheduleTableToolbar'
import useAlert from '../../hooks/useAlert'
import useTable, { emptyRows } from '../../hooks/useTable'
import useUpdateRouteQueryWithReplace from '../../hooks/useUpdateRouteQueryWithReplace'
import routeProperty from '../../routes/routeProperty'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleFilterInputChange } from '../../types/components/common'
import { ITableHead } from '../../types/components/table'
import {
  IArchiveScheduleApiQueryParams,
  IArchiveScheduleFilters,
  IArchiveScheduleResult,
  IArchiveScheduleRouteQueryParams,
} from '../../types/pages/archiveSchedule'
import { IListServerResponse } from '../../types/pages/common'
import { addIcon, deleteIcon, filterIcon } from '../../utils/icons'
import t from '../../utils/translator'

const TABLE_HEAD: ITableHead[] = [
  { id: 'ArchiveNo', label: t`Archive No`, filter: true },
  { id: 'ArchiveName', label: t`Archive Name`, filter: true },
  { id: 'ArchiveDesc', label: t`Description`, filter: true },
  { id: 'Media', label: t`Media`, filter: true },
  { id: 'UsageBased', label: t`Usage Based`, filter: true },
  { id: 'UsagePercent', label: t`Usage Percent`, filter: true },
  { id: 'ScheduleNo', label: t`Schedule`, filter: true },
  { id: 'ArchiveTime', label: t`Archive Time`, filter: true },
]

function ArchiveSchedule() {
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
  // hook to update the query in the URL
  const updateRouteQueryWithReplace = useUpdateRouteQueryWithReplace()
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // apply property use for apply filter. filter will apply when apply is true
  const initialFilterState: IArchiveScheduleFilters = {
    Apply: false,
    ArchiveNo: '',
    ArchiveName: '',
    Media: null,
  }

  // state to store the filter values
  const [filterState, setFilterState] = useState(initialFilterState)

  // state for show and hide list filter section
  const [filterOpen, setFilterOpen] = useState(false)

  // ref to store the applied filter values
  const filterStateRef = useRef(filterState)

  const handleFilterInputChange: THandleFilterInputChange = (name, value) => {
    // apply will false in every filter state change
    setFilterState((state) => ({ ...state, Apply: false, [name]: value }))
  }

  // update filter state in the URL when filter state is apply or reset
  const updateFilterStateToQuery = () => {
    handleChangePage(1)

    const queryParams: IArchiveScheduleRouteQueryParams = {
      Page: 1,
      ArchiveNo: filterStateRef.current.ArchiveNo,
      ArchiveName: filterStateRef.current.ArchiveName,
      MediaValue: filterStateRef.current.Media?.value,
      MediaLabel: filterStateRef.current.Media?.label,
    }

    updateRouteQueryWithReplace({
      pathName: location.pathname,
      query: queryParams,
    })
  }

  // handle the apply button for the filters
  const handleFilterApply = () => {
    // on filter apply filterStateRef update to filter current state
    filterStateRef.current = filterState
    updateFilterStateToQuery()
    handleFilterInputChange('Apply', true)
  }

  // handle the reset button for the filters
  const handleFilterStateReset = () => {
    // on filter apply filterStateRef update to initial filter state
    filterStateRef.current = initialFilterState
    updateFilterStateToQuery()
    setFilterState(initialFilterState)
    mutate(undefined, true)
  }

  // in route change or reload - filter state update by query value and apply to filter
  useEffect(() => {
    const queryParse = QueryString.parse(location.search)

    const queryState: IArchiveScheduleFilters = {
      ArchiveNo: typeof queryParse.ArchiveNo === 'string' ? queryParse.ArchiveNo : '',
      ArchiveName: typeof queryParse.ArchiveName === 'string' ? queryParse.ArchiveName : '',
      Media:
        typeof queryParse.MediaValue === 'string' && typeof queryParse.MediaLabel === 'string'
          ? {
            label: queryParse.MediaLabel,
            value: queryParse.MediaValue,
          }
          : null,
      Apply: true,
    }

    setFilterState(queryState)
    filterStateRef.current = queryState
  }, [location.search, location.pathname])

  // query object of pagination, sorting, filtering
  const apiQueryParams: IArchiveScheduleApiQueryParams = {
    offset: (page - 1) * rowsPerPage,
    limit: rowsPerPage,
    sort_by: orderBy,
    order,
    ...(filterStateRef.current.ArchiveNo && {
      ArchiveNo: filterStateRef.current.ArchiveNo,
    }),
    ...(filterStateRef.current.ArchiveName && {
      ArchiveName_icontains: filterStateRef.current.ArchiveName,
    }),
    ...(filterStateRef.current.Media?.value && {
      Media: filterStateRef.current.Media.value,
    }),
  }

  const apiQueryString = QueryString.stringify(apiQueryParams)

  const { isLoading, data, mutate } = useSWR<IListServerResponse<IArchiveScheduleResult[]>>(
    archiveScheduleApi.list(apiQueryString)
  )

  // Define the mutation function to delete all selected partition from the server
  const { trigger: multipleDeleteTrigger } = useSWRMutation(
    archiveScheduleApi.deleteMultiple,
    sendMultiDeleteRequest,
    {
      // Reload list data on successful delete
      onSuccess: () => {
        mutate()
        handleSelectAllRow(false, [])
      },
    }
  )

  const handleDeleteMultiple = () => {
    const requestData = { ids: selected }
    // const requestConfig: AxiosRequestConfig = {
    //     data: requestData,
    // };

    if (requestData.ids.length) {
      const handleDelete = () => {
        return multipleDeleteTrigger({
          data: requestData,
        })
      }

      openAlertDialogWithPromise(handleDelete, { success: t`Success` }, t`Do you want to Delete ?`)
    }
  }

  //Change add position and add delete icon(modify breadcrumbsActions position also and added delete  button disablity when not selected any row).--rubel

  const breadcrumbsActions: IActionsButton[] = [
    {
      icon: filterIcon,
      text: t`Filter`,
      onClick: () => setFilterOpen((prevSate) => !prevSate),
    },
    {
      icon: addIcon,
      text: t`Add`,
      link: routeProperty.archiveScheduleCreate.path(),
    },
    {
      icon: deleteIcon,
      text: t`Delete`,
      onClick: handleDeleteMultiple,
      disabled: selected.length === 0,
    },
  ]

  // const tableActions: ITableAction[] = [
  //   {
  //     icon: deleteIcon,
  //     tooltip: 'Delete',
  //     onClick: handleDeleteMultiple,
  //   },
  // ]

  const isNotFound = !data?.data.length && !isLoading

  return (
    <Page title={t`Archive Schedule List`}>
      <Breadcrumbs />
      <TableContainer>
        {filterOpen && (
          <ArchiveScheduleTableToolbar
            filterState={filterState}
            handleFilterStateReset={handleFilterStateReset}
            handleFilterApply={handleFilterApply}
            handleInputChange={handleFilterInputChange}
          />
        )}
        <TableAction breadcrumbsActions={breadcrumbsActions} numSelected={selected.length} />
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
                  data?.data.map((result) => result.ArchiveNo.toString())
                )
              }
            }}
            headerData={TABLE_HEAD}
          />
          <tbody className="divide-y divide-gray-200">
            {!isLoading && (
              <>
                {data?.data.map((row) => (
                  <ArchiveScheduleTableRow
                    key={row.ArchiveNo}
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

export default ArchiveSchedule
