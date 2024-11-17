// @ts-nocheck
import QueryString from 'qs'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendMultiDeleteRequest } from '../../api/swrConfig'
import { formatApi } from '../../api/urls'
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
import FormatTableToolbar from '../../components/pages/format/FormatTableToolbar'
import FormatTableRow from '../../components/pages/format/FormateTableRow'
import useAlert from '../../hooks/useAlert'
import useTable, { emptyRows } from '../../hooks/useTable'
import useUpdateRouteQueryWithReplace from '../../hooks/useUpdateRouteQueryWithReplace'
import routeProperty from '../../routes/routeProperty'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleFilterInputChange } from '../../types/components/common'
import { ITableHead } from '../../types/components/table'
import { IListServerResponse } from '../../types/pages/common'
import {
  IFormatApiQueryParams,
  IFormatFilters,
  IFormatResult,
  IFormatRouteQueryParams,
} from '../../types/pages/format'
import { addIcon, deleteIcon, filterIcon } from '../../utils/icons'
import t from '../../utils/translator'

const TABLE_HEAD: ITableHead[] = [
  { id: 'FormatNo', label: t`Format No`, filter: true },
  { id: 'FormatName', label: t`Format Name`, filter: true },
  { id: 'FormatDesc', label: t`Description`, filter: true },
  { id: 'DefaultFormat', label: t`Default Format`, filter: true },
  { id: 'FormatType', label: t`Format Type`, filter: true },
  { id: 'TotalLength', label: t`Total Length`, filter: true },
  { id: 'FacilityCode', label: t`Facility Code`, filter: true },
]

function Format() {
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
  const initialFilterState: IFormatFilters = {
    Apply: false,
    FormatNo: '',
    FormatName: '',
    TotalLength: '',
    FacilityCode: '',
  }
  // state to store the filter values
  const [filterState, setFilterState] = useState(initialFilterState)

  // ref to store the applied filter values
  const filterStateRef = useRef(filterState)

  // state for show and hide list filter section
  const [filterOpen, setFilterOpen] = useState(false)

  const handleFilterInputChange: THandleFilterInputChange = (name, value) => {
    // apply will false in every filter state change
    setFilterState((state) => ({ ...state, apply: false, [name]: value }))
  }

  // update filter state in the URL when filter state is apply or reset
  const updateFilterStateToQuery = () => {
    handleChangePage(1)

    const queryParams: IFormatRouteQueryParams = {
      page: 1,
      FormatNo: filterStateRef.current.FormatNo,
      FormatName: filterStateRef.current.FormatName,
      TotalLength: filterStateRef.current.TotalLength,
      FacilityCode: filterStateRef.current.FacilityCode,
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
    mutate(undefined, true)
  }

  // in route change or reload - filter state update by query value and apply to filter
  useEffect(() => {
    const queryParse = QueryString.parse(location.search)

    const queryState: IFormatFilters = {
      FormatNo: typeof queryParse.FormatNo === 'string' ? queryParse.FormatNo : '',
      FormatName: typeof queryParse.FormatName === 'string' ? queryParse.FormatName : '',
      TotalLength: typeof queryParse.TotalLength === 'string' ? queryParse.TotalLength : '',
      FacilityCode: typeof queryParse.FacilityCode === 'string' ? queryParse.FacilityCode : '',
      Apply: true,
    }
    setFilterState(queryState)
    filterStateRef.current = queryState
  }, [location.search, location.pathname])

  // create the query object for the API call
  const apiQueryParams: IFormatApiQueryParams = {
    offset: (page - 1) * rowsPerPage,
    limit: rowsPerPage,
    sort_by: orderBy,
    order,
    ...(filterStateRef.current.FormatNo && {
      FormatNo: filterStateRef.current.FormatNo,
    }),
    ...(filterStateRef.current.FormatName && {
      FormatName_icontains: filterStateRef.current.FormatName,
    }),
    ...(filterStateRef.current.TotalLength && {
      TotalLength_icontains: filterStateRef.current.TotalLength,
    }),
    ...(filterStateRef.current.FacilityCode && {
      FacilityCode_icontains: filterStateRef.current.FacilityCode,
    }),
  }

  const apiQueryString = QueryString.stringify(apiQueryParams)

  const { isLoading, data, mutate } = useSWR<IListServerResponse<IFormatResult[]>>(
    formatApi.list(apiQueryString)
  )

  // Define the mutation function to delete all selected partition from the server
  const { trigger: multipleDeleteTrigger } = useSWRMutation(
    formatApi.deleteMultiple,
    sendMultiDeleteRequest,
    {
      // Reload list date on successful delete
      onSuccess: () => {
        handleSelectAllRow(false, [])
        mutate()
      },
    }
  )

  const token = sessionStorage.getItem('accessToken')

  const handleDeleteMultiple = async () => {
    console.log(document.title)

    const requestData = { ids: selected }
    // const requestConfig: AxiosRequestConfig = {
    //     data: requestData,
    // };

    if (requestData.ids.length) {
      console.log(requestData.ids)
      console.log(selected)

      const jsonString = JSON.stringify(selected)

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/persons/formatInfoView/?format_ids=${encodeURIComponent(
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
      console.log(`new data =>`, data)

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
            <p>If you Delete this, the followings also:</p>
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
  //remove csv functionality and icon --rubel
  // mutation for fetch csv data from server and call downloadCsc
  // const { trigger: csvDataTrigger, isMutating: csvDataLoading } = useSWRMutation(
  //   formatApi.export,
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
  //   {
  //     icon: addIcon,
  //     text: t`Add`,
  //     link: routeProperty.formatCreate.path(),
  //   },
  // ]

  const breadcrumbsActions: IActionsButton[] = [
    {
      icon: filterIcon,
      text: t`Filter`,
      onClick: () => setFilterOpen((prevSate) => !prevSate),
    },
    {
      icon: addIcon,
      text: t`Add`,
      link: routeProperty.formatCreate.path(),
    },
    // {
    //   icon: groupEditIcon,
    //   // tooltip: 'Group edit',
    //   text: t`Group edit`,
    // },
    {
      icon: deleteIcon,
      text: t`Delete`,
      // tooltip: 'Delete',
      onClick: handleDeleteMultiple,
      disabled: selected.length === 0,
    },
  ]

  const isNotFound = !data?.data.length && !isLoading

  return (
    <Page>
      <Breadcrumbs />
      <TableContainer>
        {filterOpen && (
          <FormatTableToolbar
            filterState={filterState}
            handleFilterStateReset={handleFilterStateReset}
            handleFilterApply={handleFilterApply}
            handleInputChange={handleFilterInputChange}
          />
        )}
        <TableAction breadcrumbsActions={breadcrumbsActions} numSelected={selected.length} />
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
                  data?.data.map((result) => result.FormatNo.toString())
                )
              }
            }}
            headerData={TABLE_HEAD}
          />
          <tbody className="divide-y divide-gray-200">
            {!isLoading && (
              <>
                {data?.data.map((row) => (
                  <FormatTableRow
                    key={row.FormatNo}
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

export default Format
