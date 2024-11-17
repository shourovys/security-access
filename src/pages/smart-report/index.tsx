import QueryString from 'qs'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { fetcher, sendPostRequest } from '../../api/swrConfig'
import { maintenanceActionApi, smartReportApi } from '../../api/urls'
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
import SmartReportPrintModal from '../../components/pages/smartReport/SmartReportPrintModal'
import SmartReportTableRow from '../../components/pages/smartReport/SmartReportTableRow'
import SmartReportTableToolbar from '../../components/pages/smartReport/SmartReportTableToolbar'
import useAuth from '../../hooks/useAuth'
import useTable, { emptyRows } from '../../hooks/useTable'
import useUpdateRouteQueryWithReplace from '../../hooks/useUpdateRouteQueryWithReplace'
import routeProperty from '../../routes/routeProperty'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleFilterInputChange } from '../../types/components/common'
import { ITableHead } from '../../types/components/table'
import { LicenseCheckType } from '../../types/context/auth'
import {
  ISmartReportApiQueryParams,
  ISmartReportFilters,
  ISmartReportSaveQueryParams,
} from '../../types/pages/SmartReport'
import { IListServerResponse } from '../../types/pages/common'
import { ILogResult } from '../../types/pages/log'
import downloadCsv from '../../utils/downloadCsv'
import {
  copyLogFromDatabaseIcon,
  getbackLogFromArchiveIcon,
  printIcon,
  saveIcon,
} from '../../utils/icons'
import { addSuccessfulToast, exportSuccessfulToast } from '../../utils/toast'
import t from '../../utils/translator'

function SmartReport() {
  const location = useLocation()
  // const searchParams = new URLSearchParams(location.search);
  // const value = searchParams.get('Reference')
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
  } = useTable({ defaultOrderBy: 'LogNo' })
  // hook to update the query in the URL
  const updateRouteQueryWithReplace = useUpdateRouteQueryWithReplace()

  // apply property use for apply filter. filter will apply when apply is true
  const initialFilterState: ISmartReportFilters = {
    StartTime: '',
    EndTime: '',
    EventName: '',
    DeviceName: '',
    PersonName: '',
    EventType: null,
    EventCodes: [],
    DeviceType: null,
    DeviceIds: [],
    PersonIds: [],
    OutputList: ['LogNo', 'EventTime', 'EventName', 'DeviceName', 'PersonName'],
    Reference: '1',
    Apply: false,
  }

  // state to store the filter values
  const [filterState, setFilterState] = useState(initialFilterState)
  console.log(
    '🚀 ~ SmartReport ~ initialFilterState: ISmartReportFilters.StartTime:',
    filterState.StartTime
  )

  // ref to store the applied filter values
  const filterStateRef = useRef(filterState)
  // state to control print modal
  const [openPrintModal, setOpenPrintModal] = useState(false)

  const TABLE_HEAD: ITableHead[] =
    filterStateRef.current?.OutputList?.map((key) => {
      if (typeof key !== 'string' && Array.isArray(key)) {
        return {
          id: key,
          label: key ? key[0] : '',
          filter: true,
        }
      }
      return {
        id: key,
        label: key ? `${key?.replace(/([a-z])([A-Z])/g, '$1 $2')}` : '',
        filter: true,
      }
    }) || []

  // update filter state in the URL when filter state is apply or reset
  const updateFilterStateToQuery = () => {
    handleChangePage(1)

    // shourov: query synchronized with filter state create some unwanted bugs
    // updateRouteQueryWithReplace({
    //   pathName: location.pathname,
    //   query: {
    //     StartTime: filterStateRef.current.StartTime,
    //     EndTime: filterStateRef.current.EndTime,
    //     EventName: filterStateRef.current.EventName,
    //     DeviceName: filterStateRef.current.DeviceName,
    //     PersonName: filterStateRef.current.PersonName,
    //     EventTypeValue: filterStateRef.current.EventType?.value,
    //     EventTypeLabel: filterStateRef.current.EventType?.label,
    //     EventCodes: filterStateRef.current.EventCodes,
    //     DeviceTypeValue: filterStateRef.current.DeviceType?.value,
    //     DeviceTypeLabel: filterStateRef.current.DeviceType?.label,
    //     DeviceIds: filterStateRef.current.DeviceIds,
    //     PersonIds: filterStateRef.current.PersonIds,
    //     OutputList: filterStateRef.current.OutputList,
    //     Reference: filterStateRef.current.Reference,
    //   },
    // })
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
    // Check if 'value' is defined and convert it to a string if necessary
    const valueToStore = value !== undefined ? String(value) : ''

    // Save the 'Reference' value to sessionStorage
    if (name === 'Reference') {
      sessionStorage.setItem('filterStateReference', valueToStore)
    }

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
  const handleFilterStateReset = async () => {
    const resetFilterState = {
      ...initialFilterState,
      Reference: filterStateRef.current.Reference,
    }
    // on filter reset filterStateRef update to reset filter state
    filterStateRef.current = resetFilterState
    await updateFilterStateToQuery()
    await setFilterState(resetFilterState)
    await smartResultMutate(undefined, true)
  }

  // useEffect(() => {
  //   const storedReference = sessionStorage.getItem('filterStateReference')
  //   const queryParse = QueryString.parse(location.search)

  //   const queryState: ISmartReportFilters = {
  //     StartTime: typeof queryParse.StartTime === 'string' ? queryParse.StartTime : '',
  //     EndTime: typeof queryParse.EndTime === 'string' ? queryParse.EndTime : '',
  //     EventName: typeof queryParse.EventName === 'string' ? queryParse.EventName : '',
  //     DeviceName: typeof queryParse.DeviceName === 'string' ? queryParse.DeviceName : '',
  //     PersonName: typeof queryParse.PersonName === 'string' ? queryParse.PersonName : '',
  //     EventType:
  //       typeof queryParse.EventTypeValue === 'string' &&
  //       typeof queryParse.EventTypeLabel === 'string'
  //         ? {
  //             label: queryParse.EventTypeLabel,
  //             value: queryParse.EventTypeValue,
  //           }
  //         : null,
  //     EventCodes: Array.isArray(queryParse.EventCodes) ? (queryParse.EventCodes as string[]) : [],
  //     DeviceType:
  //       typeof queryParse.DeviceTypeValue === 'string' &&
  //       typeof queryParse.DeviceTypeLabel === 'string'
  //         ? {
  //             label: queryParse.DeviceTypeLabel,
  //             value: queryParse.DeviceTypeValue,
  //           }
  //         : null,
  //     DeviceIds: Array.isArray(queryParse.DeviceIds) ? (queryParse.DeviceIds as string[]) : [],
  //     PersonIds: Array.isArray(queryParse.PersonIds) ? (queryParse.PersonIds as string[]) : [],
  //     OutputList: Array.isArray(queryParse.OutputList)
  //       ? (queryParse.OutputList as (keyof ILogResult)[])
  //       : initialFilterState.OutputList,
  //     Reference:
  //       typeof storedReference === 'string'
  //         ? storedReference
  //         : typeof queryParse.Reference === 'string'
  //         ? queryParse.Reference
  //         : '1',
  //     Apply: true,
  //   }

  //   setFilterState(queryState)
  //   filterStateRef.current = queryState
  // }, [location.search, location.pathname])

  // create the query object for the API call
  const apiQueryWithoutPagination: ISmartReportSaveQueryParams = {
    sort_by: orderBy,
    order,
    ...(filterStateRef.current.StartTime && {
      StartTime: filterStateRef.current.StartTime,
    }),
    ...(filterStateRef.current.EndTime && {
      EndTime: filterStateRef.current.EndTime,
    }),
    ...(filterStateRef.current.EventName && {
      EventName: filterStateRef.current.EventName,
    }),
    ...(filterStateRef.current.DeviceName && {
      DeviceName: filterStateRef.current.DeviceName,
    }),
    ...(filterStateRef.current.PersonName && {
      PersonName: filterStateRef.current.PersonName,
    }),
    // ...(filterStateRef.current.EventType && {
    //   EventType: filterStateRef.current.EventType.value,
    // }),
    ...(filterStateRef.current.EventCodes && {
      EventCodes: filterStateRef.current.EventCodes,
    }),
    // ...(filterStateRef.current.DeviceType && {
    //   DeviceType: filterStateRef.current.DeviceType.value,
    // }),
    ...(filterStateRef.current.DeviceIds && {
      DeviceIds: filterStateRef.current.DeviceIds,
    }),
    ...(filterStateRef.current.PersonIds && {
      PersonIds: filterStateRef.current.PersonIds,
    }),
    ...(filterStateRef.current.Reference && {
      Reference: filterStateRef.current.Reference,
    }),
  }

  // create the query object for the list API call
  const apiQueryParams: ISmartReportApiQueryParams = {
    offset: (page - 1) * rowsPerPage,
    limit: rowsPerPage,

    ...apiQueryWithoutPagination,
  }

  const apiQueryString = QueryString.stringify(apiQueryParams)
  const apiQueryStringWithOutPagination = QueryString.stringify(apiQueryWithoutPagination)

  const {
    isLoading,
    data,
    mutate: smartResultMutate,
  } = useSWR<IListServerResponse<ILogResult[]>>(smartReportApi.list(apiQueryString))

  const { trigger, isMutating } = useSWRMutation(maintenanceActionApi.add, sendPostRequest, {
    onSuccess: () => {
      // setTimeout(() => {
      //   smartResultMutate()
      // }, 3000)
      addSuccessfulToast(`Success`)
    },
  })

  //Save button functionality as csv file

  const { trigger: saveDataTrigger, isMutating: csvDataLoading } = useSWRMutation(
    smartReportApi.save(apiQueryStringWithOutPagination),
    fetcher,
    {
      onSuccess: (saveData) => {
        exportSuccessfulToast('Success')
        downloadCsv(saveData, location)
      },
    }
  )

  // const { trigger: saveDataTrigger, isMutating: csvDataLoading } = useSWRMutation(
  //   logReportApi.save(apiSaveQueryString),
  //   fetcher,
  //   {
  //     onSuccess: (saveData) => {
  //       exportSuccessfulToast('Save Success')
  //       downloadCsv(saveData, location)
  //     },
  //   }
  // )

  const printListRef = useRef<HTMLDivElement | null>(null)

  // Function to handle printing
  const handlePrint = useReactToPrint({
    content: () => printListRef.current,
  })

  const openPrintListModal = () => {
    setOpenPrintModal(true)
  }

  const handleDBCopy = () => trigger({ Action: 'dbcopy', Type: 'save_smart_db_to_workspace' })

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

  const { trigger: DBCopyTrigger } = useSWRMutation(maintenanceActionApi.add, sendPostRequest, {
    onSuccess: () => {
      // setTimeout(() => {
      //   smartResultMutate()
      // }, 3000)
    },
  })

  useEffect(() => {
    if (filterState.Reference === '0') {
      DBCopyTrigger({ Action: 'dbcopy', Type: 'save_public_db_to_workspace' })
    }
  }, [filterState.Reference])

  // const tableActions: ITableAction[] = [
  // {
  //   icon: saveIcon,
  //   tooltip: 'Save',
  // },
  // ]

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

  // useEffect(() => {
  //   const refreshInterval = setInterval(() => {
  //     smartResultMutate()
  //   }, 3000) // 3 seconds
  //   return () => clearInterval(refreshInterval)
  // }, [])

  // Print Modal Header action buttons for print
  const headerActionButtons: IActionsButton[] = [
    {
      text: t`Print`,
      icon: printIcon,
      onClick: handlePrint,
      size: 'small',
    },
  ]

  const [deviceTypeFilterResult, setDeviceTypeFilterResult] = useState<ILogResult[]>([])

  useEffect(() => {
    if (data?.data) {
      const f = data?.data.filter((item) => {
        const check_options_license: { [k: string]: LicenseCheckType } = {
          '8': 'Camera',
          '9': 'Channel',
          '10': 'Channel',
          '11': 'Lockset',
          '12': 'Lockset',
          '14': 'Subnode',
          '15': 'Subnode',
          '16': 'ContLock',
          '17': 'ContLock',
        }

        if (check_options_license[item.DeviceType]) {
          return has_license(check_options_license[item.DeviceType])
        }
        return true
      })
      setDeviceTypeFilterResult(f)
    }
  }, [data?.data])

  const isNotFound = !data?.data.length && !isLoading

  return (
    <Page>
      <Breadcrumbs
        breadcrumbsActions={layout == 'Master' ? breadcrumbsActionsDB : []}
        pageRoutes={[
          {
            href: '/smart-report',
            text: t`Smart report`,
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
        <SmartReportTableToolbar
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
                {deviceTypeFilterResult.map((row) => (
                  <SmartReportTableRow
                    key={row.LogNo}
                    row={row}
                    Reference={filterState.Reference}
                    showColumns={
                      filterStateRef.current?.OutputList || initialFilterState.OutputList
                    }
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
        <SmartReportPrintModal
          order={order}
          orderBy={orderBy}
          tableHead={TABLE_HEAD}
          showColumns={filterStateRef.current?.OutputList || initialFilterState.OutputList}
          apiQueryStringWithOutPagination={apiQueryStringWithOutPagination}
          ref={printListRef}
        />
      </CardModal>
    </Page>
  )
}

export default SmartReport
