import QueryString from 'qs'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendMultiDeleteRequest, sendPostRequest } from '../../api/swrConfig'
import { threatApi } from '../../api/urls'
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
import ThreatTableRow from '../../components/pages/threat/ThreatTableRow'
import ThreatTableToolbar from '../../components/pages/threat/ThreatTableToolbar'
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
  IThreatApiQueryParams,
  IThreatFilters,
  IThreatResult,
  IThreatRouteQueryParams,
} from '../../types/pages/threat'
import {
  addIcon,
  deleteIcon,
  disableIcon,
  elevatedIcon,
  filterIcon,
  guardedIcon,
  highIcon,
  lowIcon,
  serveIcon,
} from '../../utils/icons'
import t from '../../utils/translator'

function Threat() {
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
  } = useTable({ defaultOrderBy: 'ThreatNo' })
  // hook to update the query in the URL
  const updateRouteQueryWithReplace = useUpdateRouteQueryWithReplace()
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  const TABLE_HEAD: ITableHead[] = [
    { id: 'ThreatNo', label: t`Threat No`, filter: true },
    ...(showPartition ? [{ id: 'PartitionNo', label: t`Partition`, filter: true }] : []),
    { id: 'ThreatName', label: t`Threat Name`, filter: true },
    { id: 'ThreatDesc', label: t`Description`, filter: true },
    { id: 'ThreatLevel', label: t`Threat Level`, filter: true },
  ]

  // apply property use for apply filter. filter will apply when apply is true
  const initialFilterState: IThreatFilters = {
    Apply: false,
    ThreatNo: '',
    ThreatName: '',
    Partition: null,
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

    const queryParams: IThreatRouteQueryParams = {
      page: 1,
      ThreatNo: filterStateRef.current.ThreatNo,
      ThreatName: filterStateRef.current.ThreatName,
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

    const queryState: IThreatFilters = {
      ThreatNo: typeof queryParse.ThreatNo === 'string' ? queryParse.ThreatNo : '',
      ThreatName: typeof queryParse.ThreatName === 'string' ? queryParse.ThreatName : '',
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

  // query object of pagination, sorting, filtering
  const apiQueryParams: IThreatApiQueryParams = {
    offset: (page - 1) * rowsPerPage,
    limit: rowsPerPage,
    sort_by: orderBy,
    order,
    ...(filterStateRef.current.ThreatNo && {
      ThreatNo: filterStateRef.current.ThreatNo,
    }),
    ...(filterStateRef.current.ThreatName && {
      ThreatName_icontains: filterStateRef.current.ThreatName,
    }),
    ...(filterStateRef.current.Partition?.value && {
      PartitionNo: filterStateRef.current.Partition.value,
    }),
  }

  const apiQueryString = QueryString.stringify(apiQueryParams)

  const { isLoading, data, mutate } = useSWR<IListServerResponse<IThreatResult[]>>(
    threatApi.list(apiQueryString)
  )

  // Define the mutation function to delete all selected partition from the server
  const { trigger: multipleDeleteTrigger } = useSWRMutation(
    threatApi.deleteMultiple,
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

  // // mutation for fetch csv data from server and call downloadCsc
  // const { trigger: csvDataTrigger, isMutating: csvDataLoading } = useSWRMutation(
  //   threatApi.export,
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
  //   //   link: routeProperty.threatCreate.path(),
  //   // },
  // ]
  // Define the mutation function to update threat status (Disable, Low, Guarded, Elevated, High, Severe) all selected threat
  const { trigger: threatStatusTrigger } = useSWRMutation(threatApi.action, sendPostRequest, {
    onSuccess: () => {
      handleSelectAllRow(false, [])
      mutate()
    },
  })

  const handleThreatStatus = (
    relayStatus: 'Disable' | 'Low' | 'Guarded' | 'Elevated' | 'High' | 'Severe'
  ) => {
    if (selected.length) {
      const handleStatusTrigger = () =>
        threatStatusTrigger({
          ThreatNos: selected,
          Action: relayStatus,
        })

      openAlertDialogWithPromise(
        handleStatusTrigger,
        // { success: `Threat ${relayStatus} Status Update successful` },
        { success: t`Success` },
        t`Do you want to change Threat Level to ${relayStatus} ?`
        // t`Do you want to ${relayStatus} ?`
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
        link: routeProperty.threatCreate.path(),
      },
      {
        text: t`Delete`,
        icon: deleteIcon,
        onClick: handleDeleteMultiple,
        disabled: selected.length === 0,
      },
    ],
    Control: [
      {
        text: t`Disable`,
        icon: disableIcon,
        // tooltip: 'Disable',
        onClick: () => handleThreatStatus('Disable'),
        disabled: selected.length === 0,
      },
      {
        // color: 'danger',
        text: t`Low`,
        icon: lowIcon,
        // tooltip: 'Low',
        onClick: () => handleThreatStatus('Low'),
        disabled: selected.length === 0,
      },
      {
        text: t`Guarded`,
        icon: guardedIcon,
        onClick: () => handleThreatStatus('Guarded'),
        disabled: selected.length === 0,
      },
      {
        text: t`Elevated`,
        icon: elevatedIcon,
        onClick: () => handleThreatStatus('Elevated'),
        disabled: selected.length === 0,
      },
      {
        text: t`High`,
        icon: highIcon,
        onClick: () => handleThreatStatus('High'),
        disabled: selected.length === 0,
      },
      {
        text: t`Severe`,
        icon: serveIcon,
        onClick: () => handleThreatStatus('Severe'),
        disabled: selected.length === 0,
      },
    ],
  }

  const isNotFound = !data?.data.length && !isLoading

  return (
    <div className="threat">
      <Page title={t`Threat List`}>
        <Breadcrumbs />
        <TableContainer>
          {filterOpen && (
            <ThreatTableToolbar
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
                    data?.data.map((result) => result.ThreatNo.toString())
                  )
                }
              }}
              headerData={TABLE_HEAD}
            />
            <tbody className="divide-y divide-gray-200">
              {!isLoading && (
                <>
                  {data?.data.map((row) => (
                    <ThreatTableRow
                      key={row.ThreatNo}
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
    </div>
  )
}

export default Threat
