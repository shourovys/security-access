import { useEffect, useRef, useState } from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import QueryString from 'qs'
import { useLocation } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendMultiDeleteRequest } from '../../api/swrConfig'
import { viewApi } from '../../api/urls'
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
import ViewTableRow from '../../components/pages/view/ViewTableRow'
import ViewTableToolbar from '../../components/pages/view/ViewTableToolbar'
import useAlert from '../../hooks/useAlert'
import useAuth from '../../hooks/useAuth'
import useTable, { emptyRows } from '../../hooks/useTable'
import useUpdateRouteQueryWithReplace from '../../hooks/useUpdateRouteQueryWithReplace'
import routeProperty from '../../routes/routeProperty'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleFilterInputChange } from '../../types/components/common'
import { ITableHead } from '../../types/components/table'
import { IListServerResponse } from '../../types/pages/common'
import {
  IViewApiQueryParams,
  IViewFilters,
  IViewResult,
  IViewRouteQueryParams,
} from '../../types/pages/view'
import { addIcon, deleteIcon, filterIcon } from '../../utils/icons'
import t from '../../utils/translator'

function View() {
  const location = useLocation()
  const { showPartition } = useAuth()

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
  } = useTable({ defaultOrderBy: 'ViewNo' })
  // hook to update the query in the URL
  const updateRouteQueryWithReplace = useUpdateRouteQueryWithReplace()
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  const TABLE_HEAD: ITableHead[] = [
    { id: 'ViewNo', label: t`View No`, filter: true },
    ...(showPartition ? [{ id: 'PartitionNo', label: t`Partition`, filter: true }] : []),
    { id: 'ViewName', label: t`View Name`, filter: true },
    { id: 'ViewDesc', label: t`Description`, filter: true },
  ]
  // apply property used for applying filters. Filters will be applied when apply is true
  const initialFilterState: IViewFilters = {
    Apply: false,
    ViewNo: '',
    ViewName: '',
    Partition: null,
  }

  // state to store the filter values
  const [filterState, setFilterState] = useState(initialFilterState)

  // ref to store the applied filter values
  const filterStateRef = useRef(filterState)

  // state for show and hide list filter section
  const [filterOpen, setFilterOpen] = useState(false)

  const handleFilterInputChange: THandleFilterInputChange = (name, value) => {
    // apply will be false on every filter state change
    setFilterState((state) => ({ ...state, Apply: false, [name]: value }))
  }

  // update filter state in the URL when filter state is applied or reset
  const updateFilterStateToQuery = () => {
    handleChangePage(1)

    const queryParams: IViewRouteQueryParams = {
      page: 1,
      ViewNo: filterStateRef.current.ViewNo,
      ViewName: filterStateRef.current.ViewName,
      PartitionValue: filterStateRef.current.Partition?.value,
      PartitionLabel: filterStateRef.current.Partition?.label,
    }

    updateRouteQueryWithReplace({
      pathName: location.pathname,
      query: queryParams,
    })
  }

  // handle the apply button for the filters
  const handleFilterApply = () => {
    // on filter apply, filterStateRef is updated to the current filter state
    filterStateRef.current = filterState
    updateFilterStateToQuery()
    handleFilterInputChange('Apply', true)
  }

  // handle the reset button for the filters
  const handleFilterStateReset = () => {
    // on filter reset, filterStateRef is updated to the initial filter state
    filterStateRef.current = initialFilterState
    updateFilterStateToQuery()
    setFilterState(initialFilterState)
    mutate(undefined, true)
  }

  // on route change or reload - filter state is updated based on the query value and applied to filter
  useEffect(() => {
    const queryParse = QueryString.parse(location.search)

    const queryState: IViewFilters = {
      ViewNo: typeof queryParse.ViewNo === 'string' ? queryParse.ViewNo : '',
      ViewName: typeof queryParse.ViewName === 'string' ? queryParse.ViewName : '',
      Partition:
        typeof queryParse.PartitionValue === 'string' &&
        typeof queryParse.PartitionLabel === 'string'
          ? {
              label: queryParse.PartitionLabel,
              value: queryParse.PartitionValue,
            }
          : null,
      Apply: true,
    }

    setFilterState(queryState)
    filterStateRef.current = queryState
  }, [location.search, location.pathname])

  // query object for pagination, sorting, and filtering
  const apiQueryParams: IViewApiQueryParams = {
    offset: (page - 1) * rowsPerPage,
    limit: rowsPerPage,
    sort_by: orderBy,
    order,
    ...(filterStateRef.current.ViewNo && {
      ViewNo: filterStateRef.current.ViewNo,
    }),
    ...(filterStateRef.current.ViewName && {
      ViewName_icontains: filterStateRef.current.ViewName,
    }),
    ...(filterStateRef.current.Partition?.value && {
      PartitionNo: filterStateRef.current.Partition.value,
    }),
  }

  const apiQueryString = QueryString.stringify(apiQueryParams)
  //here added (mutate) after (data) --rubel
  const { isLoading, data, mutate } = useSWR<IListServerResponse<IViewResult[]>>(
    viewApi.list(apiQueryString)
  )

  // Define the mutation function to delete all selected partition from the server
  const { trigger: multipleDeleteTrigger } = useSWRMutation(
    viewApi.deleteMultiple,
    sendMultiDeleteRequest,
    {
      // Refetch list on successful delete
      onSuccess: () => {
        handleSelectAllRow(false, [])
        mutate() //here added mutate() for redirect page --rubel
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

  // mutation for fetch csv data from server and call downloadCsc
  // const { trigger: csvDataTrigger, isMutating: csvDataLoading } = useSWRMutation(
  //   viewApi.export,
  //   fetcher,
  //   {
  //     onSuccess: (csvData) => {
  //       downloadCsv(csvData, location)
  //     },
  //   }
  // )

  //Change add position and add delete icon(modify breadcrumbsActions position also).--rubel
  const breadcrumbsActions: IActionsButton[] = [
    {
      icon: filterIcon,
      text: t`Filter`,
      onClick: () => setFilterOpen((prevSate) => !prevSate),
    },

    {
      icon: addIcon,
      text: t`Add`,
      link: routeProperty.viewCreate.path(),
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
    <Page title={t`View List`}>
      <Breadcrumbs />
      <TableContainer>
        {filterOpen && (
          <ViewTableToolbar
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
                  data?.data.map((result) => result.ViewNo.toString())
                )
              }
            }}
            headerData={TABLE_HEAD}
          />
          <tbody className="divide-y divide-gray-200">
            {!isLoading && (
              <>
                {data?.data.map((row) => (
                  <ViewTableRow
                    key={row.ViewNo}
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

export default View
