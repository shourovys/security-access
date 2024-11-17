import QueryString from 'qs'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { fetcher, sendPostRequest } from '../../api/swrConfig'
import { guardReportApi, maintenanceActionApi } from '../../api/urls'
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
import GuardReportPrintModal from '../../components/pages/guardReport/GuardReportPrintModal'
import GuardReportTableRow from '../../components/pages/guardReport/GuardReportTableRow'
import GuardReportTableToolbar from '../../components/pages/guardReport/GuardReportTableToolbar'
import useAuth from '../../hooks/useAuth'
import useTable, { emptyRows } from '../../hooks/useTable'
import useUpdateRouteQueryWithReplace from '../../hooks/useUpdateRouteQueryWithReplace'
import routeProperty from '../../routes/routeProperty'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleFilterInputChange } from '../../types/components/common'
import { ITableHead } from '../../types/components/table'
import { IListServerResponse } from '../../types/pages/common'
import {
  IGuardReportApiQueryParams,
  IGuardReportFilters,
  IGuardReportResult,
  IGuardReportStoreQueryParams,
} from '../../types/pages/guardReport'
import downloadCsv from '../../utils/downloadCsv'
import {
  copyLogFromDatabaseIcon,
  getbackLogFromArchiveIcon,
  printIcon,
  saveIcon,
} from '../../utils/icons'
import { addSuccessfulToast, exportSuccessfulToast } from '../../utils/toast'
import t from '../../utils/translator'

const TABLE_HEAD: ITableHead[] = [
  { id: 'EventTime', label: t`Event Time`, filter: true },
  { id: 'DeviceName', label: t`Device Name`, filter: true },
  { id: 'PersonName', label: t`Person Name`, filter: false },
  { id: 'CredentialNumb', label: t`Credential Number`, filter: true },
]

function GuardReport() {
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
  const initialFilterState: IGuardReportFilters = {
    Apply: false,
    DeviceName: '',
    EventTime: '',
    PersonName: '',
    CredentialNumb: '',
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
        DeviceName: filterStateRef.current.DeviceName,
        EventTime: filterStateRef.current.EventTime,
        PersonName: filterStateRef.current.PersonName,
        CredentialNumb: filterStateRef.current.CredentialNumb,
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
    // // Check if 'value' is defined and convert it to a string if necessary
    // const valueToStore = value !== undefined ? String(value) : ''

    // // Save the 'Reference' value to sessionStorage
    // if (name === 'Reference') {
    //   sessionStorage.setItem('filterStateReference', valueToStore)
    // }

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
    const resetFilterState = {
      ...initialFilterState,
      Reference: filterStateRef.current.Reference,
    }
    // on filter reset filterStateRef update to reset filter state
    filterStateRef.current = resetFilterState
    updateFilterStateToQuery()
    setFilterState(resetFilterState)
    logResultMutate(undefined, true)
  }

  useEffect(() => {
    // const storedReference = sessionStorage.getItem('filterStateReference')
    const queryParse = QueryString.parse(location.search)

    const queryState: IGuardReportFilters = {
      DeviceName: typeof queryParse.DeviceName === 'string' ? queryParse.DeviceName : '',
      EventTime: typeof queryParse.EventTime === 'string' ? queryParse.EventTime : '',
      PersonName: typeof queryParse.PersonName === 'string' ? queryParse.PersonName : '',
      CredentialNumb:
        typeof queryParse.CredentialNumb === 'string' ? queryParse.CredentialNumb : '',
      Reference: typeof queryParse.Reference === 'string' ? queryParse.Reference : '1',
      Apply: true,
    }

    setFilterState(queryState)
    filterStateRef.current = queryState
  }, [location.search, location.pathname])

  // create the query object for the save API call
  const apiQueryStringWithoutPagination: IGuardReportStoreQueryParams = {
    sort_by: orderBy,
    order,
    ...(filterStateRef.current.DeviceName && {
      DeviceName: filterStateRef.current.DeviceName,
    }),
    ...(filterStateRef.current.EventTime && {
      EventTime: filterStateRef.current.EventTime,
    }),
    ...(filterStateRef.current.PersonName && {
      PersonName: filterStateRef.current.PersonName,
    }),
    ...(filterStateRef.current.CredentialNumb && {
      CredentialNumb: filterStateRef.current.CredentialNumb,
    }),
    ...(filterStateRef.current.Reference && {
      Reference: filterStateRef.current.Reference,
    }),
  }

  // create the query object for the list API call
  const apiQueryParams: IGuardReportApiQueryParams = {
    offset: (page - 1) * rowsPerPage,
    limit: rowsPerPage,
    ...apiQueryStringWithoutPagination,
  }
  const apiQueryString = QueryString.stringify(apiQueryParams)
  const apiQueryStringWithOutPagination = QueryString.stringify(apiQueryStringWithoutPagination)
  const {
    isLoading,
    data,
    mutate: logResultMutate,
  } = useSWR<IListServerResponse<IGuardReportResult[]>>(guardReportApi.list(apiQueryString))

  // for print data

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
    guardReportApi.save(apiQueryStringWithOutPagination),
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

  // const tableActions: ITableAction[] = [
  //   {
  //     icon: saveIcon,
  //     tooltip: 'Save',
  //   },
  // ]

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

  // const [deviceTypeFilterResult, setDeviceTypeFilterResult] = useState<ILogResult[]>([])

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
            href: '/guard-report',
            text: t`Guard report`,
          },
        ]}
      >
        {layout == 'Master' && (
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
        <GuardReportTableToolbar
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
                  <GuardReportTableRow
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
        <GuardReportPrintModal
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

export default GuardReport
