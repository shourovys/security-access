import QueryString from 'qs'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendMultiDeleteRequest, sendPostRequest } from '../../api/swrConfig'
import { triggerApi } from '../../api/urls'
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
import TriggerTableRow from '../../components/pages/trigger/TriggerTableRow'
import TriggerTableToolbar from '../../components/pages/trigger/TriggerTableToolbar'
import useAlert from '../../hooks/useAlert'
import useAuth from '../../hooks/useAuth'
import useTable, { emptyRows } from '../../hooks/useTable'
import useUpdateRouteQueryWithReplace from '../../hooks/useUpdateRouteQueryWithReplace'
import routeProperty from '../../routes/routeProperty'
import { IActionButtonsGroup } from '../../types/components/actionButtons'
import { THandleFilterInputChange } from '../../types/components/common'
import { ITableHead } from '../../types/components/table'
import { IListServerResponse } from '../../types/pages/common'
import {
  ITriggerApiQueryParams,
  ITriggerFilters,
  ITriggerResult,
  ITriggerRouteQueryParams,
} from '../../types/pages/trigger'
import { addIcon, deleteIcon, filterIcon, triggerIcon } from '../../utils/icons'
import t from '../../utils/translator'

function Trigger() {
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
  } = useTable({ defaultOrderBy: 'TriggerNo' })
  // hook to update the query in the URL
  const updateRouteQueryWithReplace = useUpdateRouteQueryWithReplace()
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  const TABLE_HEAD: ITableHead[] = [
    { id: 'TriggerNo', label: t`Trigger No`, filter: true },
    ...(showPartition ? [{ id: 'PartitionNo', label: t`Partition`, filter: true }] : []),
    { id: 'TriggerName', label: t`Trigger Name`, filter: true },
    { id: 'TriggerDesc', label: t`Description`, filter: true },
  ]

  // apply property use for apply filter. filter will apply when apply is true
  const initialFilterState: ITriggerFilters = {
    Apply: false,
    TriggerNo: '',
    TriggerName: '',
    Partition: null,
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

    const queryParams: ITriggerRouteQueryParams = {
      page: 1,
      TriggerNo: filterStateRef.current.TriggerNo,
      TriggerName: filterStateRef.current.TriggerName,
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
    // on filter apply, filterStateRef updates to the current filter state
    filterStateRef.current = filterState
    updateFilterStateToQuery()
    handleFilterInputChange('Apply', true)
  }

  // handle the reset button for the filters
  const handleFilterStateReset = () => {
    // on filter apply, filterStateRef updates to the initial filter state
    filterStateRef.current = initialFilterState
    updateFilterStateToQuery()
    setFilterState(initialFilterState)
    mutate(undefined, true)
  }

  // in route change or reload - filter state updates by query value and applies to filter
  useEffect(() => {
    const queryParse = QueryString.parse(location.search)

    const queryState: ITriggerFilters = {
      TriggerNo: typeof queryParse.TriggerNo === 'string' ? queryParse.TriggerNo : '',
      TriggerName: typeof queryParse.TriggerName === 'string' ? queryParse.TriggerName : '',
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

  // create the query object for the API call
  const apiQueryParams: ITriggerApiQueryParams = {
    offset: (page - 1) * rowsPerPage,
    limit: rowsPerPage,
    sort_by: orderBy,
    order,
    ...(filterStateRef.current.TriggerNo && {
      TriggerNo: filterStateRef.current.TriggerNo,
    }),
    ...(filterStateRef.current.TriggerName && {
      TriggerName_icontains: filterStateRef.current.TriggerName,
    }),
    ...(filterStateRef.current.Partition?.value && {
      PartitionNo: filterStateRef.current.Partition.value,
    }),
  }

  const apiQueryString = QueryString.stringify(apiQueryParams)

  const { isLoading, data, mutate } = useSWR<IListServerResponse<ITriggerResult[]>>(
    triggerApi.list(apiQueryString)
  )

  // Define the mutation function to delete all selected partition from the server
  const { trigger: multipleDeleteTrigger } = useSWRMutation(
    triggerApi.deleteMultiple,
    sendMultiDeleteRequest,
    {
      // Show a success message and redirect to partition list page on successful delete
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
  //   triggerApi.export,
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
  //   // {
  //   //   icon: addIcon,
  //   //   text: t`Add`,
  //   //   link: routeProperty.triggerCreate.path(),
  //   // },
  // ]

  // Define the mutation function to update trigger status triggers all selected triggers
  const { trigger: triggerStatusTrigger } = useSWRMutation(triggerApi.trigger, sendPostRequest, {
    onSuccess: () => {
      handleSelectAllRow(false, [])
      mutate()
    },
  })

  const handleTriggerStatus = () => {
    if (selected.length) {
      const handleStatusTrigger = () =>
        triggerStatusTrigger({
          TriggerNos: selected,
        })

      openAlertDialogWithPromise(
        handleStatusTrigger,
        { success: t`Success` },
        t`Do you want to Trigger?`
        // t`Do you really want to change ?`
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
        link: routeProperty.triggerCreate.path(),
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
        text: t`Trigger`,
        icon: triggerIcon,
        // tooltip: 'Trigger',
        onClick: handleTriggerStatus,
        disabled: selected.length === 0,
      },
    ],
  }

  const isNotFound = !data?.data.length && !isLoading

  return (
    <Page title={t`Trigger List`}>
      <Breadcrumbs />
      <TableContainer>
        {filterOpen && (
          <TriggerTableToolbar
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
                  data?.data.map((result) => result.TriggerNo.toString())
                )
              }
            }}
            headerData={TABLE_HEAD}
          />
          <tbody className="divide-y divide-gray-200">
            {!isLoading && (
              <>
                {data?.data.map((row) => (
                  <TriggerTableRow
                    key={row.TriggerNo}
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

export default Trigger
