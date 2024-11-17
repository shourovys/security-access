// @ts-nocheck
import QueryString from 'qs'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendMultiDeleteRequest } from '../../api/swrConfig'
import { serialApi } from '../../api/urls'
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
import SerialTableRow from '../../components/pages/serial/SerialTableRow'
import SerialTableToolbar from '../../components/pages/serial/SerialTableToolbar'
import useAlert from '../../hooks/useAlert'
import useTable, { emptyRows } from '../../hooks/useTable'
import useUpdateRouteQueryWithReplace from '../../hooks/useUpdateRouteQueryWithReplace'
import routeProperty from '../../routes/routeProperty'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleFilterInputChange } from '../../types/components/common'
import { ITableAction, ITableHead } from '../../types/components/table'
import { IListServerResponse } from '../../types/pages/common'
import {
  ISerialApiQueryParams,
  ISerialFilters,
  ISerialResult,
  ISerialRouteQueryParams,
} from '../../types/pages/serial'
import { addIcon, deleteIcon } from '../../utils/icons'
import t from '../../utils/translator'

const TABLE_HEAD: ITableHead[] = [
  { id: 'id', label: t`Serial No`, filter: true },
  { id: 'name', label: t`Serial Name`, filter: true },
  { id: 'description', label: t`Description`, filter: true },
  { id: 'node', label: t`Node`, filter: true },
  { id: 'device', label: t`Device`, filter: true },
]

function Serial() {
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

  // apply property use for apply filter. filter will apply when apply is true
  const initialFilterState: ISerialFilters = {
    apply: false,
    id: '',
    name: '',
    device: '',
    node: null,
  }
  // state to store the filter values
  const [filterState, setFilterState] = useState(initialFilterState)
  // state to store deleted rows ids
  const [isDeletedIds, setIsDeletedIds] = useState<string[]>([])

  // ref to store the applied filter values
  const filterStateRef = useRef(filterState)

  const handleFilterInputChange: THandleFilterInputChange = (name, value) => {
    // apply will false in every filter state change
    setFilterState((state) => ({ ...state, apply: false, [name]: value }))
  }

  // update filter state in the URL when filter state is apply or reset
  const updateFilterStateToQuery = () => {
    handleChangePage(1)

    const queryParams: ISerialRouteQueryParams = {
      page: 1,
      id: filterStateRef.current.id,
      name: filterStateRef.current.name,
      device: filterStateRef.current.device,
      nodeValue: filterStateRef.current.node?.value,
      nodeLabel: filterStateRef.current.node?.label,
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
    handleFilterInputChange('apply', true)
  }
  // handle the reset button for the filters
  const handleFilterStateReset = () => {
    // on filter apply filterStateRef update to initial filter state
    filterStateRef.current = initialFilterState
    updateFilterStateToQuery()
    setFilterState(initialFilterState)
  }

  // in route change or reload - filter state update by query value and apply to filter
  useEffect(() => {
    const queryParse = QueryString.parse(location.search)

    const queryState: ISerialFilters = {
      id: typeof queryParse.id === 'string' ? queryParse.id : '',
      name: typeof queryParse.name === 'string' ? queryParse.name : '',
      device: typeof queryParse.device === 'string' ? queryParse.device : '',
      node:
        typeof queryParse.nodeValue === 'string' && typeof queryParse.nodeLabel === 'string'
          ? {
              label: queryParse.nodeLabel,
              value: queryParse.nodeValue,
            }
          : null,
      apply: true,
    }
    setFilterState(queryState)
    filterStateRef.current = queryState
  }, [location.search, location.pathname])

  // create the query object for the API call
  const apiQueryParams: ISerialApiQueryParams = {
    offset: (page - 1) * rowsPerPage,
    limit: rowsPerPage,
    sort_by: orderBy,
    order,
    ...(filterStateRef.current.id && {
      id_icontains: filterStateRef.current.id,
    }),
    ...(filterStateRef.current.name && {
      name_icontains: filterStateRef.current.name,
    }),
    ...(filterStateRef.current.device && {
      device_icontains: filterStateRef.current.device,
    }),
    ...(filterStateRef.current.node?.value && {
      node: filterStateRef.current.node.value,
    }),
    // query for fetch table data after delete row
    ...(isDeletedIds.length && {
      isDeletedIds: JSON.stringify(isDeletedIds),
    }),
  }

  const apiQueryString = QueryString.stringify(apiQueryParams)

  const { isLoading, data } = useSWR<IListServerResponse<ISerialResult[]>>(
    serialApi.list(apiQueryString)
  )

  // Define the mutation function to delete all selected partition from the server
  const { trigger: multipleDeleteTrigger } = useSWRMutation(
    serialApi.deleteMultiple,
    sendMultiDeleteRequest,
    {
      // Show a success message and redirect to partition list page on successful delete
      onSuccess: () => {
        handleSelectAllRow(false, [])
      },
      // If error occurred - make delete false
      onError: () => {
        setIsDeletedIds([])
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
        }).then(() => {
          // update detected rows id for refetch table data
          setIsDeletedIds(selected)
        })
      }

      openAlertDialogWithPromise(handleDelete, { success: t`Success` }, t`Do you want to Delete ?`)
    }
  }

  const breadcrumbsActions: IActionsButton[] = [
    {
      icon: addIcon,
      text: t`Add`,
      link: routeProperty.serialCreate.path(),
    },
  ]

  const tableActions: ITableAction[] = [
    {
      icon: deleteIcon,
      tooltip: t`Delete`,
      onClick: handleDeleteMultiple,
    },
  ]

  const isNotFound = !data?.data.length && !isLoading

  return (
    <Page title={t`Serial List`}>
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <TableContainer>
        <SerialTableToolbar
          filterState={filterState}
          handleFilterStateReset={handleFilterStateReset}
          handleFilterApply={handleFilterApply}
          handleInputChange={handleFilterInputChange}
        />
        <TableAction tableActions={tableActions} numSelected={selected.length} />
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
                handleSelectAllRow(isAllSelected, data?.data.map((result) => result.id.toString()))
              }
            }}
            headerData={TABLE_HEAD}
          />
          <tbody className="divide-y divide-gray-200">
            {!isLoading && (
              <>
                {data?.data.map((row) => (
                  <SerialTableRow
                    key={row.id}
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

export default Serial
