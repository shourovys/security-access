import { fetcher, sendPostRequest } from '../../api/swrConfig'
import { relayApi } from '../../api/urls'
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
import RelayTableRow from '../../components/pages/relay/RelayTableRow'
import RelayTableToolbar from '../../components/pages/relay/RelayTableToolbar'
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
import { IRelayApiQueryParams, IRelayFilters, IRelayResult } from '../../types/pages/relay'
import downloadCsv from '../../utils/downloadCsv'
import {
  activeIcon,
  autoIcon,
  csvIcon,
  groupEditIcon,
  inactiveIcon,
  filterIcon,
} from '../../utils/icons'
import t from '../../utils/translator'
import useAuth from '../../hooks/useAuth'

function Relay() {
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
  } = useTable({ defaultOrderBy: 'RelayNo' })
  // hook to update the query in the URL
  const updateRouteQueryWithReplace = useUpdateRouteQueryWithReplace()
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  const TABLE_HEAD: ITableHead[] = [
    { id: 'RelayNo', label: t`Relay No`, filter: true },
    ...(showPartition ? [{ id: 'PartitionNo', label: t`Partition`, filter: true }] : []),
    { id: 'RelayName', label: t`Relay Name`, filter: true },
    { id: 'RelayDesc', label: t`Description`, filter: true },
    { id: 'NodeNo', label: t`Node`, filter: true },
    { id: 'RelayPort', label: t`Relay Port`, filter: true },
    { id: 'ElevatorNo', label: t`Elevator`, filter: true },
    { id: 'RelayType', label: t`Relay Type`, filter: true },
    { id: 'RelayStat', label: t`Relay Stat`, filter: true },
  ]

  // apply property use for apply filter. filter will apply when apply is true
  const initialFilterState: IRelayFilters = {
    Apply: false,
    RelayNo: '',
    RelayName: '',
    Partition: null,
    Node: null,
    Elevator: null,
  }
  // state to store the filter values
  const [filterState, setFilterState] = useState(initialFilterState)
  // ref to store the applied filter values
  const filterStateRef = useRef(filterState)

  // state for show and hide list filter section
  const [filterOpen, setFilterOpen] = useState(false)

  const handleFilterInputChange: THandleFilterInputChange = (name, value) => {
    // apply will be false in every filter state change
    setFilterState((state) => ({ ...state, Apply: false, [name]: value }))
  }

  // update filter state in the URL when filter state is applied or reset
  const updateFilterStateToQuery = () => {
    handleChangePage(1)

    updateRouteQueryWithReplace({
      pathName: location.pathname,
      query: {
        page: 1,
        RelayNo: filterStateRef.current.RelayNo,
        RelayName: filterStateRef.current.RelayName,
        PartitionValue: filterStateRef.current.Partition?.value,
        PartitionLabel: filterStateRef.current.Partition?.label,
        NodeValue: filterStateRef.current.Node?.value,
        NodeLabel: filterStateRef.current.Node?.label,
        ElevatorValue: filterStateRef.current.Elevator?.value,
        ElevatorLabel: filterStateRef.current.Elevator?.label,
      },
    })
  }

  // handle the apply button for the filters
  const handleFilterApply = () => {
    // on filter apply, filterStateRef updates to the current filter state
    filterStateRef.current = filterState
    updateFilterStateToQuery()
    handleFilterInputChange('apply', true)
  }

  // handle the reset button for the filters
  const handleFilterStateReset = () => {
    // on filter reset, filterStateRef updates to the initial filter state
    filterStateRef.current = initialFilterState
    updateFilterStateToQuery()
    setFilterState(initialFilterState)
    mutate(undefined, true)
  }

  // on route change or reload - filter state updates by query values and applies the filter
  useEffect(() => {
    const queryParse = QueryString.parse(location.search)

    const queryState: IRelayFilters = {
      RelayNo: typeof queryParse.RelayNo === 'string' ? queryParse.RelayNo : '',
      RelayName: typeof queryParse.RelayName === 'string' ? queryParse.RelayName : '',
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
      Elevator:
        typeof queryParse.ElevatorValue === 'string' && typeof queryParse.ElevatorLabel === 'string'
          ? {
              label: queryParse.ElevatorLabel,
              value: queryParse.ElevatorValue,
            }
          : null,
      Apply: true,
    }
    setFilterState(queryState)
    filterStateRef.current = queryState
  }, [location.search, location.pathname])

  // create the query object for the API call
  const apiQueryParams: IRelayApiQueryParams = {
    offset: (page - 1) * rowsPerPage,
    limit: rowsPerPage,
    sort_by: orderBy,
    order,
    ...(filterStateRef.current.RelayNo && { RelayNo: filterStateRef.current.RelayNo }),
    ...(filterStateRef.current.RelayName && {
      RelayName_icontains: filterStateRef.current.RelayName,
    }),
    ...(filterStateRef.current.Partition?.value && {
      PartitionNo: filterStateRef.current.Partition.value,
    }),
    ...(filterStateRef.current.Node?.value && { NodeNo: filterStateRef.current.Node.value }),
    ...(filterStateRef.current.Elevator?.value && {
      ElevatorNo: filterStateRef.current.Elevator.value,
    }),
  }

  const apiQueryString = QueryString.stringify(apiQueryParams)

  const { isLoading, data, mutate } = useSWR<IListServerResponse<IRelayResult[]>>(
    relayApi.list(apiQueryString)
  )

  // mutation for fetch csv data from server and call downloadCsc
  // const { trigger: csvDataTrigger, isMutating: csvDataLoading } = useSWRMutation(
  //   relayApi.export,
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
  //   //   onClick: () => {
  //   //     csvDataTrigger()
  //   //   },
  //   //   isLoading: csvDataLoading,
  //   // },
  // ]

  // Define the mutation function to update relay status (Inactive, Active, Auto) all selected relay
  const { trigger: relayStatusTrigger } = useSWRMutation(relayApi.action, sendPostRequest, {
    onSuccess: () => {
      handleSelectAllRow(false, [])
      mutate()
    },
  })

  const handleRelayStatus = (relayStatus: 'Inactive' | 'Active' | 'Auto') => {
    if (selected.length) {
      const handleStatusTrigger = () =>
        relayStatusTrigger({
          RelayNos: selected,
          Action: relayStatus,
        })

      openAlertDialogWithPromise(
        handleStatusTrigger,
        // { success: `Relay ${relayStatus} Status Update successful` },
        { success: t`Success` },
        t`Do you want to ${relayStatus} ?`
        // `Do you really want to update relay status to ${relayStatus} for the selected relay?`
        // `Do you really want to change ?`
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
        link: routeProperty.relayGroupEdit.path(selected.join(',')),
        disabled: selected.length === 0,
      },
    ],
    Control: [
      {
        text: t`Inactive`,
        icon: inactiveIcon,
        // tooltip: 'Inactive',
        onClick: () => handleRelayStatus('Inactive'),
        disabled: selected.length === 0,
      },
      {
        text: t`Active`,
        icon: activeIcon,
        // tooltip: 'Active',
        onClick: () => handleRelayStatus('Active'),
        disabled: selected.length === 0,
      },
      {
        text: t`Auto`,
        icon: autoIcon,
        // tooltip: 'Auto',
        onClick: () => handleRelayStatus('Auto'),
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
          <RelayTableToolbar
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
                  data?.data.map((result) => result.RelayNo.toString())
                )
              }
            }}
            headerData={TABLE_HEAD}
          />
          <tbody className="divide-y divide-gray-200">
            {!isLoading && (
              <>
                {data?.data.map((row) => (
                  <RelayTableRow
                    key={row.RelayNo}
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

export default Relay
