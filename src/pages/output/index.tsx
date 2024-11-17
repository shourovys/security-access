import { fetcher, sendPostRequest } from '../../api/swrConfig'
import { outputApi } from '../../api/urls'
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
import OutputTableRow from '../../components/pages/output/OutputTableRow'
import OutputTableToolbar from '../../components/pages/output/OutputTableToolbar'
import useAlert from '../../hooks/useAlert'
import useTable, { emptyRows } from '../../hooks/useTable'
import useUpdateRouteQueryWithReplace from '../../hooks/useUpdateRouteQueryWithReplace'
import QueryString from 'qs'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import routeProperty from '../../routes/routeProperty'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { IActionButtonsGroup, IActionsButton } from '../../types/components/actionButtons'
import { THandleFilterInputChange } from '../../types/components/common'
import { ITableAction, ITableHead } from '../../types/components/table'
import { IListServerResponse } from '../../types/pages/common'
import {
  IOutputApiQueryParams,
  IOutputFilters,
  IOutputResult,
  IOutputRouteQueryParams,
} from '../../types/pages/output'
import downloadCsv from '../../utils/downloadCsv'
import {
  activeIcon,
  autoIcon,
  csvIcon,
  groupEditIcon,
  inactiveIcon,
  filterIcon,
} from '../../utils/icons'
import t from '../../utils/translator'
import useAuth from '../../hooks/useAuth'

function Output() {
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
  } = useTable({ defaultOrderBy: 'OutputNo' })
  // hook to update the query in the URL
  const updateRouteQueryWithReplace = useUpdateRouteQueryWithReplace()
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  const TABLE_HEAD: ITableHead[] = [
    { id: 'OutputNo', label: t`Output No`, filter: true },
    ...(showPartition ? [{ id: 'PartitionNo', label: t`Partition`, filter: true }] : []),
    { id: 'OutputName', label: t`Output Name`, filter: true },
    { id: 'OutputDesc', label: t`Description`, filter: true },
    { id: 'NodeNo', label: t`Node`, filter: true },
    { id: 'OutputPort', label: t`Output Port`, filter: true },
    { id: 'OutputType', label: t`Output Type`, filter: true },
    { id: 'OutputStat', label: t`Output Stat`, filter: true },
  ]

  // apply property use for apply filter. filter will apply when apply is true
  const initialFilterState: IOutputFilters = {
    Apply: false,
    OutputNo: '',
    OutputName: '',
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

    const queryParams: IOutputRouteQueryParams = {
      page: 1,
      OutputNo: filterStateRef.current.OutputNo,
      OutputName: filterStateRef.current.OutputName,
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

  // in route change or reload - filter state update by query value and apply to filter
  useEffect(() => {
    const queryParse = QueryString.parse(location.search)

    const queryState: IOutputFilters = {
      OutputNo: typeof queryParse.OutputNo === 'string' ? queryParse.OutputNo : '',
      OutputName: typeof queryParse.OutputName === 'string' ? queryParse.OutputName : '',
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
  const apiQueryParams: IOutputApiQueryParams = {
    offset: (page - 1) * rowsPerPage,
    limit: rowsPerPage,
    sort_by: orderBy,
    order,
    ...(filterStateRef.current.OutputNo && {
      OutputNo: filterStateRef.current.OutputNo,
    }),
    ...(filterStateRef.current.OutputName && {
      OutputName_icontains: filterStateRef.current.OutputName,
    }),
    ...(filterStateRef.current.Partition?.value && {
      PartitionNo: filterStateRef.current.Partition.value,
    }),
    ...(filterStateRef.current.Node?.value && {
      NodeNo: filterStateRef.current.Node.value,
    }),
  }

  const apiQueryString = QueryString.stringify(apiQueryParams)

  const { isLoading, data, mutate } = useSWR<IListServerResponse<IOutputResult[]>>(
    outputApi.list(apiQueryString)
  )

  // mutation for fetch csv data from server and call downloadCsc
  // const { trigger: csvDataTrigger, isMutating: csvDataLoading } = useSWRMutation(
  //   outputApi.export,
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

  // Define the mutation function to update output status (Inactive, Active, Auto) all selected output
  const { trigger: outputStatusTrigger } = useSWRMutation(outputApi.action, sendPostRequest, {
    onSuccess: () => {
      handleSelectAllRow(false, [])
      mutate()
    },
  })

  const handleOutputStatus = (outputStatus: 'Inactive' | 'Active' | 'Auto') => {
    if (selected.length) {
      const handleStatusTrigger = () =>
        outputStatusTrigger({
          OutputNos: selected,
          Action: outputStatus,
        })

      openAlertDialogWithPromise(
        handleStatusTrigger,
        { success: `Success` },
        // { success: t`Output ${outputStatus} Status Update successful` },
        t`Do you want to ${outputStatus}?`
        //  { `Do you really want to update output status to ${outputStatus} for the selected output?`},
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
        text: t`Group edit`,
        icon: groupEditIcon,
        // tooltip: 'Group edit',
        link: routeProperty.outputGroupEdit.path(selected.join(',')),
        disabled: selected.length === 0,
      },
    ],
    Control: [
      {
        text: t`Inactive`,
        icon: inactiveIcon,
        // tooltip: 'Inactive',
        onClick: () => handleOutputStatus('Inactive'),
        disabled: selected.length === 0,
      },
      {
        text: t`Active`,
        icon: activeIcon,
        // tooltip: 'Active',
        onClick: () => handleOutputStatus('Active'),
        disabled: selected.length === 0,
      },
      {
        text: t`Auto`,
        icon: autoIcon,
        // tooltip: 'Auto',
        onClick: () => handleOutputStatus('Auto'),
        disabled: selected.length === 0,
      },
    ],
  }

  const isNotFound = !data?.data.length && !isLoading

  return (
    <Page>
      <Breadcrumbs />
      <TableContainer>
        {filterOpen && (
          <OutputTableToolbar
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
                  data?.data.map((result) => result.OutputNo.toString())
                )
              }
            }}
            headerData={TABLE_HEAD}
          />
          <tbody className="divide-y divide-gray-200">
            {!isLoading && (
              <>
                {data?.data.map((row) => (
                  <OutputTableRow
                    key={row.OutputNo}
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

export default Output
