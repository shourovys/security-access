import QueryString from 'qs'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendPostRequest } from '../../api/swrConfig'
import { homeApi, maintenanceActionApi, viewApi } from '../../api/urls'
import Page from '../../components/HOC/Page'
import TableContainer from '../../components/HOC/style/table/TableContainer'
import Pagination from '../../components/common/table/Pagination'
import TableNoData from '../../components/common/table/TableNoData'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import LiveToolbar from '../../components/pages/live/LiveToolbar'
import ViewBox from '../../components/pages/live/ViewBox'
import useTable from '../../hooks/useTable'
import useUpdateRouteQuery from '../../hooks/useUpdateRouteQuery'
import useUpdateRouteQueryWithReplace from '../../hooks/useUpdateRouteQueryWithReplace'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleFilterInputChange } from '../../types/components/common'
import { IListServerResponse, ISingleServerResponse } from '../../types/pages/common'
import {
  ILiveBoxLayouts,
  ILiveDashboardApiQueryParams,
  ILiveDashboardFilters,
  ILiveDashboardResult,
  TCurrentSplit,
} from '../../types/pages/live'
import { IViewResult } from '../../types/pages/view'
import { SERVER_QUERY } from '../../utils/config'
import { resetIcon } from '../../utils/icons'
import { addSuccessfulToast } from '../../utils/toast'
import t from '../../utils/translator'

function calculateStartingRow(pageNo: number, rowsPerPage: number): number {
  return (pageNo - 1) * rowsPerPage + 1
}

function LivePage() {
  const location = useLocation()

  const { page, rowsPerPage, handleChangeRowsPerPage, handleChangePage } = useTable({
    defaultRowsPerPage: 2,
  })

  // hook to update the query in the URL
  const updateRouteQueryWithReplace = useUpdateRouteQueryWithReplace()
  const updateRouteQuery = useUpdateRouteQuery()

  // apply property use for apply filter. filter will apply when apply is true
  const initialFilterState: ILiveDashboardFilters = {
    apply: false,
    View: null,
  }
  // state to store the filter values and current view streams
  const [filterState, setFilterState] = useState(initialFilterState)
  const [channels, setChannels] = useState<ILiveDashboardResult[] | null>(null)

  const [isLoading, setIsLoading] = useState(true)

  // ref to store the applied filter values
  const filterStateRef = useRef(filterState)

  // update filter state in the URL when filter state is apply or reset
  const updateFilterStateToQuery = () => {
    handleChangePage(1)

    updateRouteQueryWithReplace({
      pathName: location.pathname,
      query: {
        page: 1,
        View: filterStateRef.current.View,
        ViewValue: filterStateRef.current.View?.value,
        ViewLabel: filterStateRef.current.View?.label,
      },
    })
  }

  const handleFilterInputChange: THandleFilterInputChange = (name, value) => {
    // apply will false in every filter state change
    setFilterState((state) => ({ ...state, apply: false, [name]: value }))
  }

  const handleFilterInputChangeWithApply: THandleFilterInputChange = async (name, value) => {
    // apply will true in every filter state change
    setFilterState((state) => ({
      ...state,
      apply: false,
      [name]: value,
    }))
    filterStateRef.current = {
      ...filterState,
      apply: false,
      [name]: value,
    }
    updateFilterStateToQuery()
    handleFilterInputChange('apply', true)
  }

  // getting the floor data for set as default
  const { isLoading: floorIsLoading, data: viewData } = useSWR<IListServerResponse<IViewResult[]>>(
    viewApi.list(SERVER_QUERY.selectorDataQuery)
  )

  const modifiedFlorData = viewData?.data.map((result) => ({
    value: result.ViewNo.toString(),
    label: result.ViewName,
  }))

  // in route change or reload - filter state update by query value and apply to filter
  useEffect(() => {
    const queryParse = QueryString.parse(location.search)

    const queryState: ILiveDashboardFilters = {
      View:
        // set default view data in there is no view
        typeof queryParse.ViewValue === 'string' && typeof queryParse.ViewLabel === 'string'
          ? {
              label: queryParse.ViewLabel,
              value: queryParse.ViewValue,
            }
          : modifiedFlorData
          ? modifiedFlorData[0]
          : null,

      apply: true,
    }

    // Check if data.data is not empty and contains some data
    if (data?.data?.length) {
      // Define an array of valid rowsPerPage options
      const validRowsPerPageOptions: Array<1 | 2 | 4> = [1, 2, 4]

      // Parse the rowsPerPage query parameter to a number
      let rowsPerPage: number

      // Find the closest valid rowsPerPage value from the validRowsPerPageOptions array
      if (Number(queryParse.rowsPerPage) <= data.data.length) {
        rowsPerPage = Number(queryParse.rowsPerPage)
      } else if (data.data.length >= 2) {
        rowsPerPage = 2
      } else {
        rowsPerPage = 1
      }

      updateRouteQueryWithReplace({
        pathName: location.pathname,
        query: {
          page: 1,
          rowsPerPage: rowsPerPage,
        },
      })
      // Update the rowsPerPage state with the new value
      handleChangeRowsPerPage(rowsPerPage)
    } else {
      updateRouteQueryWithReplace({
        pathName: location.pathname,
        query: {
          page: 1,
          rowsPerPage: 2,
        },
      })
      // If data.data is empty or undefined, set the default rowsPerPage value (2 in this case)
      handleChangeRowsPerPage(2)
    }

    setFilterState(queryState)
    filterStateRef.current = queryState
  }, [
    // location.search,
    // location.pathname,
    // router.isReady,
    modifiedFlorData?.length,
  ])

  // create the query object for the API call
  const apiQueryParams: ILiveDashboardApiQueryParams = {
    ...(filterStateRef.current.View?.value && {
      ViewNo: filterStateRef.current.View.value,
    }),
  }

  const apiQueryString = QueryString.stringify(apiQueryParams)

  const { isLoading: liveIsLoading, data } = useSWR<ISingleServerResponse<ILiveDashboardResult[]>>(
    filterState.View ? homeApi.live(apiQueryString) : null
  )

  useEffect(() => {
    const queryParse = QueryString.parse(location.search)

    // Check if data.data is not empty and contains some data
    if (data?.data?.length) {
      // Define an array of valid rowsPerPage options
      const validRowsPerPageOptions: Array<1 | 2 | 4> = [1, 2, 4]

      // Parse the rowsPerPage query parameter to a number
      let rowsPerPage = Number(queryParse.rowsPerPage) || 2

      // Find the closest valid rowsPerPage value from the validRowsPerPageOptions array
      if (Number(queryParse.rowsPerPage) <= data.data.length) {
        Number(queryParse.rowsPerPage)
      } else if (data.data.length >= 2) {
      } else {
      }

      // Update the rowsPerPage state with the new value
      // handleChangeRowsPerPage(rowsPerPage)
      setChannels(data?.data)
    } else {
      // If data.data is empty or undefined, set the default rowsPerPage value (2 in this case)
      handleChangeRowsPerPage(2)
    }
  }, [data?.data])

  useEffect(() => {
    if (!liveIsLoading && !floorIsLoading && viewData && data) {
      setIsLoading(false)
    }
  }, [liveIsLoading, floorIsLoading, viewData, data])

  const liveBoxLayouts: ILiveBoxLayouts = {
    1: (
      <div className="h-full max-w-5xl aspect-[16/9] mx-auto">
        {channels?.length && (
          <ViewBox
            type="channel"
            name={channels && channels[calculateStartingRow(page, rowsPerPage) - 1]?.ChannelName}
            deviceId={
              channels &&
              channels[calculateStartingRow(page, rowsPerPage) - 1]?.ChannelNo.toString()
            }
            isLoading={isLoading}
          />
        )}
      </div>
    ),
    2: (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {channels?.length && (
          <ViewBox
            type="channel"
            name={channels && channels[calculateStartingRow(page, rowsPerPage) - 1]?.ChannelName}
            deviceId={
              channels &&
              channels[calculateStartingRow(page, rowsPerPage) - 1]?.ChannelNo.toString()
            }
            isLoading={isLoading}
          />
        )}
        {channels?.length && channels?.length > 1 && (
          <ViewBox
            type="channel"
            name={channels && channels[calculateStartingRow(page, rowsPerPage)]?.ChannelName}
            deviceId={
              channels && channels[calculateStartingRow(page, rowsPerPage)]?.ChannelNo.toString()
            }
            isLoading={isLoading}
          />
        )}
      </div>
    ),
    4: (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {channels?.length && (
          <ViewBox
            type="channel"
            name={channels && channels[calculateStartingRow(page, rowsPerPage) - 1]?.ChannelName}
            deviceId={
              channels &&
              channels[calculateStartingRow(page, rowsPerPage) - 1]?.ChannelNo.toString()
            }
            isLoading={isLoading}
          />
        )}
        {channels?.length && channels?.length > 1 && (
          <ViewBox
            type="channel"
            name={channels && channels[calculateStartingRow(page, rowsPerPage)]?.ChannelName}
            deviceId={
              channels && channels[calculateStartingRow(page, rowsPerPage)]?.ChannelNo.toString()
            }
            isLoading={isLoading}
          />
        )}
        {channels?.length && channels?.length > 2 && (
          <ViewBox
            type="channel"
            name={channels && channels[calculateStartingRow(page, rowsPerPage) + 1]?.ChannelName}
            deviceId={
              channels &&
              channels[calculateStartingRow(page, rowsPerPage) + 1]?.ChannelNo.toString()
            }
            isLoading={isLoading}
          />
        )}

        {channels?.length && channels?.length > 3 && (
          <ViewBox
            type="channel"
            name={channels && channels[calculateStartingRow(page, rowsPerPage) + 2]?.ChannelName}
            deviceId={
              channels &&
              channels[calculateStartingRow(page, rowsPerPage) + 2]?.ChannelNo.toString()
            }
            isLoading={isLoading}
          />
        )}
      </div>
    ),
  }

  const handleSplits = (split: TCurrentSplit) => {
    handleChangePage(1)
    handleChangeRowsPerPage(split)
    updateRouteQuery({
      query: { page: 1, rowsPerPage: split },
      pathName: location.pathname,
    })
  }

  const DisplayLiveBox = () => liveBoxLayouts[rowsPerPage]

  const isNotFound =
    (!data?.data.length && !liveIsLoading) || (!viewData?.data.length && !floorIsLoading)

  const { trigger, isMutating } = useSWRMutation(maintenanceActionApi.add, sendPostRequest, {
    onSuccess: () => {
      addSuccessfulToast(`Success`)
    },
  })

  // const handleRestartLive = () => {
  //   openAlertDialogWithPromise(
  //     () => trigger({ Action: 'restart', Type: 'restart_streaming' }),
  //     { success: t`Restart Successful` },
  //     t('Do you want to Restart Live?')
  //   )
  // }

  // Define the actions for the breadcrumbs bar
  const breadcrumbsActions: IActionsButton[] = [
    {
      color: 'danger',
      icon: resetIcon,
      text: t`Restart`,
      onClick: () => trigger({ Action: 'restart', Type: 'restart_streaming' }),
      isLoading: isMutating,
    },
  ]

  return (
    <Page>
      <Breadcrumbs
        pageRoutes={[
          {
            href: '/live',
            text: t`Live`,
          },
        ]}
        breadcrumbsActions={breadcrumbsActions}
      />
      <TableContainer>
        <LiveToolbar
          handleSplits={handleSplits}
          filterState={filterState}
          rowsPerPage={rowsPerPage}
          handleInputChange={handleFilterInputChangeWithApply}
          noData={!data?.data.length || !viewData?.data.length}
          channelLength={channels?.length}
        />
        {!isNotFound && <DisplayLiveBox />}
        <TableNoData isNotFound={isNotFound} />
        <Pagination
          totalRows={data?.data.length || 0}
          currentPage={page}
          rowsPerPage={rowsPerPage}
          currentPath={location.pathname}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageDisabled
        />
      </TableContainer>
    </Page>
  )
}

export default LivePage
