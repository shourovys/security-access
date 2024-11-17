import QueryString from 'qs'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendMultiDeleteRequest } from '../../api/swrConfig'
import { channelApi } from '../../api/urls'
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
import ChannelTableRow from '../../components/pages/channel/ChannelTableRow'
import ChannelTableToolbar from '../../components/pages/channel/ChannelTableToolbar'
import useAlert from '../../hooks/useAlert'
import useAuth from '../../hooks/useAuth'
import useReloadMasterNodeAction from '../../hooks/useRebootAction'
import useTable, { emptyRows } from '../../hooks/useTable'
import useUpdateRouteQueryWithReplace from '../../hooks/useUpdateRouteQueryWithReplace'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleFilterInputChange } from '../../types/components/common'
import { ITableHead } from '../../types/components/table'
import {
  IChannelApiQueryParams,
  IChannelFilters,
  IChannelResult,
  IChannelRouteQueryParams,
} from '../../types/pages/channel'
import { IListServerResponse } from '../../types/pages/common'
import { addIcon, deleteIcon, filterIcon, reloadIcon } from '../../utils/icons'
import t from '../../utils/translator'

function Channel() {
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
  } = useTable({ defaultOrderBy: 'ChannelNo' })
  // hook to update the query in the URL
  const updateRouteQueryWithReplace = useUpdateRouteQueryWithReplace()
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  const TABLE_HEAD: ITableHead[] = [
    { id: 'ChannelNo', label: t`Channel No`, filter: true },
    ...(showPartition ? [{ id: 'PartitionNo', label: t`Partition`, filter: true }] : []),
    { id: 'ChannelName', label: t`Channel Name`, filter: true },
    { id: 'ChannelDesc', label: t`Description`, filter: true },
    { id: 'NvrNo', label: t`NVR`, filter: true },
    { id: 'ChannelId', label: t`Channel ID`, filter: true },
    { id: 'Streaming', label: t`Streaming`, filter: true },
    { id: 'Online', label: t`Online`, filter: true },
  ]

  // apply property use for apply filter. filter will apply when apply is true
  const initialFilterState: IChannelFilters = {
    Apply: false,
    ChannelNo: '',
    ChannelName: '',
    Partition: null,
    Nvr: null,
    ChannelId: '',
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

    const queryParams: IChannelRouteQueryParams = {
      page: 1,
      ChannelNo: filterStateRef.current.ChannelNo,
      ChannelName: filterStateRef.current.ChannelName,
      PartitionValue: filterStateRef.current.Partition?.value,
      PartitionLabel: filterStateRef.current.Partition?.label,
      NvrValue: filterStateRef.current.Nvr?.value,
      NvrLabel: filterStateRef.current.Nvr?.label,
      ChannelId: filterStateRef.current.ChannelId,
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

  // on route change or reload - filter state update by query value and apply to filter
  useEffect(() => {
    const queryParse = QueryString.parse(location.search)

    const queryState: IChannelFilters = {
      ChannelNo: typeof queryParse.ChannelNo === 'string' ? queryParse.ChannelNo : '',
      ChannelName: typeof queryParse.ChannelName === 'string' ? queryParse.ChannelName : '',
      Partition:
        typeof queryParse.PartitionValue === 'string' &&
          typeof queryParse.PartitionLabel === 'string'
          ? {
            label: queryParse.PartitionLabel,
            value: queryParse.PartitionValue,
          }
          : null,
      Nvr:
        typeof queryParse.NvrValue === 'string' && typeof queryParse.NvrLabel === 'string'
          ? {
            label: queryParse.NvrLabel,
            value: queryParse.NvrValue,
          }
          : null,
      ChannelId: typeof queryParse.ChannelId === 'string' ? queryParse.ChannelId : '',
      Apply: true,
    }

    setFilterState(queryState)
    filterStateRef.current = queryState
  }, [location.search, location.pathname])

  // create the query object for the API call
  const apiQueryParams: IChannelApiQueryParams = {
    offset: (page - 1) * rowsPerPage,
    limit: rowsPerPage,
    sort_by: orderBy,
    order,
    ...(filterStateRef.current.ChannelNo && {
      ChannelNo: filterStateRef.current.ChannelNo,
    }),
    ...(filterStateRef.current.ChannelName && {
      ChannelName_icontains: filterStateRef.current.ChannelName,
    }),
    ...(filterStateRef.current.Partition?.value && {
      PartitionNo: filterStateRef.current.Partition.value,
    }),
    ...(filterStateRef.current.Nvr?.value && {
      NvrNo: filterStateRef.current.Nvr.value,
    }),
    ...(filterStateRef.current.ChannelId && {
      ChannelId: filterStateRef.current.ChannelId,
    }),
  }

  const apiQueryString = QueryString.stringify(apiQueryParams)

  const { isLoading, data, mutate } = useSWR<IListServerResponse<IChannelResult[]>>(
    channelApi.list(apiQueryString)
  )

  // Define the mutation function to delete all selected partition from the server
  const { trigger: multipleDeleteTrigger } = useSWRMutation(
    channelApi.deleteMultiple,
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

  // // mutation for fetch csv data from server and call downloadCsc
  // const { trigger: csvDataTrigger, isMutating: csvDataLoading } = useSWRMutation(
  //   channelApi.export,
  //   fetcher,
  //   {
  //     onSuccess: (csvData) => {
  //       downloadCsv(csvData, location)
  //     },
  //   }
  // )

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
    //   link: routeProperty.cameraCreate.path(),
    // },
  ]

  const tableActions: IActionsButton[] = [
    // {
    //   color: 'csv',
    //   icon: csvIcon,
    //   text: t`CSV`,
    //   onClick: () => {
    //     csvDataTrigger()
    //   },
    //   isLoading: csvDataLoading,
    // },
    // {
    //   icon: reloadIcon,
    //   text: t`Reload`,
    // onClick: handleReloadClick
    // },
    {
      icon: filterIcon,
      text: t`Filter`,
      onClick: () => setFilterOpen((prevSate) => !prevSate),
    },
    {
      icon: addIcon,
      text: t`Add`,
      link: '/channel/add',
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
    <Page title={t`Channel List`}>
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <TableContainer>
        {filterOpen && (
          <ChannelTableToolbar
            filterState={filterState}
            handleFilterStateReset={handleFilterStateReset}
            handleFilterApply={handleFilterApply}
            handleInputChange={handleFilterInputChange}
          />
        )}
        <TableAction breadcrumbsActions={tableActions} numSelected={selected.length} />
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
                  data?.data.map((result) => result.ChannelNo.toString())
                )
              }
            }}
            headerData={TABLE_HEAD}
          />
          <tbody className="divide-y divide-gray-200">
            {!isLoading && (
              <>
                {data?.data.map((row) => (
                  <ChannelTableRow
                    key={row.ChannelNo}
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

export default Channel
