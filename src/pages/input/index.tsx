import { fetcher, sendPostRequest } from '../../api/swrConfig'
import { inputApi } from '../../api/urls'
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
import InputTableRow from '../../components/pages/input/InputTableRow'
import InputTableToolbar from '../../components/pages/input/InputTableToolbar'
import useAlert from '../../hooks/useAlert'
import useTable, { emptyRows } from '../../hooks/useTable'
import useUpdateRouteQueryWithReplace from '../../hooks/useUpdateRouteQueryWithReplace'
import QueryString from 'qs'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import routeProperty from '../../routes/routeProperty'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleFilterInputChange } from '../../types/components/common'
import { ITableAction, ITableHead } from '../../types/components/table'
import { IListServerResponse } from '../../types/pages/common'
import {
  IInputApiQueryParams,
  IInputFilters,
  IInputResult,
  IInputRouteQueryParams,
} from '../../types/pages/input'
import downloadCsv from '../../utils/downloadCsv'
import { csvIcon, groupEditIcon, probeIcon, filterIcon } from '../../utils/icons'
import t from '../../utils/translator'
import useAuth from '../../hooks/useAuth'

function Input() {
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
  } = useTable({ defaultOrderBy: 'InputNo' })
  // hook to update the query in the URL
  const updateRouteQueryWithReplace = useUpdateRouteQueryWithReplace()
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  const TABLE_HEAD: ITableHead[] = [
    { id: 'InputNo', label: t`Input No`, filter: true },
    ...(showPartition ? [{ id: 'PartitionNo', label: t`Partition`, filter: true }] : []),
    { id: 'InputName', label: t`Input Name`, filter: true },
    { id: 'InputDesc', label: t`Description`, filter: true },
    { id: 'NodeNo', label: t`Node`, filter: true },
    { id: 'InputPort', label: t`Input Port`, filter: true },
    { id: 'InputType', label: t`Input Type`, filter: true },
    { id: 'InputStat', label: t`Input Stat`, filter: true },
  ]

  // apply property use for apply filter. filter will apply when apply is true
  const initialFilterState: IInputFilters = {
    InputNo: '',
    InputName: '',
    Partition: null,
    Node: null,
    Apply: false,
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

    const queryParams: IInputRouteQueryParams = {
      page: 1,
      InputNo: filterStateRef.current.InputNo,
      InputName: filterStateRef.current.InputName,
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

  // In route change or reload - filter state update by query value and apply to filter
  useEffect(() => {
    const queryParse = QueryString.parse(location.search)

    const queryState: IInputFilters = {
      InputNo: typeof queryParse.InputNo === 'string' ? queryParse.InputNo : '',
      InputName: typeof queryParse.InputName === 'string' ? queryParse.InputName : '',
      Partition:
        typeof queryParse.PartitionValue === 'string' &&
        typeof queryParse.PartitionLabel === 'string'
          ? {
              value: queryParse.PartitionValue,
              label: queryParse.PartitionLabel,
            }
          : null,
      Node:
        typeof queryParse.NodeValue === 'string' && typeof queryParse.NodeLabel === 'string'
          ? {
              value: queryParse.NodeValue,
              label: queryParse.NodeLabel,
            }
          : null,
      Apply: true,
    }

    setFilterState(queryState)
    filterStateRef.current = queryState
  }, [location.search, location.pathname])

  // Create the query object for the API call
  const apiQueryParams: IInputApiQueryParams = {
    offset: (page - 1) * rowsPerPage,
    limit: rowsPerPage,
    sort_by: orderBy,
    order,
    ...(filterStateRef.current.InputNo && {
      InputNo: filterStateRef.current.InputNo,
    }),
    ...(filterStateRef.current.InputName && {
      InputName_icontains: filterStateRef.current.InputName,
    }),
    ...(filterStateRef.current.Partition?.value && {
      partition: filterStateRef.current.Partition.value,
    }),
    ...(filterStateRef.current.Node?.value && {
      node: filterStateRef.current.Node.value,
    }),
  }

  const apiQueryString = QueryString.stringify(apiQueryParams)

  const { isLoading, data, mutate } = useSWR<IListServerResponse<IInputResult[]>>(
    inputApi.list(apiQueryString)
  )

  // mutation for fetch csv data from server and call downloadCsc
  // const { trigger: csvDataTrigger, isMutating: csvDataLoading } = useSWRMutation(
  //   inputApi.export,
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
  // ]

  // Define the mutation function to probe all selected nodes
  // const { trigger: probeTrigger } = useSWRMutation(inputApi.probe, sendPostRequest, {
  //   onSuccess: () => {
  //     handleSelectAllRow(false, [])
  //     mutate()
  //   },
  // })

  // const handleProbe = () => {
  //   if (selected.length) {
  //     const handleProbeTrigger = () =>
  //       probeTrigger({
  //         InputNos: selected,
  //       })

  //     openAlertDialogWithPromise(
  //       handleProbeTrigger,
  //       { success: t`Probe Success` },
  //       t('Do you want to Probe the selected inputs?')
  //     )
  //   }
  // }

  const breadcrumbsActions: IActionsButton[] = [
    {
      icon: filterIcon,
      text: t`Filter`,
      onClick: () => setFilterOpen((prevSate) => !prevSate),
    },
    // {
    //   icon: probeIcon,
    //   text: t`Probe`,
    //   // tooltip: 'Probe',
    //   onClick: handleProbe,
    //   disabled: selected.length === 0,
    // },
    {
      text: t`Group edit`,
      icon: groupEditIcon,
      // tooltip: 'Group edit',
      link: routeProperty.inputGroupEdit.path(selected.join(',')),
      disabled: selected.length === 0,
    },
  ]

  const isNotFound = !data?.data.length && !isLoading

  return (
    <Page>
      <Breadcrumbs />
      <TableContainer>
        {filterOpen && (
          <InputTableToolbar
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
                  data?.data.map((result) => result.InputNo.toString())
                )
              }
            }}
            headerData={TABLE_HEAD}
          />
          <tbody className="divide-y divide-gray-200">
            {!isLoading && (
              <>
                {data?.data.map((row) => (
                  <InputTableRow
                    key={row.InputNo}
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

export default Input
