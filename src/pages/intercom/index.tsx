import QueryString from 'qs'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendMultiDeleteRequest, sendPostRequest } from '../../api/swrConfig'
import { intercomApi } from '../../api/urls'
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
import IntercomTableRow from '../../components/pages/intercom/IntercomTableRow'
import IntercomTableToolbar from '../../components/pages/intercom/IntercomTableToolbar'
import useAlert from '../../hooks/useAlert'
import useAuth from '../../hooks/useAuth'
import useReloadMasterNodeAction from '../../hooks/useRebootAction'
import useTable, { emptyRows } from '../../hooks/useTable'
import useUpdateRouteQueryWithReplace from '../../hooks/useUpdateRouteQueryWithReplace'
import { IActionButtonsGroup, IActionsButton } from '../../types/components/actionButtons'
import { THandleFilterInputChange } from '../../types/components/common'
import { ITableHead } from '../../types/components/table'
import { IListServerResponse } from '../../types/pages/common'
import {
  IIntercomApiQueryParams,
  IIntercomFilters,
  IIntercomResult,
  IIntercomRouteQueryParams,
} from '../../types/pages/intercom'
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

function Intercom() {
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
  } = useTable({ defaultOrderBy: 'IntercomNo' })
  // hook to update the query in the URL
  const updateRouteQueryWithReplace = useUpdateRouteQueryWithReplace()
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  const TABLE_HEAD: ITableHead[] = [
    { id: 'IntercomNo', label: t`Intercom No`, filter: true },
    ...(showPartition ? [{ id: 'PartitionNo', label: t`Partition`, filter: true }] : []),
    { id: 'IntercomName', label: t`Intercom Name`, filter: true },
    { id: 'IntercomDesc', label: t`Description`, filter: true },
    { id: 'NodeNo', label: t`Node`, filter: true },
    { id: 'IpAddress', label: t`IP Address`, filter: true },
    { id: 'Online', label: t`Online`, filter: true },
    { id: 'Busy', label: t`Busy`, filter: true },
    { id: 'LockStat', label: t`Lock Stat`, filter: true },
    // { id: 'ContactStat', label: t`Contact Stat`, filter: true },
  ]

  //Added reload button and its functionality

  // apply property use for apply filter. filter will apply when apply is true
  const initialFilterState: IIntercomFilters = {
    Apply: false,
    IntercomNo: '',
    IntercomName: '',
    IpAddress: '',
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
    // apply will be false in every filter state change
    setFilterState((state) => ({ ...state, Apply: false, [name]: value }))
  }

  // update filter state in the URL when filter state is applied or reset
  const updateFilterStateToQuery = () => {
    handleChangePage(1)

    const queryParams: IIntercomRouteQueryParams = {
      page: 1,
      IntercomNo: filterStateRef.current.IntercomNo,
      IntercomName: filterStateRef.current.IntercomName,
      IpAddress: filterStateRef.current.IpAddress,
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
    // on filter apply, filterStateRef updates to the current filter state
    filterStateRef.current = filterState
    updateFilterStateToQuery()
    handleFilterInputChange('Apply', true)
  }

  // handle the reset button for the filters
  const handleFilterStateReset = () => {
    // on filter reset, filterStateRef updates to the initial filter state
    filterStateRef.current = initialFilterState
    updateFilterStateToQuery()
    setFilterState(initialFilterState)
    mutate(undefined, true)
  }

  // In route change or reload - filter state updates by query value and applies the filter
  useEffect(() => {
    const queryParse = QueryString.parse(location.search)

    const queryState: IIntercomFilters = {
      IntercomNo: typeof queryParse.IntercomNo === 'string' ? queryParse.IntercomNo : '',
      IntercomName: typeof queryParse.IntercomName === 'string' ? queryParse.IntercomName : '',
      IpAddress: typeof queryParse.IpAddress === 'string' ? queryParse.IpAddress : '',
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
  const apiQueryParams: IIntercomApiQueryParams = {
    offset: (page - 1) * rowsPerPage,
    limit: rowsPerPage,
    sort_by: orderBy,
    order,
    ...(filterStateRef.current.IntercomNo && {
      IntercomNo: filterStateRef.current.IntercomNo,
    }),
    ...(filterStateRef.current.IntercomName && {
      IntercomName_icontains: filterStateRef.current.IntercomName,
    }),
    ...(filterStateRef.current.IpAddress && {
      IpAddress_icontains: filterStateRef.current.IpAddress,
    }),
    ...(filterStateRef.current.Partition?.value && {
      Partition: filterStateRef.current.Partition.value,
    }),
    ...(filterStateRef.current.Node?.value && {
      Node: filterStateRef.current.Node.value,
    }),
  }

  const apiQueryString = QueryString.stringify(apiQueryParams)

  const { isLoading, data, mutate } = useSWR<IListServerResponse<IIntercomResult[]>>(
    intercomApi.list(apiQueryString)
  )

  // Define the mutation function to delete all selected partition from the server
  const { trigger: multipleDeleteTrigger } = useSWRMutation(
    intercomApi.deleteMultiple,
    sendMultiDeleteRequest,
    {
      // reload list data on successful delete
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

  const { handleReload } = useReloadMasterNodeAction(mutate)

  const breadcrumbsActions: IActionsButton[] = [
    {
      icon: reloadIcon,
      text: t`Reload`,
      onClick: handleReload,
    },
    // {
    //   icon: addIcon,
    //   text: t`Add`,
    //   link: '/intercom/add',
    // },
  ]

  // Define the mutation function to update list state (Lock, Unlock, M-Unlock Update, Initialize ,Setup) all selected intercom
  const { trigger: intercomListActionTrigger } = useSWRMutation(
    intercomApi.action,
    sendPostRequest,
    {
      onSuccess: () => {
        handleSelectAllRow(false, [])
        mutate()
      },
    }
  )

  const handleIntercomLockStatus = (
    lockStatus: 'Lock' | 'Unlock' | 'M-Unlock' | 'Update' | 'Initialize' | 'Setup'
  ) => {
    if (selected.length) {
      const handleStatusTrigger = () =>
        intercomListActionTrigger({
          IntercomNos: selected,
          Action: lockStatus,
        })

      openAlertDialogWithPromise(
        handleStatusTrigger,
        // { success: t`Intercom ${lockStatus} Status Update successful` },
        // t`Do you really want to update intercom status to ${lockStatus} for the selected intercom?`
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
        link: '/intercom/add',
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
        // color: 'danger',
        text: t`Lock`,
        icon: lockIcon,
        // tooltip: 'Lock',
        onClick: () => handleIntercomLockStatus('Lock'),
        disabled: selected.length === 0,
      },
      {
        text: t`Unlock`,
        icon: unlockIcon,
        // tooltip: 'Unlock',
        onClick: () => handleIntercomLockStatus('Unlock'),
        disabled: selected.length === 0,
      },
      {
        text: t`M-Unlock`,
        icon: mUnlockIcon,
        // tooltip: 'M-Unlock',
        onClick: () => handleIntercomLockStatus('M-Unlock'),
        disabled: selected.length === 0,
      },
    ],
    DB: [
      {
        text: t`DB Update`,
        icon: dbUpdateIcon,
        // tooltip: 'DB Update',
        onClick: () => handleIntercomLockStatus('Update'),
        disabled: selected.length === 0,
      },
      {
        text: t`DB Initialize`,
        icon: dbInitializeIcon,
        // tooltip: 'DB Initialize',
        onClick: () => handleIntercomLockStatus('Initialize'),
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
          <IntercomTableToolbar
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
                  data?.data.map((result) => result.IntercomNo.toString())
                )
              }
            }}
            headerData={TABLE_HEAD}
          />
          <tbody className="divide-y divide-gray-200">
            {!isLoading && (
              <>
                {data?.data.map((row) => (
                  <IntercomTableRow
                    key={row.IntercomNo}
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

export default Intercom
