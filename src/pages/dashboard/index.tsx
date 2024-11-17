import { useRef, useState } from 'react'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendPostRequest } from '../../api/swrConfig'
import { floorDartboardApi } from '../../api/urls'
import TableHeader from '../../components/common/table/TableHeader'
import TableNoData from '../../components/common/table/TableNoData'
import Page from '../../components/HOC/Page'
import Table from '../../components/HOC/style/table/Table'
import TableContainer from '../../components/HOC/style/table/TableContainer'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import TableBodyLoading from '../../components/loading/table/TableBodyLoading'
import FloorDashboardDrag from '../../components/pages/floorDashboard/FloorDashboardDrag'
import FloorDashboardTableRow from '../../components/pages/floorDashboard/FloorDashboardTableRow'
import FloorDashboardTableToolbar from '../../components/pages/floorDashboard/FloorDashboardTableToolbar'
import { useDefaultFloorOption } from '../../hooks/useDefaultOption'
import useTable from '../../hooks/useTable'
import routeProperty from '../../routes/routeProperty'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleFilterInputChange } from '../../types/components/common'
import { ITableHead } from '../../types/components/table'
import { ISingleServerResponse } from '../../types/pages/common'
import { IFloorDashboardFilters, IFloorDashboardResult } from '../../types/pages/floorDashboard'
import {
  ackIcon,
  editLayoutIcon,
  imageLoadIcon,
  saveIcon,
  toggleFloorIcon,
} from '../../utils/icons'
import { convertImageToBase64 } from '../../utils/imageBase64'
import { addSuccessfulToast } from '../../utils/toast'
import t from '../../utils/translator'

const TABLE_HEAD: ITableHead[] = [
  { id: 'LogNo', label: t`Log No`, filter: false },
  { id: 'EventTime', label: t`Event Time`, filter: false },
  { id: 'EventName', label: t`Event Name`, filter: false },
  { id: 'DeviceName', label: t`Device Name`, filter: false },
  { id: 'PersonName', label: t`Person Name`, filter: false },
]

function FloorDashboard() {
  const { order, orderBy, handleSort, handleOrder } = useTable({})
  // hook to update the query in the URL
  // const updateRouteQueryWithReplace = useUpdateRouteQueryWithReplace()

  // apply property use for apply filter. filter will apply when apply is true
  const initialFilterState: IFloorDashboardFilters = {
    Apply: false,
    Floor: null,
    DeviceType: null,
    Device: null,
  }
  // state to store the filter values
  const [filterState, setFilterState] = useState(initialFilterState)
  // Set default Partition and Schedule
  useDefaultFloorOption<IFloorDashboardFilters>(setFilterState)

  // ref to store the applied filter values
  const filterStateRef = useRef(filterState)
  // is draggable edit mode or not
  const [isDraggable, setIsDraggable] = useState({
    editMode: false,
    saveFunctionCall: false,
  })
  // state to store toggle floor state
  const [toggleFloorShow, setToggleFloorShow] = useState(true)

  // update filter state in the URL when filter state is apply or reset
  // const updateFilterStateToQuery = () => {
  //   updateRouteQueryWithReplace({
  //     pathName: location.pathname,
  //     query: {
  //       FloorValue: filterStateRef.current.Floor?.value,
  //       FloorLabel: filterStateRef.current.Floor?.label,
  //       DeviceTypeValue: filterStateRef.current.DeviceType?.value,
  //       DeviceTypeLabel: filterStateRef.current.DeviceType?.label,
  //       DeviceValue: filterStateRef.current.Device?.value,
  //       DeviceLabel: filterStateRef.current.Device?.label,
  //     },
  //   })
  // }

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
    handleFilterInputChange('apply', true)
  }

  const {
    isLoading: floorDashboardLoading,
    data: floorDashboardData,
    mutate: floorDashboardMutate,
  } = useSWR<ISingleServerResponse<IFloorDashboardResult>>(
    filterState.Floor ? floorDartboardApi.floorDashboard(filterState.Floor.value) : null,
    {
      refreshInterval: 1000,
      // onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {},
    }
  )

  // Define the mutation function to add floor image to the server
  const { trigger: addFloorImage, isMutating: addFloorImageLoading } = useSWRMutation(
    floorDartboardApi.imageUpload,
    sendPostRequest,
    {
      onSuccess: () => {
        floorDashboardMutate()
        addSuccessfulToast()
      },
    }
  )

  const [isConverting, setIsConverting] = useState<boolean>(false)
  const handleAddFloorImage = async (file: File) => {
    setIsConverting(true)
    const base64Image = await convertImageToBase64(file)
    setIsConverting(false)
    addFloorImage({ FloorNo: filterState.Floor?.value, ImageFile: base64Image })
  }

  const breadcrumbsActions: IActionsButton[] = [
    {
      color: 'danger',
      icon: ackIcon,
      text: floorDashboardData?.data.AckCount
        ? `ACK (${floorDashboardData?.data.AckCount})`
        : 'ACK (0)',
      link: routeProperty.ack.path(),
    },
    {
      color: 'danger',
      icon: imageLoadIcon,
      text: t`Load Image`,
      type: 'file',
      accept: 'image/*',
      handleFile: (file: File) => {
        handleAddFloorImage(file)
      },
      isLoading: addFloorImageLoading || isConverting,
      disabled: addFloorImageLoading || isConverting,
    },
    {
      color: 'danger',
      icon: isDraggable.editMode ? saveIcon : editLayoutIcon,
      text: isDraggable.editMode ? t`Save Layout` : t`Edit Layout`,
      onClick: () => {
        setIsDraggable((prevIsEditMode) => ({
          saveFunctionCall: prevIsEditMode.editMode,
          editMode: !prevIsEditMode.editMode,
        }))
      },
    },
    {
      color: 'danger',
      icon: toggleFloorIcon,
      text: t`Toggle Floor`,
      onClick: () => setToggleFloorShow((prevState) => !prevState),
    },
  ]
  const isNotFound = !floorDashboardData?.data.Logs.length && !floorDashboardLoading

  return (
    <Page>
      <Breadcrumbs
        breadcrumbsActions={breadcrumbsActions}
        pageRoutes={[
          {
            href: '/dashboard',
            text: t`Dashboard`,
          },
        ]}
      />
      <TableContainer>
        <FloorDashboardTableToolbar
          filterState={filterState}
          handleInputChange={handleFilterInputChangeWithApply}
          currentDeviceItems={floorDashboardData?.data?.Dashboard.items}
          isLoading={floorDashboardLoading}
        />

        {toggleFloorShow && (
          <FloorDashboardDrag
            isEditMode={isDraggable.editMode}
            saveFunctionCall={isDraggable.saveFunctionCall}
            filterState={filterState}
            handleInputChange={handleFilterInputChangeWithApply}
          />
        )}

        <Table>
          <TableHeader
            order={order}
            orderBy={orderBy}
            rowCount={floorDashboardData?.data.Logs.length}
            handleSort={handleSort}
            handleOrder={handleOrder}
            headerData={TABLE_HEAD}
          />
          <tbody className="divide-y divide-gray-200">
            {!floorDashboardLoading && (
              <>
                {floorDashboardData?.data.Logs.map((row) => (
                  <FloorDashboardTableRow key={row.LogNo} row={row} />
                ))}
              </>
            )}
          </tbody>
        </Table>
        <TableBodyLoading isLoading={floorDashboardLoading} />
        <TableNoData isNotFound={isNotFound} />
      </TableContainer>
    </Page>
  )
}

export default FloorDashboard
