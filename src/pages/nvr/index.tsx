import QueryString from 'qs'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendMultiDeleteRequest } from '../../api/swrConfig'
import { nvrApi } from '../../api/urls'
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
import NvrTableRow from '../../components/pages/nvr/NvrTableRow'
import NvrTableToolbar from '../../components/pages/nvr/NvrTableToolbar'
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
  INvrApiQueryParams,
  INvrFilters,
  INvrResult,
  INvrRouteQueryParams,
} from '../../types/pages/nvr'
import { addIcon, deleteIcon, filterIcon, reloadIcon } from '../../utils/icons'
import t from '../../utils/translator'

const TABLE_HEAD: ITableHead[] = [
  { id: 'NvrNo', label: t`NVR No`, filter: true },
  { id: 'NvrName', label: t`NVR Name`, filter: true },
  { id: 'NvrDesc', label: t`Description`, filter: true },
  { id: 'NvrType', label: t`NVR Type`, filter: true },
  { id: 'IpAddress', label: t`IP Address`, filter: true },
]

function NVR() {
  const location = useLocation()

  const [isDeletedIds, setIsDeletedIds] = useState<string[]>([])

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
  const initialFilterState: INvrFilters = {
    Apply: false,
    NvrNo: '',
    NvrName: '',
    IpAddress: '',
    NvrType: null,
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

    const queryParams: INvrRouteQueryParams = {
      page: 1,
      NvrNo: filterStateRef.current.NvrNo,
      NvrName: filterStateRef.current.NvrName,
      IpAddress: filterStateRef.current.IpAddress,
      NvrTypeValue: filterStateRef.current.NvrType?.value,
      NvrTypeLabel: filterStateRef.current.NvrType?.label,
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

    const queryState: INvrFilters = {
      NvrNo: typeof queryParse.NvrNo === 'string' ? queryParse.NvrNo : '',
      NvrName: typeof queryParse.NvrName === 'string' ? queryParse.NvrName : '',
      IpAddress: typeof queryParse.IpAddress === 'string' ? queryParse.IpAddress : '',
      NvrType:
        typeof queryParse.NvrTypeValue === 'string' && typeof queryParse.NvrTypeLabel === 'string'
          ? {
              label: queryParse.NvrTypeLabel,
              value: queryParse.NvrTypeValue,
            }
          : null,
      Apply: true,
    }

    setFilterState(queryState)
    filterStateRef.current = queryState
  }, [location.search, location.pathname])

  // create the query object for the API call
  const apiQueryParams: INvrApiQueryParams = {
    offset: (page - 1) * rowsPerPage,
    limit: rowsPerPage,
    sort_by: orderBy,
    order,
    ...(filterStateRef.current.NvrNo && {
      NvrNo: filterStateRef.current.NvrNo,
    }),
    ...(filterStateRef.current.NvrName && {
      NvrName_icontains: filterStateRef.current.NvrName,
    }),
    ...(filterStateRef.current.IpAddress && {
      IpAddress_icontains: filterStateRef.current.IpAddress,
    }),
    ...(filterStateRef.current.NvrType?.value && {
      NvrType: filterStateRef.current.NvrType.value,
    }),
  }

  const apiQueryString = QueryString.stringify(apiQueryParams)

  const { isLoading, data, mutate } = useSWR<IListServerResponse<INvrResult[]>>(
    nvrApi.list(apiQueryString)
  )

  // Define the mutation function to delete all selected partition from the server
  const { trigger: multipleDeleteTrigger } = useSWRMutation(
    nvrApi.deleteMultiple,
    sendMultiDeleteRequest,
    {
      // Show a success message and redirect to partition list page on successful delete
      onSuccess: () => {
        handleSelectAllRow(false, [])
        mutate()
      },
    }
  )

  // const handleDeleteMultiple = () => {
  //   const requestData = { ids: selected }
  //   // const requestConfig: AxiosRequestConfig = {
  //   //     data: requestData,
  //   // };

  //   if (requestData.ids.length) {
  //     const handleDelete = () => {
  //       return multipleDeleteTrigger({
  //         data: requestData,
  //       })
  //     }

  //     openAlertDialogWithPromise(handleDelete, { success: t`Successful` })
  //   }
  // }

  const token = sessionStorage.getItem('accessToken')

  const handleDeleteMultiple = async () => {
    console.log(document.title)

    const requestData = { ids: selected }
    // const requestConfig: AxiosRequestConfig = {
    //     data: requestData,
    // };

    if (requestData.ids.length) {
      const jsonString = JSON.stringify(selected)

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/devices/nvrInfoView/?nvr_ids=${encodeURIComponent(
          jsonString
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const data = await res.json()
      //const dark = JSON.stringify(data)
      // console.log(`new data =>`, data)

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
        openAlertDialogWithPromise(handleDelete, { success: t`Success` }, 'Do you want to Delete ?')
      } else {
        openAlertDialogWithPromise(handleDelete, { success: t`Success` }, myMessage as any)
      }
    }
  }

  // mutation for fetch csv data from server and call downloadCsc
  // const { trigger: csvDataTrigger, isMutating: csvDataLoading } = useSWRMutation(
  //   nvrApi.export,
  //   fetcher,
  //   {
  //     onSuccess: (csvData) => {
  //       downloadCsv(csvData, location)
  //     },
  //   }
  // )

  //Change add position and add delete icon(modify breadcrumbsActions position also and added delete  button disablity when not selected any row).--rubel

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
      link: routeProperty.nvrCreate.path(),
    },
    {
      icon: deleteIcon,
      text: t`Delete`,
      onClick: handleDeleteMultiple,
      disabled: selected.length === 0,
    },
  ]

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

  const isNotFound = !data?.data.length && !isLoading

  return (
    <Page title={t`NVR List`}>
      <Breadcrumbs
        breadcrumbsActions={breadcrumbsActions}
        pageRoutes={[
          {
            href: routeProperty.nvr.path(),
            text: 'NVR',
          },
          {
            href: '',
            text: 'List',
          },
        ]}
        pageTitle="NVR"
      />
      <TableContainer>
        {filterOpen && (
          <NvrTableToolbar
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
                  data?.data.map((result) => result.NvrNo.toString())
                )
              }
            }}
            headerData={TABLE_HEAD}
          />
          <tbody className="divide-y divide-gray-200">
            {!isLoading && (
              <>
                {data?.data.map((row) => (
                  <NvrTableRow
                    key={row.NvrNo}
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

export default NVR
