import QueryString from 'qs'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendMultiDeleteRequest, sendPostRequest } from '../../api/swrConfig'
import { locksetApi } from '../../api/urls'
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
import LocksetTableRow from '../../components/pages/lockset/LocksetTableRow'
import LocksetTableToolbar from '../../components/pages/lockset/LocksetTableToolbar'
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
  ILocksetApiQueryParams,
  ILocksetFilters,
  ILocksetResult,
  ILocksetRouteQueryParams,
} from '../../types/pages/lockset'
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

function Lockset() {
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
  } = useTable({ defaultOrderBy: 'LocksetNo' })
  // hook to update the query in the URL
  const updateRouteQueryWithReplace = useUpdateRouteQueryWithReplace()
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  const TABLE_HEAD: ITableHead[] = [
    { id: 'LocksetNo', label: t`Lockset No`, filter: true },
    ...(showPartition ? [{ id: 'PartitionNo', label: t`Partition`, filter: true }] : []),
    { id: 'LocksetName', label: t`Lockset Name`, filter: true },
    { id: 'LocksetDesc', label: t`Description`, filter: true },
    { id: 'GatewayNo', label: t`Gateway`, filter: true },
    { id: 'LinkId', label: t`Link ID`, filter: true },
    { id: 'Online', label: t`Online`, filter: true },
    { id: 'LockStat', label: t`Lock Stat`, filter: true },
    // { id: 'ContactStat', label: t`Contact Stat`, filter: true },
  ]

  const initialFilterState: ILocksetFilters = {
    Apply: false,
    LocksetNo: '',
    LocksetName: '',
    LinkId: '',
    Partition: null,
    Gateway: null,
  }

  const [filterState, setFilterState] = useState(initialFilterState)
  const filterStateRef = useRef(filterState)

  // state for show and hide list filter section
  const [filterOpen, setFilterOpen] = useState(false)

  const handleFilterInputChange: THandleFilterInputChange = (name, value) => {
    setFilterState((state) => ({ ...state, Apply: false, [name]: value }))
  }

  const updateFilterStateToQuery = () => {
    handleChangePage(1)

    const queryParams: ILocksetRouteQueryParams = {
      page: 1,
      LocksetNo: filterStateRef.current.LocksetNo,
      LocksetName: filterStateRef.current.LocksetName,
      LinkId: filterStateRef.current.LinkId,
      PartitionValue: filterStateRef.current.Partition?.value,
      PartitionLabel: filterStateRef.current.Partition?.label,
      GatewayValue: filterStateRef.current.Gateway?.value,
      GatewayLabel: filterStateRef.current.Gateway?.label,
    }

    updateRouteQueryWithReplace({
      pathName: location.pathname,
      query: queryParams,
    })
  }

  const handleFilterApply = () => {
    filterStateRef.current = filterState
    updateFilterStateToQuery()
    handleFilterInputChange('Apply', true)
  }

  const handleFilterStateReset = () => {
    filterStateRef.current = initialFilterState
    updateFilterStateToQuery()
    setFilterState(initialFilterState)
    mutate(undefined, true)
  }

  useEffect(() => {
    const queryParse = QueryString.parse(location.search)

    const queryState: ILocksetFilters = {
      LocksetNo: typeof queryParse.LocksetNo === 'string' ? queryParse.LocksetNo : '',
      LocksetName: typeof queryParse.LocksetName === 'string' ? queryParse.LocksetName : '',
      LinkId: typeof queryParse.LinkId === 'string' ? queryParse.LinkId : '',
      Partition:
        typeof queryParse.PartitionValue === 'string' &&
        typeof queryParse.PartitionLabel === 'string'
          ? {
              label: queryParse.PartitionLabel,
              value: queryParse.PartitionValue,
            }
          : null,
      Gateway:
        typeof queryParse.GatewayValue === 'string' && typeof queryParse.GatewayLabel === 'string'
          ? {
              label: queryParse.GatewayLabel,
              value: queryParse.GatewayValue,
            }
          : null,
      Apply: true,
    }

    setFilterState(queryState)
    filterStateRef.current = queryState
  }, [location.search, location.pathname])

  const apiQueryParams: ILocksetApiQueryParams = {
    offset: (page - 1) * rowsPerPage,
    limit: rowsPerPage,
    sort_by: orderBy,
    order,
    ...(filterStateRef.current.LocksetNo && {
      LocksetNo: filterStateRef.current.LocksetNo,
    }),
    ...(filterStateRef.current.LocksetName && {
      LocksetName_icontains: filterStateRef.current.LocksetName,
    }),
    ...(filterStateRef.current.LinkId && {
      LinkId_icontains: filterStateRef.current.LinkId,
    }),
    ...(filterStateRef.current.Partition?.value && {
      PartitionNo: filterStateRef.current.Partition.value,
    }),
    ...(filterStateRef.current.Gateway?.value && {
      GatewayNo: filterStateRef.current.Gateway.value,
    }),
  }

  const apiQueryString = QueryString.stringify(apiQueryParams)

  const { isLoading, data, mutate } = useSWR<IListServerResponse<ILocksetResult[]>>(
    locksetApi.list(apiQueryString)
  )

  // Define the mutation function to delete all selected partition from the server
  const { trigger: multipleDeleteTrigger } = useSWRMutation(
    locksetApi.deleteMultiple,
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
  //   locksetApi.export,
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
    //   link: routeProperty.locksetCreate.path(),
    // },
  ]

  // Define the mutation function to update list state (Lock, Unlock, M-Unlock Update, Initialize ,Setup) all selected lockset
  const { trigger: listActionTrigger } = useSWRMutation(locksetApi.action, sendPostRequest, {
    onSuccess: () => {
      handleSelectAllRow(false, [])
      mutate()
    },
  })

  const handleLockStatus = (
    lockStatus: 'Lock' | 'Unlock' | 'M-Unlock' | 'Update' | 'Initialize' | 'Setup'
  ) => {
    if (selected.length) {
      const handleStatusTrigger = () =>
        listActionTrigger({
          LocksetNos: selected,
          Action: lockStatus,
        })

      openAlertDialogWithPromise(
        handleStatusTrigger,
        // { success: t`Lockset ${lockStatus} Status Update successful` },
        // t`Do you really want to update lockset status to ${lockStatus} for the selected lockset?`
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
        link: routeProperty.locksetCreate.path(),
      },
      {
        icon: deleteIcon,
        text: t`Delete`,
        // tooltip: 'Delete',
        onClick: handleDeleteMultiple,
        disabled: selected.length === 0,
      },
    ],
    Control: [
      {
        // color: 'danger',
        icon: lockIcon,
        text: t`Lock`,
        // tooltip: 'Lock',
        onClick: () => handleLockStatus('Lock'),
        disabled: selected.length === 0,
      },
      {
        icon: unlockIcon,
        text: t`Unlock`,
        onClick: () => handleLockStatus('Unlock'),
        disabled: selected.length === 0,
      },
      {
        icon: mUnlockIcon,
        text: t`M-Unlock`,
        onClick: () => handleLockStatus('M-Unlock'),
        disabled: selected.length === 0,
      },
    ],
    DB: [
      {
        icon: dbUpdateIcon,
        text: t`DB Update`,
        onClick: () => handleLockStatus('Update'),
        disabled: selected.length === 0,
      },
      {
        icon: dbInitializeIcon,
        text: t`DB Initialize`,
        // tooltip: 'DB Initialize',
        onClick: () => handleLockStatus('Initialize'),
        disabled: selected.length === 0,
      },
    ],
  }

  const isNotFound = !data?.data.length && !isLoading

  return (
    <Page>
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <TableContainer>
        {filterOpen && (
          <LocksetTableToolbar
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
                  data?.data.map((result) => result.LocksetNo.toString())
                )
              }
            }}
            headerData={TABLE_HEAD}
          />
          <tbody className="divide-y divide-gray-200">
            {!isLoading && (
              <>
                {data?.data.map((row) => (
                  <LocksetTableRow
                    key={row.LocksetNo}
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

export default Lockset
