import { fetcher, sendPostRequest } from '../../api/swrConfig'
import { doorApi } from '../../api/urls'
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
import DoorTableRow from '../../components/pages/door/DoorTableRow'
import DoorTableToolbar from '../../components/pages/door/DoorTableToolbar'
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
  IDoorApiQueryParams,
  IDoorFilters,
  IDoorResult,
  IDoorRouteQueryParams,
} from '../../types/pages/door'
import downloadCsv from '../../utils/downloadCsv'
import {
  applyIcon,
  csvIcon,
  groupEditIcon,
  lockDownIcon,
  lockDownWithRexIcon,
  lockIcon,
  mUnlockIcon,
  passthruIcon,
  provIcon,
  unlockIcon,
  filterIcon,
} from '../../utils/icons'
import t from '../../utils/translator'
import useAuth from '../../hooks/useAuth'

function Door() {
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
  } = useTable({ defaultOrderBy: 'DoorNo' })
  // hook to update the query in the URL
  const updateRouteQueryWithReplace = useUpdateRouteQueryWithReplace()
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  const TABLE_HEAD: ITableHead[] = [
    { id: 'DoorNo', label: t`Door No`, filter: true },
    ...(showPartition ? [{ id: 'PartitionNo', label: t`Partition`, filter: true }] : []),
    { id: 'DoorName', label: t`Door Name`, filter: true },
    { id: 'DoorDesc', label: t`Description`, filter: true },
    { id: 'NodeNo', label: t`Node`, filter: true },
    { id: 'DoorPort', label: t`Door Port`, filter: true },
    { id: 'DoorStat', label: t`Door Stat`, filter: true },
    { id: 'LockStat', label: t`Lock Stat`, filter: true },
    { id: 'ContactStat', label: t`Contact Stat`, filter: true },
    { id: 'AlertStat', label: t`Alert Stat`, filter: true },
  ]

  // apply property use for apply filter. filter will apply when apply is true
  const initialFilterState: IDoorFilters = {
    Apply: false,
    DoorNo: '',
    DoorName: '',
    Partition: null,
    Node: null,
  }

  // state to store the filter values
  const [filterState, setFilterState] = useState(initialFilterState)

  // ref to store the applied filter values
  const filterStateRef = useRef<IDoorFilters>(filterState)

  // state for show and hide list filter section
  const [filterOpen, setFilterOpen] = useState(false)

  const handleFilterInputChange: THandleFilterInputChange = (name, value) => {
    // apply will false in every filter state change
    setFilterState((state) => ({ ...state, Apply: false, [name]: value }))
  }

  // update filter state in the URL when filter state is apply or reset
  const updateFilterStateToQuery = () => {
    handleChangePage(1)

    const queryParams: IDoorRouteQueryParams = {
      page: 1,
      DoorNo: filterStateRef.current.DoorNo,
      DoorName: filterStateRef.current.DoorName,
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
    // window.location.href = '/door'
    mutate(undefined, true)
  }

  // in route change or reload - filter state update by query value and apply to filter
  useEffect(() => {
    const queryParse = QueryString.parse(location.search)

    const queryState: IDoorFilters = {
      DoorNo: typeof queryParse.DoorNo === 'string' ? queryParse.DoorNo : '',
      DoorName: typeof queryParse.DoorName === 'string' ? queryParse.DoorName : '',
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
  const apiQueryParams: IDoorApiQueryParams = {
    offset: (page - 1) * rowsPerPage,
    limit: rowsPerPage,
    sort_by: orderBy,
    order: order,
    ...(filterStateRef.current.DoorNo && {
      DoorNo: filterStateRef.current.DoorNo,
    }),
    ...(filterStateRef.current.DoorName && {
      DoorName_icontains: filterStateRef.current.DoorName,
    }),
    ...(filterStateRef.current.Partition?.value && {
      PartitionNo: filterStateRef.current.Partition.value,
    }),
    ...(filterStateRef.current.Node?.value && {
      NodeNo: filterStateRef.current.Node.value,
    }),
  }

  const apiQueryString = QueryString.stringify(apiQueryParams)

  const { isLoading, data, mutate } = useSWR<IListServerResponse<IDoorResult[]>>(
    doorApi.list(apiQueryString)
  )

  // mutation for fetch csv data from server and call downloadCsc
  // const { trigger: csvDataTrigger, isMutating: csvDataLoading } = useSWRMutation(
  //   doorApi.export,
  //   fetcher,
  //   {
  //     onSuccess: (csvData) => {
  //       downloadCsv(csvData, location)
  //     },
  //   }
  // )

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
  ]

  // Define the mutation function to update doorStatus (Normal, Passthru, Lockdown, LockdownWithREX) all selected doors
  const { trigger: doorStatusTrigger } = useSWRMutation(doorApi.doorStatus, sendPostRequest, {
    onSuccess: () => {
      handleSelectAllRow(false, [])
      mutate()
    },
  })

  const handleDoorStatus = (doorStatus: 'Normal' | 'Passthru' | 'Lockdown' | 'LockdownWithREX') => {
    if (selected.length) {
      const handleStatusTrigger = () =>
        doorStatusTrigger({
          DoorNos: selected,
          Status: doorStatus,
        })

      openAlertDialogWithPromise(
        handleStatusTrigger,
        { success: t`Success` },
        // { success: t`Door ${doorStatus} Status Update successful` },
        t`Do you want to change Door Stat to ${doorStatus} ?`
        // t`Do you want to ${doorStatus} ?`
      )
    }
  }

  // Define the mutation function to update lockStatus (Lock, Unlock, MUnlock) all selected doors
  const { trigger: lockStatusTrigger } = useSWRMutation(doorApi.lockStatus, sendPostRequest, {
    onSuccess: () => {
      handleSelectAllRow(false, [])
      mutate()
    },
  })

  const handleLockStatus = (lockStatus: 'Lock' | 'Unlock' | 'MUnlock') => {
    if (selected.length) {
      const handleStatusTrigger = () =>
        lockStatusTrigger({
          DoorNos: selected,
          Lock: lockStatus,
        })

      openAlertDialogWithPromise(
        handleStatusTrigger,
        // {
        //   success: t`Door ${lockStatus} Status Update successful`,
        // },
        // t`Do you really want to update door lock status to ${lockStatus} for the selected doors?`
        { success: t`Success` },
        t`Do you want to ${lockStatus} ?`
      )
    }
  }

  // Define the mutation function to update probe all selected doors
  const { trigger: probeTrigger } = useSWRMutation(doorApi.contact, sendPostRequest, {
    onSuccess: () => {
      handleSelectAllRow(false, [])
      mutate()
    },
  })

  // const handleProbe = () => {
  //   if (selected.length) {
  //     const handleStatusTrigger = () =>
  //       probeTrigger({
  //         DoorNos: selected,
  //       })

  //     openAlertDialogWithPromise(
  //       handleStatusTrigger,
  //       { success: t`Change Success` },
  //       // t`Do you really want to update door status to probe for the selected doors?`
  //       t`Do you want to Probe?`
  //     )
  //   }
  // }

  const tableActions: IActionButtonsGroup = {
    Modify: [
      {
        icon: filterIcon,
        text: t`Filter`,
        onClick: () => setFilterOpen((prevSate) => !prevSate),
      },
      {
        text: t`Group Edit`,
        icon: groupEditIcon,
        // tooltip: 'Group Edit',
        link: routeProperty.doorGroupEdit.path(selected.join(',')),
        disabled: selected.length === 0,
      },
    ],
    Control: [
      {
        text: t`Normal`,
        icon: applyIcon,
        // tooltip: 'Normal',
        onClick: () => handleDoorStatus('Normal'),
        disabled: selected.length === 0,
      },
      {
        text: t`Passthru`,
        icon: passthruIcon,
        // tooltip: 'Passthru',
        onClick: () => handleDoorStatus('Passthru'),
        disabled: selected.length === 0,
      },
      {
        text: t`Lockdown`,
        icon: lockDownIcon,
        // tooltip: 'Lockdown',
        onClick: () => handleDoorStatus('Lockdown'),
        disabled: selected.length === 0,
      },
      {
        text: t`Lockdown With Rex`,
        icon: lockDownWithRexIcon,
        // tooltip: 'Lockdown With Rex',
        onClick: () => handleDoorStatus('LockdownWithREX'),
        disabled: selected.length === 0,
      },
    ],
    DB: [
      {
        text: t`Lock`,
        icon: lockIcon,
        // tooltip: 'Lock',
        onClick: () => handleLockStatus('Lock'),
        disabled: selected.length === 0,
      },
      {
        text: t`Unlock`,
        icon: unlockIcon,
        // tooltip: 'Unlock',
        onClick: () => handleLockStatus('Unlock'),
        disabled: selected.length === 0,
      },
      {
        text: t`M-Unlock`,
        icon: mUnlockIcon,
        // tooltip: 'M-Unlock',
        onClick: () => handleLockStatus('MUnlock'),
        disabled: selected.length === 0,
      },
      // {
      //   text: t`Probe`,
      //   icon: provIcon,
      //   // tooltip: 'Probe',
      //   onClick: handleProbe,
      //   disabled: selected.length === 0,
      // },
    ],
  }

  const isNotFound = !data?.data.length && !isLoading

  return (
    <Page>
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <TableContainer>
        {filterOpen && (
          <DoorTableToolbar
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
                  data?.data.map((result) => result.DoorNo.toString())
                )
              }
            }}
            headerData={TABLE_HEAD}
          />
          <tbody className="divide-y divide-gray-200">
            {!isLoading && (
              <>
                {data?.data.map((row) => (
                  <DoorTableRow
                    key={row.DoorNo}
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

export default Door
