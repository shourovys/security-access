import QueryString from 'qs'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendMultiDeleteRequest, sendPostRequest } from '../../api/swrConfig'
import { contLockApi } from '../../api/urls'
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
import ContLockTableRow from '../../components/pages/contLock/ContLockTableRow'
import ContLockTableToolbar from '../../components/pages/contLock/ContLockTableToolbar'
import useAlert from '../../hooks/useAlert'
import useAuth from '../../hooks/useAuth'
import useReloadMasterNodeAction from '../../hooks/useRebootAction'
import useTable, { emptyRows } from '../../hooks/useTable'
import useUpdateRouteQueryWithReplace from '../../hooks/useUpdateRouteQueryWithReplace'
import routeProperty from '../../routes/routeProperty'
import { IActionButtonsGroup, IActionsButton } from '../../types/components/actionButtons'
import { THandleFilterInputChange } from '../../types/components/common'
import { ITableHead } from '../../types/components/table'
import { IListServerResponse } from '../../types/pages/common'
import {
  IContLockApiQueryParams,
  IContLockFilters,
  IContLockResult,
  IContLockRouteQueryParams,
} from '../../types/pages/contLock'
import {
  addIcon,
  dbInitializeIcon,
  dbUpdateIcon,
  deleteIcon,
  filterIcon,
  lockIcon,
  mUnlockIcon,
  reloadIcon,
  unlockIcon,
} from '../../utils/icons'
import t from '../../utils/translator'

function ContLock() {
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
  } = useTable({ defaultOrderBy: 'ContLockNo' })
  // hook to update the query in the URL
  const updateRouteQueryWithReplace = useUpdateRouteQueryWithReplace()
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  const TABLE_HEAD: ITableHead[] = [
    { id: 'ContLockNo', label: t`ContLock No`, filter: true },
    ...(showPartition ? [{ id: 'PartitionNo', label: t`Partition`, filter: true }] : []),
    { id: 'ContLockName', label: t`ContLock Name`, filter: true },
    { id: 'ContLockDesc', label: t`Description`, filter: true },
    { id: 'ContGateNo', label: t`ContGate`, filter: true },
    { id: 'RfAddress', label: t`RfAddress`, filter: true },
    { id: 'Online', label: t`Online`, filter: true },
    { id: 'Busy', label: t`Busy`, filter: true },
    { id: 'LockStat', label: t`Lock Stat`, filter: true },
    // { id: 'ContactStat', label: t`Contact Stat`, filter: true },
  ]

  // Apply property is used to determine whether to apply the filter. The filter will be applied when Apply is true.
  const initialFilterState: IContLockFilters = {
    Apply: false,
    ContLockNo: '',
    ContLockName: '',
    Partition: null,
    ContGate: null,
    RfAddress: '',
  }

  // State to store the filter values
  const [filterState, setFilterState] = useState(initialFilterState)

  // Ref to store the applied filter values
  const filterStateRef = useRef(filterState)
  // state for show and hide list filter section
  const [filterOpen, setFilterOpen] = useState(false)

  const handleFilterInputChange: THandleFilterInputChange = (name, value) => {
    // Apply will be set to false in every filter state change
    setFilterState((state) => ({ ...state, Apply: false, [name]: value }))
  }

  // Update filter state in the URL when filter state is applied or reset
  const updateFilterStateToQuery = () => {
    handleChangePage(1)

    const queryParams: IContLockRouteQueryParams = {
      page: 1,
      ContLockNo: filterStateRef.current.ContLockNo,
      ContLockName: filterStateRef.current.ContLockName,
      PartitionValue: filterStateRef.current.Partition?.value,
      PartitionLabel: filterStateRef.current.Partition?.label,
      ContGateValue: filterStateRef.current.ContGate?.value,
      ContGateLabel: filterStateRef.current.ContGate?.label,
      RfAddress: filterStateRef.current.RfAddress,
    }

    updateRouteQueryWithReplace({
      pathName: location.pathname,
      query: queryParams,
    })
  }

  // Handle the apply button for the filters
  const handleFilterApply = () => {
    // On filter apply, filterStateRef is updated to the current filter state
    filterStateRef.current = filterState
    updateFilterStateToQuery()
    handleFilterInputChange('Apply', true)
  }

  // Handle the reset button for the filters
  const handleFilterStateReset = () => {
    // On filter reset, filterStateRef is updated to the initial filter state
    filterStateRef.current = initialFilterState
    updateFilterStateToQuery()
    setFilterState(initialFilterState)
    mutate(undefined, true)
  }

  // In route change or reload - filter state is updated by the query value and applied to the filter
  useEffect(() => {
    const queryParse = QueryString.parse(location.search)

    const queryState: IContLockFilters = {
      ContLockNo: typeof queryParse.ContLockNo === 'string' ? queryParse.ContLockNo : '',
      ContLockName: typeof queryParse.ContLockName === 'string' ? queryParse.ContLockName : '',
      Partition:
        typeof queryParse.PartitionValue === 'string' &&
          typeof queryParse.PartitionLabel === 'string'
          ? {
            label: queryParse.PartitionLabel,
            value: queryParse.PartitionValue,
          }
          : null,
      ContGate:
        typeof queryParse.ContGateValue === 'string' && typeof queryParse.ContGateLabel === 'string'
          ? {
            label: queryParse.ContGateLabel,
            value: queryParse.ContGateValue,
          }
          : null,
      RfAddress: typeof queryParse.RfAddress === 'string' ? queryParse.RfAddress : '',
      Apply: true,
    }

    setFilterState(queryState)
    filterStateRef.current = queryState
  }, [location.search, location.pathname])

  // query object of pagination, sorting, filtering
  const apiQueryParams: IContLockApiQueryParams = {
    offset: (page - 1) * rowsPerPage,
    limit: rowsPerPage,
    sort_by: orderBy,
    order,
    ...(filterStateRef.current.ContLockNo && {
      ContLockNo: filterStateRef.current.ContLockNo,
    }),
    ...(filterStateRef.current.ContLockName && {
      ContLockName_icontains: filterStateRef.current.ContLockName,
    }),
    ...(filterStateRef.current.Partition?.value && {
      PartitionNo: filterStateRef.current.Partition.value,
    }),
    ...(filterStateRef.current.ContGate?.value && {
      ContGateNo: filterStateRef.current.ContGate.value,
    }),
    ...(filterStateRef.current.RfAddress && {
      RfAddress_icontains: filterStateRef.current.RfAddress,
    }),
  }

  const apiQueryString = QueryString.stringify(apiQueryParams)

  const { isLoading, data, mutate } = useSWR<IListServerResponse<IContLockResult[]>>(
    contLockApi.list(apiQueryString)
  )

  // Define the mutation function to delete all selected partition from the server
  const { trigger: multipleDeleteTrigger } = useSWRMutation(
    contLockApi.deleteMultiple,
    sendMultiDeleteRequest,
    {
      // Refetch list data on successful delete
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
  //   contLockApi.export,
  //   fetcher,
  //   {
  //     onSuccess: (csvData) => {
  //       downloadCsv(csvData, location)
  //     },
  //   }
  // )

  const { handleReload } = useReloadMasterNodeAction(mutate)

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
      icon: reloadIcon,
      text: t`Reload`,
      onClick: handleReload,
    },
    // {
    //   icon: addIcon,
    //   text: t`Add`,
    //   link: routeProperty.contLockCreate.path(),
    // },
  ]

  // Define the mutation function to update list state (Lock, Unlock, M-Unlock Update, Initialize ,Setup) all selected contLock
  const { trigger: contlockListActionTrigger } = useSWRMutation(
    contLockApi.action,
    sendPostRequest,
    {
      onSuccess: () => {
        handleSelectAllRow(false, [])
        mutate()
      },
    }
  )

  const handleContLockLockStatus = (
    lockStatus: 'Lock' | 'Unlock' | 'M-Unlock' | 'Update' | 'Initialize' | 'Setup'
  ) => {
    if (selected.length) {
      const handleStatusTrigger = () =>
        contlockListActionTrigger({
          ContLockNos: selected,
          Action: lockStatus,
        })

      openAlertDialogWithPromise(
        handleStatusTrigger,
        // { success: t`ContLock ${lockStatus} Status Update successful` },
        // t`Do you really want to update contLock status to ${lockStatus} for the selected contLock?`
        { success: t`Success` },
        t`Do you want to ${lockStatus} ?`
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
        icon: addIcon,
        text: t`Add`,
        link: routeProperty.contLockCreate.path(),
      },
      {
        text: t`Delete`,
        icon: deleteIcon,
        // tooltip: 'Delete',
        onClick: handleDeleteMultiple,
        disabled: selected.length === 0,
      },
    ],
    Control: [
      {
        text: t`Lock`,
        icon: lockIcon,
        // tooltip: 'Lock',
        onClick: () => handleContLockLockStatus('Lock'),
        disabled: selected.length === 0,
      },
      {
        text: t`Unlock`,
        icon: unlockIcon,
        // tooltip: 'Unlock',
        onClick: () => handleContLockLockStatus('Unlock'),
        disabled: selected.length === 0,
      },
      {
        text: t`M-Unlock`,
        icon: mUnlockIcon,
        // tooltip: 'M-Unlock',
        onClick: () => handleContLockLockStatus('M-Unlock'),
        disabled: selected.length === 0,
      },
    ],
    DB: [
      {
        text: t`DB Update`,
        icon: dbUpdateIcon,
        // tooltip: 'DB Update',
        onClick: () => handleContLockLockStatus('Update'),
        disabled: selected.length === 0,
      },
      {
        text: t`DB Initialize`,
        icon: dbInitializeIcon,
        // tooltip: 'DB Initialize',
        onClick: () => handleContLockLockStatus('Initialize'),
        disabled: selected.length === 0,
      },
    ],
  }

  const isNotFound = !data?.data.length && !isLoading

  return (
    <Page title={t`ContLock List`}>
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <TableContainer>
        {filterOpen && (
          <ContLockTableToolbar
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
                  data?.data.map((result) => result.ContLockNo.toString())
                )
              }
            }}
            headerData={TABLE_HEAD}
          />
          <tbody className="divide-y divide-gray-200">
            {!isLoading && (
              <>
                {data?.data.map((row) => (
                  <ContLockTableRow
                    key={row.ContLockNo}
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

export default ContLock
