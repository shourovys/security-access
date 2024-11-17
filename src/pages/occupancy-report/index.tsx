import QueryString from 'qs'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { fetcher, sendPostRequest } from '../../api/swrConfig'
import { maintenanceActionApi, occupancyReportApi } from '../../api/urls'
import Page from '../../components/HOC/Page'
import CardModal from '../../components/HOC/modal/CardModal'
import Table from '../../components/HOC/style/table/Table'
import TableContainer from '../../components/HOC/style/table/TableContainer'
import RadioButtons from '../../components/atomic/RadioButtons'
import { ISelectOption } from '../../components/atomic/Selector'
import Pagination from '../../components/common/table/Pagination'
import ReportAction from '../../components/common/table/ReportActon'
import TableEmptyRows from '../../components/common/table/TableEmptyRows'
import TableHeader from '../../components/common/table/TableHeader'
import TableNoData from '../../components/common/table/TableNoData'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import TableBodyLoading from '../../components/loading/table/TableBodyLoading'
import OccupancyReportTableRow from '../../components/pages/occupancyreport/OccupancyReportTableRow'
import OccupancyReportTableToolbar from '../../components/pages/occupancyreport/OccupancyReportTableToolbar'
import useAuth from '../../hooks/useAuth'
import useTable, { emptyRows } from '../../hooks/useTable'
import useUpdateRouteQueryWithReplace from '../../hooks/useUpdateRouteQueryWithReplace'
import routeProperty from '../../routes/routeProperty'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleFilterInputChange } from '../../types/components/common'
import { ITableHead } from '../../types/components/table'
import { LicenseCheckType } from '../../types/context/auth'
import { IListServerResponse } from '../../types/pages/common'
import {
  IOccupancyReportApiQueryParams,
  IOccupancyReportFilters,
  IOccupancyReportStoreQueryParams,
  IOccupancyResult,
} from '../../types/pages/occupancyReport'
import downloadCsv from '../../utils/downloadCsv'
import {
  copyLogFromDatabaseIcon,
  getbackLogFromArchiveIcon,
  printIcon,
  saveIcon,
} from '../../utils/icons'
import { addSuccessfulToast, exportSuccessfulToast } from '../../utils/toast'
import t from '../../utils/translator'
import OccupancyReportPrintModal from '../../components/pages/occupancyreport/OccupancyReportPrintModal'

const TABLE_HEAD: ITableHead[] = [
  { id: 'RegionName', label: t`Region`, filter: true },
  { id: 'FirstName', label: t`First Name`, filter: true },
  { id: 'LastName', label: t`Last Name`, filter: true },
  { id: 'EventTime', label: t`Event Time`, filter: true },
  { id: 'Duration', label: t`Duration`, filter: false },
]

function OccupancyReport() {
  const location = useLocation()
  const { layout, has_license } = useAuth()

  const {
    page,
    rowsPerPage,
    order,
    orderBy,
    handleChangePage,
    handleSort,
    handleOrder,
    handleChangeRowsPerPage,
  } = useTable({ defaultOrderBy: TABLE_HEAD[0].id })
  // hook to update the query in the URL
  const updateRouteQueryWithReplace = useUpdateRouteQueryWithReplace()

  // apply property use for apply filter. filter will apply when apply is true
  const initialFilterState: IOccupancyReportFilters = {
    Apply: false,
    EventTime: '',
    FirstName: '',
    ResetTime: '',
    LastName: '',
    Duration: '',
    Region: null,
    Reference: '1',
  }

  // state to store the filter values
  const [filterState, setFilterState] = useState(initialFilterState)
  // ref to store the applied filter values
  const filterStateRef = useRef(filterState)

  // state to control print modal
  const [openPrintModal, setOpenPrintModal] = useState(false)

  // update filter state in the URL when filter state is apply or reset
  const updateFilterStateToQuery = () => {
    handleChangePage(1)

    updateRouteQueryWithReplace({
      pathName: location.pathname,
      query: {
        EventTime: filterStateRef.current.EventTime,
        ResetTime: filterStateRef.current.ResetTime,
        FirstName: filterStateRef.current.FirstName,
        LastName: filterStateRef.current.LastName,
        RegionValue: filterStateRef.current.Region?.value,
        RegionLabel: filterStateRef.current.Region?.label,
        Duration: filterStateRef.current.Duration,
        Reference: filterStateRef.current.Reference,
      },
    })
  }

  const handleFilterInputChange: THandleFilterInputChange = (name, value) => {
    // apply will false in every filter state change
    setFilterState((state) => ({ ...state, Apply: false, [name]: value }))
  }

  const handleFilterInputChangeWithApply: THandleFilterInputChange = async (name, value) => {
    // apply will true in every filter state change
    setFilterState((state) => ({
      ...state,
      Apply: false,
      [name]: value,
    }))
    filterStateRef.current = {
      ...filterState,
      Apply: false,
      [name]: value,
    }
    updateFilterStateToQuery()
    handleFilterInputChange('Apply', true)
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
    const resetFilterState: IOccupancyReportFilters = {
      ...initialFilterState,
      Reference: filterStateRef.current.Reference,
    }
    // on filter reset filterStateRef update to reset filter state
    filterStateRef.current = resetFilterState
    updateFilterStateToQuery()
    setFilterState(resetFilterState)
    logResultMutate(undefined, true)
  }

  // in route change or reload - filter state update by query value and apply to filter
  useEffect(() => {
    const queryParse = QueryString.parse(location.search)

    const queryState: IOccupancyReportFilters = {
      EventTime: typeof queryParse.EventTime === 'string' ? queryParse.EventTime : '',
      ResetTime: typeof queryParse.ResetTime === 'string' ? queryParse.ResetTime : '',
      FirstName: typeof queryParse.FirstName === 'string' ? queryParse.FirstName : '',
      LastName: typeof queryParse.LastName === 'string' ? queryParse.LastName : '',
      Region:
        typeof queryParse.RegionValue === 'string' && typeof queryParse.RegionLabel === 'string'
          ? {
              label: queryParse.RegionLabel,
              value: queryParse.RegionValue,
            }
          : null,
      Duration: typeof queryParse.Duration === 'string' ? queryParse.Duration : '',
      Reference: typeof queryParse.Reference === 'string' ? queryParse.Reference : '1',
      Apply: true,
    }

    setFilterState(queryState)
    filterStateRef.current = queryState
  }, [location.search, location.pathname])

  // create the query object for the API call
  const apiQueryParamsWithoutPagination: IOccupancyReportStoreQueryParams = {
    sort_by: orderBy,
    order,
    ...(filterStateRef.current.EventTime && {
      EventTime: filterStateRef.current.EventTime,
    }),
    ...(filterStateRef.current.ResetTime && {
      ResetTime: filterStateRef.current.ResetTime,
    }),
    ...(filterStateRef.current.FirstName && {
      FirstName: filterStateRef.current.FirstName,
    }),
    ...(filterStateRef.current.LastName && {
      LastName: filterStateRef.current.LastName,
    }),
    ...(filterStateRef.current.Region?.value && {
      RegionNo: filterStateRef.current.Region.value,
    }),
    ...(filterStateRef.current.Reference && {
      Reference: filterStateRef.current.Reference,
    }),
  }

  // create the query object for the list API call
  const apiQueryParams: IOccupancyReportApiQueryParams = {
    offset: (page - 1) * rowsPerPage,
    limit: rowsPerPage,
    ...apiQueryParamsWithoutPagination,
  }

  const apiQueryString = QueryString.stringify(apiQueryParams)
  const apiQueryStringWithOutPagination = QueryString.stringify(apiQueryParamsWithoutPagination)

  const {
    isLoading,
    data,
    mutate: logResultMutate,
  } = useSWR<IListServerResponse<IOccupancyResult[]>>(occupancyReportApi.list(apiQueryString))

  const { trigger, isMutating } = useSWRMutation(maintenanceActionApi.add, sendPostRequest, {
    onSuccess: () => {
      setTimeout(() => {
        logResultMutate()
      }, 3000)
      addSuccessfulToast(`Success`)
    },
  })

  //Save button functionality as csv file
  const { trigger: saveDataTrigger, isMutating: csvDataLoading } = useSWRMutation(
    occupancyReportApi.save(apiQueryStringWithOutPagination),
    fetcher,
    {
      onSuccess: (saveData) => {
        exportSuccessfulToast('Success')
        downloadCsv(saveData, location)
      },
    }
  )

  const printListRef = useRef<HTMLDivElement | null>(null)

  // Function to handle printing
  const handlePrint = useReactToPrint({
    content: () => printListRef.current,
  })

  const openPrintListModal = () => {
    setOpenPrintModal(true)
  }

  const handleDBCopy = () => trigger({ Action: 'dbcopy', Type: 'save_log_db_to_workspace' })

  const breadcrumbsActionsDB: IActionsButton[] = [
    {
      color: 'primary',
      icon: copyLogFromDatabaseIcon,
      text: t`Copy Log From Database`,
      onClick: handleDBCopy,
      isLoading: isMutating,
      disabled: filterState.Reference === '1',
    },
    {
      color: 'primary',
      icon: getbackLogFromArchiveIcon,
      text: t`Getback Log From Archive`,
      link: routeProperty.getBack.path(),
      disabled: filterState.Reference === '1',
    },
  ]

  const breadcrumbsActions: IActionsButton[] = [
    {
      icon: saveIcon,
      text: t`Save`,
      onClick: () => {
        saveDataTrigger()
      },
      isLoading: csvDataLoading,
    },

    {
      icon: printIcon,
      text: t`Print`,
      onClick: openPrintListModal,
    },
  ]

  const { trigger: DBCopyTrigger } = useSWRMutation(maintenanceActionApi.add, sendPostRequest, {
    onSuccess: () => {
      setTimeout(() => {
        logResultMutate()
      }, 3000)
    },
  })

  useEffect(() => {
    if (filterState.Reference === '0') {
      DBCopyTrigger({ Action: 'dbcopy', Type: 'save_public_db_to_workspace' })
    }
  }, [filterState.Reference])

  let breadcrumbsComponentActions = useMemo<ISelectOption[]>(
    () => [
      {
        label: t`Database`,
        value: '1',
      },
      {
        label: t`Workspace`,
        value: '0',
      },
    ],
    []
  )

  // Print Modal Header action buttons for print
  const headerActionButtons: IActionsButton[] = [
    {
      text: t`Print`,
      icon: printIcon,
      onClick: handlePrint,
      size: 'small',
    },
  ]

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      logResultMutate()
    }, 3000) // 3 seconds
    return () => clearInterval(refreshInterval)
  }, [])

  // const [deviceTypeFilterResult, setDeviceTypeFilterResult] = useState<IOccupancyResult[]>([])

  // useEffect(() => {
  //   if (data?.data) {
  //     const f = data?.data.filter((item) => {
  //       const check_options_license: { [k: string]: LicenseCheckType } = {
  //         '8': 'Camera',
  //         '9': 'Channel',
  //         '10': 'Channel',
  //         '11': 'Lockset',
  //         '12': 'Lockset',
  //         '14': 'Subnode',
  //         '15': 'Subnode',
  //         '16': 'ContLock',
  //         '17': 'ContLock',
  //       }

  //       if (check_options_license[item.DeviceType]) {
  //         return has_license(check_options_license[item.DeviceType])
  //       }
  //       return true
  //     })
  //     setDeviceTypeFilterResult(f)
  //   }
  // }, [data?.data])

  const isNotFound = !data?.data.length && !isLoading

  return (
    <Page>
      <Breadcrumbs
        breadcrumbsActions={layout == 'Master' ? breadcrumbsActionsDB : []}
        pageRoutes={[
          {
            href: '/occupancy-report',
            text: t`Occupancy Report`,
          },
        ]}
      >
        {layout === 'Master' && (
          <RadioButtons
            name="Reference"
            checked={filterState.Reference}
            radios={breadcrumbsComponentActions}
            onChange={handleFilterInputChangeWithApply}
            // isLoading={isLoading}
          />
        )}
      </Breadcrumbs>

      <TableContainer>
        <OccupancyReportTableToolbar
          filterState={filterState}
          handleFilterStateReset={handleFilterStateReset}
          handleFilterApply={handleFilterApply}
          handleInputChange={handleFilterInputChange}
        />
        <ReportAction breadcrumbsActions={breadcrumbsActions} />
        <Table>
          <TableHeader
            order={order}
            orderBy={orderBy}
            rowCount={data?.data.length}
            handleSort={handleSort}
            handleOrder={handleOrder}
            headerData={TABLE_HEAD}
          />
          <tbody className="divide-y divide-gray-200">
            {!isLoading && (
              <>
                {data?.data.map((row) => (
                  <OccupancyReportTableRow
                    key={row.LogNo}
                    row={row}
                    Reference={filterState.Reference}
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
      <CardModal
        icon={printIcon}
        headerTitle="Print"
        openModal={openPrintModal}
        setOpenModal={setOpenPrintModal}
        headerActionButtons={headerActionButtons}
      >
        <OccupancyReportPrintModal
          order={order}
          orderBy={orderBy}
          tableHead={TABLE_HEAD}
          apiQueryStringWithOutPagination={apiQueryStringWithOutPagination}
          ref={printListRef}
        />
      </CardModal>
    </Page>
  )
}

export default OccupancyReport
