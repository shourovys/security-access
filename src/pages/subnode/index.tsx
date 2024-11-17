import QueryString from 'qs'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendMultiDeleteRequest } from '../../api/swrConfig'
import { subnodeApi } from '../../api/urls'
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
import SubnodeTableRow from '../../components/pages/subnode/SubnodeTableRow'
import SubnodeTableToolbar from '../../components/pages/subnode/SubnodeTableToolbar'
import useAlert from '../../hooks/useAlert'
import useReloadMasterNodeAction from '../../hooks/useRebootAction'
import useTable, { emptyRows } from '../../hooks/useTable'
import useUpdateRouteQueryWithReplace from '../../hooks/useUpdateRouteQueryWithReplace'
import routeProperty from '../../routes/routeProperty'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleFilterInputChange } from '../../types/components/common'
import { ITableHead } from '../../types/components/table'
import { IListServerResponse } from '../../types/pages/common'
import {
  ISubnodeApiQueryParams,
  ISubnodeFilters,
  ISubnodeResult,
  ISubnodeRouteQueryParams,
} from '../../types/pages/subnode'
import { addIcon, deleteIcon, filterIcon, reloadIcon } from '../../utils/icons'
import t from '../../utils/translator'

const TABLE_HEAD: ITableHead[] = [
  { id: 'SubnodeNo', label: t`Subnode No`, filter: true },
  { id: 'SubnodeName', label: t`Subnode Name`, filter: true },
  { id: 'SubnodeDesc', label: t`Description`, filter: true },
  { id: 'NodeNo', label: t`Node`, filter: true },
  { id: 'Address', label: t`Address`, filter: true },
  { id: 'DeviceType', label: t`Device Type`, filter: true },
  { id: 'PortCount', label: t`Port Count`, filter: true },
  { id: 'Online', label: t`Online`, filter: true },
]

function Subnode() {
  const location = useLocation()

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
  } = useTable({ defaultOrderBy: TABLE_HEAD[0].id })
  // hook to update the query in the URL
  const updateRouteQueryWithReplace = useUpdateRouteQueryWithReplace()
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // apply property used to apply the filter. The filter will be applied when apply is true.
  const initialFilterState: ISubnodeFilters = {
    Apply: false,
    SubnodeNo: '',
    SubnodeName: '',
    Address: '',
    Node: null,
  }

  // state to store the filter values
  const [filterState, setFilterState] = useState(initialFilterState)

  // ref to store the applied filter values
  const filterStateRef = useRef(filterState)

  // state for show and hide list filter section
  const [filterOpen, setFilterOpen] = useState(false)

  const handleFilterInputChange: THandleFilterInputChange = (name, value) => {
    // apply will be false for every filter state change
    setFilterState((state) => ({ ...state, Apply: false, [name]: value }))
  }

  // update filter state in the URL when the filter state is applied or reset
  const updateFilterStateToQuery = () => {
    handleChangePage(1)

    const queryParams: ISubnodeRouteQueryParams = {
      page: 1,
      SubnodeNo: filterStateRef.current.SubnodeNo,
      SubnodeName: filterStateRef.current.SubnodeName,
      Address: filterStateRef.current.Address,
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

  // on route change or reload, the filter state updates based on the query values and applies the filter
  useEffect(() => {
    const queryParse = QueryString.parse(location.search)

    const queryState: ISubnodeFilters = {
      SubnodeNo: typeof queryParse.SubnodeNo === 'string' ? queryParse.SubnodeNo : '',
      SubnodeName: typeof queryParse.SubnodeName === 'string' ? queryParse.SubnodeName : '',
      Address: typeof queryParse.Address === 'string' ? queryParse.Address : '',
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
  const apiQueryParams: ISubnodeApiQueryParams = {
    offset: (page - 1) * rowsPerPage,
    limit: rowsPerPage,
    sort_by: orderBy,
    order,
    ...(filterStateRef.current.SubnodeNo && {
      SubnodeNo: filterStateRef.current.SubnodeNo,
    }),
    ...(filterStateRef.current.SubnodeName && {
      SubnodeName_icontains: filterStateRef.current.SubnodeName,
    }),
    ...(filterStateRef.current.Address && {
      Address_icontains: filterStateRef.current.Address,
    }),
    ...(filterStateRef.current.Node?.value && {
      NodeNo: filterStateRef.current.Node.value,
    }),
  }

  const apiQueryString = QueryString.stringify(apiQueryParams)

  const { isLoading, data, mutate } = useSWR<IListServerResponse<ISubnodeResult[]>>(
    subnodeApi.list(apiQueryString)
  )

  // Define the mutation function to delete all selected partition from the server
  const { trigger: multipleDeleteTrigger } = useSWRMutation(
    subnodeApi.deleteMultiple,
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
  //   subnodeApi.export,
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
    // },
    {
      icon: filterIcon,
      text: t`Filter`,
      onClick: () => setFilterOpen((prevSate) => !prevSate),
    },
    {
      icon: addIcon,
      text: t`Add`,
      link: routeProperty.subnodeCreate.path(),
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
    <Page title={t`Subnode List`}>
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <TableContainer>
        {filterOpen && (
          <SubnodeTableToolbar
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
                  data?.data.map((result) => result.SubnodeNo.toString())
                )
              }
            }}
            headerData={TABLE_HEAD}
          />
          <tbody className="divide-y divide-gray-200">
            {!isLoading && (
              <>
                {data?.data.map((row) => (
                  <SubnodeTableRow
                    key={row.SubnodeNo}
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

export default Subnode
