import { fetcher, sendPostRequest } from '../../api/swrConfig'
import { elevatorApi } from '../../api/urls'
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
import ElevatorTableRow from '../../components/pages/elevator/ElevatorTableRow'
import ElevatorTableToolbar from '../../components/pages/elevator/ElevatorTableToolbar'
import useAlert from '../../hooks/useAlert'
import useTable, { emptyRows } from '../../hooks/useTable'
import useUpdateRouteQueryWithReplace from '../../hooks/useUpdateRouteQueryWithReplace'
import QueryString from 'qs'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import routeProperty from '../../routes/routeProperty'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { IActionButtonsGroup, IActionsButton } from '../../types/components/actionButtons'
import { THandleFilterInputChange } from '../../types/components/common'
import { ITableAction, ITableHead } from '../../types/components/table'
import { IListServerResponse } from '../../types/pages/common'
import {
  IElevatorApiQueryParams,
  IElevatorFilters,
  IElevatorResult,
  IElevatorRouteQueryParams,
} from '../../types/pages/elevator'
import downloadCsv from '../../utils/downloadCsv'
import {
  csvIcon,
  groupEditIcon,
  lockDownIcon,
  normalIcon,
  passthruIcon,
  filterIcon,
} from '../../utils/icons'
import t from '../../utils/translator'
import useAuth from '../../hooks/useAuth'

function Elevator() {
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
  } = useTable({ defaultOrderBy: 'ElevatorNo' })
  // hook to update the query in the URL
  const updateRouteQueryWithReplace = useUpdateRouteQueryWithReplace()
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  const TABLE_HEAD: ITableHead[] = [
    { id: 'ElevatorNo', label: t`Elevator No`, filter: true },
    ...(showPartition ? [{ id: 'PartitionNo', label: t`Partition`, filter: true }] : []),
    { id: 'ElevatorName', label: t`Elevator Name`, filter: true },
    { id: 'ElevatorDesc', label: t`Description`, filter: true },
    { id: 'NodeNo', label: t`Node`, filter: true },
    { id: 'ElevatorStat', label: t`Elevator Stat`, filter: true },
  ]

  // apply property use for apply filter. filter will apply when apply is true
  const initialFilterState: IElevatorFilters = {
    Apply: false,
    ElevatorNo: '',
    ElevatorName: '',
    Partition: null,
    Node: null,
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

    const queryParams: IElevatorRouteQueryParams = {
      page: 1,
      ElevatorNo: filterStateRef.current.ElevatorNo,
      ElevatorName: filterStateRef.current.ElevatorName,
      PartitionValue: filterStateRef.current.Partition?.value,
      PartitionLabel: filterStateRef.current.Partition?.label,
      NodeValue: filterStateRef.current.Node?.value,
      NodeLabel: filterStateRef.current.Node?.label,
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

  // In the route change or reload - filter state update by query value and apply to filter
  useEffect(() => {
    const queryParse = QueryString.parse(location.search)

    const queryState: IElevatorFilters = {
      ElevatorNo: typeof queryParse.ElevatorNo === 'string' ? queryParse.ElevatorNo : '',
      ElevatorName: typeof queryParse.ElevatorName === 'string' ? queryParse.ElevatorName : '',
      Partition:
        typeof queryParse.PartitionValue === 'string' &&
        typeof queryParse.PartitionLabel === 'string'
          ? {
              label: queryParse.PartitionLabel,
              value: queryParse.PartitionValue,
            }
          : null,
      Node:
        typeof queryParse.NodeValue === 'string' && typeof queryParse.NodeLabel === 'string'
          ? {
              label: queryParse.NodeLabel,
              value: queryParse.NodeValue,
            }
          : null,
      Apply: true,
    }

    setFilterState(queryState)
    filterStateRef.current = queryState
  }, [location.search, location.pathname])

  // create the query object for the API call
  const apiQueryParams: IElevatorApiQueryParams = {
    offset: (page - 1) * rowsPerPage,
    limit: rowsPerPage,
    sort_by: orderBy,
    order,
    ...(filterStateRef.current.ElevatorNo && {
      ElevatorNo: filterStateRef.current.ElevatorNo,
    }),
    ...(filterStateRef.current.ElevatorName && {
      ElevatorName_icontains: filterStateRef.current.ElevatorName,
    }),
    ...(filterStateRef.current.Partition?.value && {
      PartitionNo: filterStateRef.current.Partition.value,
    }),
    ...(filterStateRef.current.Node?.value && {
      NodeNo: filterStateRef.current.Node.value,
    }),
  }

  const apiQueryString = QueryString.stringify(apiQueryParams)

  const { isLoading, data, mutate } = useSWR<IListServerResponse<IElevatorResult[]>>(
    elevatorApi.list(apiQueryString)
  )

  // mutation for fetch csv data from server and call downloadCsc
  // const { trigger: csvDataTrigger, isMutating: csvDataLoading } = useSWRMutation(
  //   elevatorApi.export,
  //   fetcher,
  //   {
  //     onSuccess: (csvData) => {
  //       downloadCsv(csvData, location)
  //     },
  //   }
  // )

  // const breadcrumbsActions: IActionsButton[] = [
  //   // {
  //   //   color: 'csv',
  //   //   icon: csvIcon,
  //   //   text: t`CSV`,
  //   //   onClick: () => csvDataTrigger(),
  //   //   isLoading: csvDataLoading,
  //   // },
  // ]

  // Define the mutation function to update elevator status (Normal, Passthru, Lockdown) all selected elevator
  const { trigger: elevatorStatusTrigger } = useSWRMutation(elevatorApi.action, sendPostRequest, {
    onSuccess: () => {
      handleSelectAllRow(false, [])
      mutate()
    },
  })

  const handleOutputStatus = (elevatorStatus: 'Normal' | 'Passthru' | 'Lockdown') => {
    if (selected.length) {
      const handleStatusTrigger = () =>
        elevatorStatusTrigger({
          ElevatorNos: selected,
          Action: elevatorStatus,
        })

      openAlertDialogWithPromise(
        handleStatusTrigger,
        // { success: t`Elevator ${elevatorStatus} Status Update successful` },
        { success: t`Success` },
        t`Do you want to change Elevator Stat to ${elevatorStatus} ?`
        // t`Do you want to update elevator status to ${elevatorStatus} for the selected elevator?`
      )
    }
  }
  const tableActions: IActionButtonsGroup = {
    Modify: [
      {
        icon: filterIcon,
        text: t`Filter`,
        onClick: () => setFilterOpen((prevSate) => !prevSate),
      },
      {
        text: t`Group edit`,
        icon: groupEditIcon,
        // tooltip: 'Group edit',
        link: routeProperty.elevatorGroupEdit.path(selected.join(',')),
        disabled: selected.length === 0,
      },
    ],
    Control: [
      {
        // color: 'danger',
        text: t`Normal`,
        icon: normalIcon,
        // tooltip: 'Normal',
        onClick: () => handleOutputStatus('Normal'),
        disabled: selected.length === 0,
      },
      {
        text: t`Passthru`,
        icon: passthruIcon,
        // tooltip: 'Passthru',
        onClick: () => handleOutputStatus('Passthru'),
        disabled: selected.length === 0,
      },
      {
        text: t`Lockdown`,
        icon: lockDownIcon,
        // tooltip: 'Lockdown',
        onClick: () => handleOutputStatus('Lockdown'),
        disabled: selected.length === 0,
      },
    ],
  }

  const isNotFound = !data?.data.length && !isLoading

  return (
    <Page>
      <Breadcrumbs />
      <TableContainer>
        {filterOpen && (
          <ElevatorTableToolbar
            filterState={filterState}
            handleFilterStateReset={handleFilterStateReset}
            handleFilterApply={handleFilterApply}
            handleInputChange={handleFilterInputChange}
          />
        )}
        <TableAction groupActions={tableActions} numSelected={selected.length} />
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
                  data?.data.map((result) => result.ElevatorNo.toString())
                )
              }
            }}
            headerData={TABLE_HEAD}
          />
          <tbody className="divide-y divide-gray-200">
            {!isLoading && (
              <>
                {data?.data.map((row) => (
                  <ElevatorTableRow
                    key={row.ElevatorNo}
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

export default Elevator
