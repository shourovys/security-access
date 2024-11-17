import { sendPostRequest } from '../../api/swrConfig'
import { eventCodeApi } from '../../api/urls'
import Page from '../../components/HOC/Page'
import Table from '../../components/HOC/style/table/Table'
import TableContainer from '../../components/HOC/style/table/TableContainer'
import Pagination from '../../components/common/table/Pagination'
import TableEmptyRows from '../../components/common/table/TableEmptyRows'
import TableHeader from '../../components/common/table/TableHeader'
import TableNoData from '../../components/common/table/TableNoData'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import TableBodyLoading from '../../components/loading/table/TableBodyLoading'
import EventCodeTableRow from '../../components/pages/eventCode/EventCodeTableRow'
import EventCodeTableToolbar from '../../components/pages/eventCode/EventCodeTableToolbar'
import useAlert from '../../hooks/useAlert'
import useTable, { emptyRows } from '../../hooks/useTable'
import useUpdateRouteQueryWithReplace from '../../hooks/useUpdateRouteQueryWithReplace'
import QueryString from 'qs'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { THandleFilterInputChange } from '../../types/components/common'
import { ITableHead, ITableHeadWithCheckbox } from '../../types/components/table'
import { IListServerResponse } from '../../types/pages/common'
import {
  IEventCodeApiQueryParams,
  IEventCodeFilters,
  IEventCodeResult,
  IEventCodeRouteQueryParams,
} from '../../types/pages/eventCode'
import { editSuccessfulToast } from '../../utils/toast'
import t from '../../utils/translator'

function EventCode() {
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
  } = useTable({ defaultOrderBy: 'EventCode' })
  // hook to update the query in the URL
  const updateRouteQueryWithReplace = useUpdateRouteQueryWithReplace()
  // hook to open alert dialog modal
  const { openAlertDialogWithPromise } = useAlert()

  // apply property use for apply filter. filter will apply when apply is true
  const initialFilterState: IEventCodeFilters = {
    EventCode: '',
    EventName: '',
    EventType: null,
    EventLevel: null,
    Apply: false,
  }

  // state to store the filter values
  const [filterState, setFilterState] = useState(initialFilterState)

  // ref to store the applied filter values
  const filterStateRef = useRef(filterState)

  const handleFilterInputChange: THandleFilterInputChange = (name, value) => {
    // apply will false in every filter state change
    setFilterState((state) => ({ ...state, Apply: false, [name]: value }))
  }

  // update filter state in the URL when filter state is apply or reset
  const updateFilterStateToQuery = () => {
    handleChangePage(1)

    const queryParams: IEventCodeRouteQueryParams = {
      Page: 1,
      EventCode: filterStateRef.current.EventCode,
      EventName: filterStateRef.current.EventName,
      EventTypeValue: filterStateRef.current.EventType?.value,
      EventTypeLabel: filterStateRef.current.EventType?.label,
      EventLevelValue: filterStateRef.current.EventLevel?.value,
      EventLevelLabel: filterStateRef.current.EventLevel?.label,
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

    const queryState: IEventCodeFilters = {
      EventCode: typeof queryParse.EventCode === 'string' ? queryParse.EventCode : '',
      EventName: typeof queryParse.EventName === 'string' ? queryParse.EventName : '',
      EventType:
        typeof queryParse.EventTypeValue === 'string' &&
        typeof queryParse.EventTypeLabel === 'string'
          ? {
              label: queryParse.EventTypeLabel,
              value: queryParse.EventTypeValue,
            }
          : null,
      EventLevel:
        typeof queryParse.EventLevelValue === 'string' &&
        typeof queryParse.EventLevelLabel === 'string'
          ? {
              label: queryParse.EventLevelLabel,
              value: queryParse.EventLevelValue,
            }
          : null,
      Apply: true,
    }

    setFilterState(queryState)
    filterStateRef.current = queryState
  }, [location.search, location.pathname])

  // query object of pagination, sorting, filtering
  const apiQueryParams: IEventCodeApiQueryParams = {
    offset: (page - 1) * rowsPerPage,
    limit: rowsPerPage,
    sort_by: orderBy,
    order,
    ...(filterStateRef.current.EventCode && {
      EventCode: filterStateRef.current.EventCode,
    }),
    ...(filterStateRef.current.EventName && {
      EventName_icontains: filterStateRef.current.EventName,
    }),
    ...(filterStateRef.current.EventType?.value && {
      EventType: filterStateRef.current.EventType.value,
    }),
    ...(filterStateRef.current.EventLevel?.value && {
      EventLevel: filterStateRef.current.EventLevel.value,
    }),
  }

  const apiQueryString = QueryString.stringify(apiQueryParams)

  const { isLoading, isValidating, data, mutate } = useSWR<IListServerResponse<IEventCodeResult[]>>(
    eventCodeApi.list(apiQueryString)
  )

  // Define the mutation function for header checkbox action
  const { trigger: allEnableDisableTrigger } = useSWRMutation(
    eventCodeApi.enableDisable,
    sendPostRequest,
    {
      onSuccess: () => {
        editSuccessfulToast()
        // refetch table data
        mutate()
      },
    }
  )

  const TABLE_HEAD: ITableHead[] = [
    { id: 'EventCode', label: t`Event Code`, filter: true },
    { id: 'EventName', label: t`Event Name`, filter: true },
    { id: 'EventDesc', label: t`Description`, filter: true },
    { id: 'EventType', label: t`Event Type`, filter: true },
    { id: 'EventLevel', label: t`Event Level`, filter: true },
    {
      id: 'LogSave',
      label: t`Log Save`,
      checkboxValue: false,
      checkboxAction: handleTableHeaderCheckboxAction,
    },
    {
      id: 'LogDisplay',
      label: t`Log Display`,
      checkboxValue: false,
      checkboxAction: handleTableHeaderCheckboxAction,
    },
    {
      id: 'AckRequired',
      label: t`Ack Required`,
      checkboxValue: false,
      checkboxAction: handleTableHeaderCheckboxAction,
    },
    {
      id: 'EventAction',
      label: t`Event Action`,
      checkboxValue: false,
      checkboxAction: handleTableHeaderCheckboxAction,
    },
  ]

  const [tableHead, setTableHead] = useState(TABLE_HEAD)

  useEffect(() => {
    if (data?.data) {
      const updatedCheckboxValue = [
        {
          id: 'LogSave',
          checkboxValue: data?.data.every((result) => result.LogSave),
        },
        {
          id: 'LogDisplay',
          checkboxValue: data?.data.every((result) => result.LogDisplay),
        },
        {
          id: 'AckRequired',
          checkboxValue: data?.data.every((result) => result.AckRequired),
        },
        {
          id: 'EventAction',
          checkboxValue: data?.data.every((result) => result.EventAction),
        },
      ]

      const updatedTableHead: ITableHead[] = tableHead.map((data) => {
        if ('checkboxValue' in data) {
          const currentCheckboxValue = updatedCheckboxValue.find(
            (checkbox) => checkbox.id === data.id
          )
          return {
            ...data,
            checkboxValue: currentCheckboxValue?.checkboxValue,
          } as ITableHeadWithCheckbox
        } else {
          return data
        }
      })
      setTableHead(updatedTableHead)
    }
  }, [data, isLoading, isValidating])

  function handleTableHeaderCheckboxAction(
    name: string,
    value: boolean,
    allRowsNos: unknown
  ): void {
    const handleAllEnableDisable = () => {
      return allEnableDisableTrigger({
        Column: name,
        IsActive: value,
        EventCodes: allRowsNos,
      })
    }
    openAlertDialogWithPromise(
      handleAllEnableDisable,
      { success: t`Success` },
      t`Do you  want to make all ${value ? 'check' : 'uncheck'} this?`
    )
  }

  const isNotFound = !data?.data.length && !isLoading

  return (
    <Page title={t`Event Code List`}>
      <Breadcrumbs />
      <TableContainer>
        <EventCodeTableToolbar
          filterState={filterState}
          handleFilterStateReset={handleFilterStateReset}
          handleFilterApply={handleFilterApply}
          handleInputChange={handleFilterInputChange}
        />
        <Table>
          <TableHeader
            order={order}
            orderBy={orderBy}
            numSelected={selected.length}
            rowCount={data?.data.length}
            handleSort={handleSort}
            handleOrder={handleOrder}
            headerData={tableHead}
            allRowsNos={data?.data.map((result) => result.EventCode.toString())}
          />
          <tbody className="divide-y divide-gray-200">
            {!isLoading && (
              <>
                {data?.data.map((row) => (
                  <EventCodeTableRow key={row.EventCode} row={row} selected={selected} />
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

export default EventCode
