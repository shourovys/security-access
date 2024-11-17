import QueryString from 'qs'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendMultiDeleteRequest } from '../../api/swrConfig'
import { contGateApi } from '../../api/urls'
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
import ContGateTableRow from '../../components/pages/contGate/ContGateTableRow'
import ContGateTableToolbar from '../../components/pages/contGate/ContGateTableToolbar'
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
  IContGateApiQueryParams,
  IContGateFilters,
  IContGateResult,
  IContGateRouteQueryParams,
} from '../../types/pages/contGate'
import { addIcon, deleteIcon, filterIcon, reloadIcon } from '../../utils/icons'
import t from '../../utils/translator'

const TABLE_HEAD: ITableHead[] = [
  { id: 'ContGateNo', label: t`ContGate No`, filter: true },
  { id: 'ContGateName', label: t`ContGate Name`, filter: true },
  { id: 'ContGateDesc', label: t`Description`, filter: true },
  { id: 'NodeName', label: t`Node`, filter: true }, ///added node name in a row ---rubel
  { id: 'MacAddress', label: t`Mac Address`, filter: true },
  { id: 'IpAddress', label: t`IP Address`, filter: true },
  { id: 'Online', label: t`Online`, filter: true },
  { id: 'Busy', label: t`Busy`, filter: true },
]

function ContGate() {
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

  // Apply property is used to determine whether to apply the filter. The filter will be applied when Apply is true.
  const initialFilterState: IContGateFilters = {
    Apply: false,
    ContGateNo: '',
    ContGateName: '',
    Node: null,
    MacAddress: '',
    IpAddress: '',
  }
  const [isDeletedIds, setIsDeletedIds] = useState<string[]>([])

  // const { trigger: multipleDeleteTrigger } = useSWRMutation(
  //   partitionApi.deleteMultiple,
  //   sendMultiDeleteRequest,
  //   {
  //     // Show a success message and redirect to partition list page on successful delete
  //     onSuccess: () => {
  //       handleSelectAllRow(false, [])
  //     },
  //     // If error occurred - make delete false
  //     onError: () => {
  //       setIsDeletedIds([])
  //     },
  //   }
  // )

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

    const queryParams: IContGateRouteQueryParams = {
      page: 1,
      ContGateNo: filterStateRef.current.ContGateNo,
      ContGateName: filterStateRef.current.ContGateName,
      NodeValue: filterStateRef.current.Node?.value,
      NodeLabel: filterStateRef.current.Node?.label,
      MacAddress: filterStateRef.current.MacAddress,
      IpAddress: filterStateRef.current.IpAddress,
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
  }

  // In route change or reload - filter state is updated by the query value and applied to the filter
  useEffect(() => {
    const queryParse = QueryString.parse(location.search)

    const queryState: IContGateFilters = {
      ContGateNo: typeof queryParse.ContGateNo === 'string' ? queryParse.ContGateNo : '',
      ContGateName: typeof queryParse.ContGateName === 'string' ? queryParse.ContGateName : '',
      Node:
        typeof queryParse.NodeValue === 'string' && typeof queryParse.NodeLabel === 'string'
          ? {
              label: queryParse.NodeLabel,
              value: queryParse.NodeValue,
            }
          : null,
      MacAddress: typeof queryParse.MacAddress === 'string' ? queryParse.MacAddress : '',
      IpAddress: typeof queryParse.IpAddress === 'string' ? queryParse.IpAddress : '',
      Apply: true,
    }

    setFilterState(queryState)
    filterStateRef.current = queryState
  }, [location.search, location.pathname])

  // query object of pagination, sorting, filtering
  const apiQueryParams: IContGateApiQueryParams = {
    offset: (page - 1) * rowsPerPage,
    limit: rowsPerPage,
    sort_by: orderBy,
    order,
    ...(filterStateRef.current.ContGateNo && {
      ContGateNo: filterStateRef.current.ContGateNo,
    }),
    ...(filterStateRef.current.ContGateName && {
      ContGateName_icontains: filterStateRef.current.ContGateName,
    }),
    ...(filterStateRef.current.Node?.value && {
      NodeNo: filterStateRef.current.Node.value,
    }),
    ...(filterStateRef.current.MacAddress && {
      MacAddress_icontains: filterStateRef.current.MacAddress,
    }),
    ...(filterStateRef.current.IpAddress && {
      IpAddress_icontains: filterStateRef.current.IpAddress,
    }),
  }

  const apiQueryString = QueryString.stringify(apiQueryParams)

  const { isLoading, data, mutate } = useSWR<IListServerResponse<IContGateResult[]>>(
    contGateApi.list(apiQueryString)
  )

  // // Define the mutation function to delete all selected partition from the server
  const { trigger: multipleDeleteTrigger } = useSWRMutation(
    contGateApi.deleteMultiple,
    sendMultiDeleteRequest,
    {
      // Refetch list data on successful delete
      onSuccess: () => {
        handleSelectAllRow(false, [])
        mutate()
      },
    }
  )

  const token = sessionStorage.getItem('accessToken')

  const handleDeleteMultiple = async () => {
    const requestData = { ids: selected }
    // const requestConfig: AxiosRequestConfig = {
    //     data: requestData,
    // };

    if (requestData.ids.length) {
      // console.log(requestData.ids)
      // console.log(selected)

      const jsonString = JSON.stringify(selected)

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/devices/contgatesinfo/?cont_gate_ids=${encodeURIComponent(
          jsonString
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const data = await res.json()

      const messages = []

      for (const key in data) {
        if (data[key] !== undefined && data[key] !== 0) {
          messages.push(`${data[key]}`)
        }
      }

      const tableRows = messages.map((message, index) => (
        <tr key={index}>
          <td>{message}</td>
        </tr>
      ))

      // Construct the entire message with a table
      const myMessage =
        messages.length > 0 ? (
          <div>
            <p>If you delete this, the followings also:</p>
            <table>
              <tbody>{tableRows}</tbody>
            </table>
            <p>Do you want to Delete?</p>
          </div>
        ) : null

      const handleDelete = async () => {
        return multipleDeleteTrigger({
          data: requestData,
        }).then(() => {
          // update detected rows id for refetch table data
          setIsDeletedIds(selected)
        })
      }

      if (messages.includes('')) {
        openAlertDialogWithPromise(
          handleDelete,
          { success: t`Success` },
          t`Do you want to Delete ?`
        )
      } else {
        openAlertDialogWithPromise(handleDelete, { success: t`Success` }, myMessage as any)
      }
    }
  }

  // // mutation for fetch csv data from server and call downloadCsc
  // const { trigger: csvDataTrigger, isMutating: csvDataLoading } = useSWRMutation(
  //   contGateApi.export,
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
      link: routeProperty.contGateCreate.path(),
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
    <Page title={t`ContGate List`}>
      <Breadcrumbs breadcrumbsActions={breadcrumbsActions} />
      <TableContainer>
        {filterOpen && (
          <ContGateTableToolbar
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
                  data?.data.map((result) => result.ContGateNo.toString())
                )
              }
            }}
            headerData={TABLE_HEAD}
          />
          <tbody className="divide-y divide-gray-200">
            {!isLoading && (
              <>
                {data?.data.map((row) => (
                  <ContGateTableRow
                    key={row.ContGateNo}
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

export default ContGate
