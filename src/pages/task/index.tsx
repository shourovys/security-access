import QueryString from 'qs'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendMultiDeleteRequest } from '../../api/swrConfig'
import { taskApi } from '../../api/urls'
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
import TaskTableRow from '../../components/pages/task/TaskTableRow'
import TaskTableToolbar from '../../components/pages/task/TaskTableToolbar'
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
  ITaskApiQueryParams,
  ITaskFilters,
  ITaskResult,
  ITaskRouteQueryParams,
} from '../../types/pages/task'
import { addIcon, deleteIcon, filterIcon } from '../../utils/icons'
import t from '../../utils/translator'

function Task() {
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
  } = useTable({ defaultOrderBy: 'TaskNo' })
  // hook to update the query in the URL
  const updateRouteQueryWithReplace = useUpdateRouteQueryWithReplace()
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  const TABLE_HEAD: ITableHead[] = [
    { id: 'TaskNo', label: t`Task No`, filter: true },
    ...(showPartition ? [{ id: 'PartitionNo', label: t`Partition`, filter: true }] : []),
    { id: 'TaskName', label: t`Task Name`, filter: true },
    { id: 'TaskDesc', label: t`Description`, filter: true },
    { id: 'ActionType', label: t`Action Type`, filter: true },
  ]

  // apply property use for apply filter. filter will apply when apply is true
  const initialFilterState: ITaskFilters = {
    Apply: false,
    TaskNo: '',
    TaskName: '',
    Partition: null,
    ActionType: null,
  }

  // state to store the filter values
  const [filterState, setFilterState] = useState(initialFilterState)

  // ref to store the applied filter values
  const filterStateRef = useRef(filterState)

  // state for show and hide list filter section
  const [filterOpen, setFilterOpen] = useState(false)

  const handleFilterInputChange: THandleFilterInputChange = (name, value) => {
    // apply will false in every filter state change
    setFilterState((state) => ({ ...state, Apply: false, [name]: value }))
  }

  // update filter state in the URL when filter state is apply or reset
  const updateFilterStateToQuery = () => {
    handleChangePage(1)

    const queryParams: ITaskRouteQueryParams = {
      page: 1,
      TaskNo: filterStateRef.current.TaskNo,
      TaskName: filterStateRef.current.TaskName,
      PartitionValue: filterStateRef.current.Partition?.value,
      PartitionLabel: filterStateRef.current.Partition?.label,
      ActionTypeValue: filterStateRef.current.ActionType?.value,
      ActionTypeLabel: filterStateRef.current.ActionType?.label,
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

    const queryState: ITaskFilters = {
      TaskNo: typeof queryParse.TaskNo === 'string' ? queryParse.TaskNo : '',
      TaskName: typeof queryParse.TaskName === 'string' ? queryParse.TaskName : '',
      Partition:
        typeof queryParse.PartitionValue === 'string' &&
        typeof queryParse.PartitionLabel === 'string'
          ? {
              label: queryParse.PartitionLabel,
              value: queryParse.PartitionValue,
            }
          : null,
      ActionType:
        typeof queryParse.ActionTypeValue === 'string' &&
        typeof queryParse.ActionTypeLabel === 'string'
          ? {
              label: queryParse.ActionTypeLabel,
              value: queryParse.ActionTypeValue,
            }
          : null,
      Apply: true,
    }

    setFilterState(queryState)
    filterStateRef.current = queryState
  }, [location.search, location.pathname])

  // create the query object for the API call
  const apiQueryParams: ITaskApiQueryParams = {
    offset: (page - 1) * rowsPerPage,
    limit: rowsPerPage,
    sort_by: orderBy,
    order,
    ...(filterStateRef.current.TaskNo && {
      TaskNo: filterStateRef.current.TaskNo,
    }),
    ...(filterStateRef.current.TaskName && {
      TaskName_icontains: filterStateRef.current.TaskName,
    }),
    ...(filterStateRef.current.Partition?.value && {
      Partition: filterStateRef.current.Partition.value,
    }),
    ...(filterStateRef.current.ActionType?.value && {
      ActionType: filterStateRef.current.ActionType.value,
    }),
  }

  const apiQueryString = QueryString.stringify(apiQueryParams)

  const { isLoading, data, mutate } = useSWR<IListServerResponse<ITaskResult[]>>(
    taskApi.list(apiQueryString)
  )

  // Define the mutation function to delete all selected partition from the server
  const { trigger: multipleDeleteTrigger } = useSWRMutation(
    taskApi.deleteMultiple,
    sendMultiDeleteRequest,
    {
      // refetch list data on successful delete
      onSuccess: () => {
        handleSelectAllRow(false, [])
        mutate()
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
  //   taskApi.export,
  //   fetcher,
  //   {
  //     onSuccess: (csvData) => {
  //       downloadCsv(csvData, location)
  //     },
  //   }
  // )

  //Change add position and add delete icon(modify breadcrumbsActions position also).--rubel

  const breadcrumbsActions: IActionsButton[] = [
    // {
    //   color: 'csv',
    //   icon: csvIcon,
    //   text: t`CSV`,
    //   onClick: () => {
    //     csvDataTrigger()
    //   },
    //   isLoading: csvDataLoading,
    // },
    {
      icon: filterIcon,
      text: t`Filter`,
      onClick: () => setFilterOpen((prevSate) => !prevSate),
    },
    {
      icon: addIcon,
      text: t`Add`,
      link: routeProperty.taskCreate.path(),
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
    <Page>
      <Breadcrumbs />
      <TableContainer>
        {filterOpen && (
          <TaskTableToolbar
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
                  data?.data.map((result) => result.TaskNo.toString())
                )
              }
            }}
            headerData={TABLE_HEAD}
          />
          <tbody className="divide-y divide-gray-200">
            {!isLoading && (
              <>
                {data?.data.map((row) => (
                  <TaskTableRow
                    key={row.TaskNo}
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

export default Task
