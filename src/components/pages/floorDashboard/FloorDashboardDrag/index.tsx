import { useEffect, useState } from 'react'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sendPostRequest } from '../../../../api/swrConfig'
import { floorDartboardApi } from '../../../../api/urls'
import { THandleFilterInputChange } from '../../../../types/components/common'
import { ISingleServerResponse } from '../../../../types/pages/common'
import {
  IDragButton,
  IFloorDashboardFilters,
  IFloorDashboardItems,
  IFloorDashboardResult,
  IFloorDashboardValue,
} from '../../../../types/pages/floorDashboard'
import { IMAGE_URL } from '../../../../utils/config'
import getIconByDeviceState from '../../../../utils/getIconByDeviceState'
import { promiseToast } from '../../../../utils/toast'
import DeviceActions from './DeviceActions'
import DragButton from './DragButton'
import DragContainer from './DragContainer'

interface IProps {
  isEditMode: boolean
  saveFunctionCall: boolean
  filterState: IFloorDashboardFilters
  handleInputChange: THandleFilterInputChange
}

const FloorDashboardDrag = ({
  isEditMode,
  saveFunctionCall,
  filterState,
  handleInputChange,
}: IProps) => {
  const {
    // isLoading: floorDeviceLoading,
    data: floorDeviceData,
    mutate,
  } = useSWR<ISingleServerResponse<IFloorDashboardResult>>(
    filterState.Floor ? floorDartboardApi.floorDashboard(filterState.Floor.value) : null
    // {
    //   onError: () => {},
    // }
  )

  const [buttons, setButtons] = useState<IDragButton[]>([])

  useEffect(() => {
    if (floorDeviceData) {
      const serverDevices: IDragButton[] = Object.entries(
        floorDeviceData.data.Dashboard.items
      ).flatMap(([key, value]) =>
        value.map((device: IFloorDashboardValue) => ({
          No: device.No,
          Type: key,
          FloorItemNo: device.FloorItemNo,
          No_Type: device.No + '_' + key,
          Name: device.Name,
          Position: {
            x: device.PositionX,
            y: device.PositionY,
          },
          Status: device.Status,
          Alert: device.Alert,
          Icon: getIconByDeviceState(key as keyof IFloorDashboardItems, device),
        }))
      )
      setButtons(serverDevices)
    }
  }, [floorDeviceData])

  const handlePositionChange = (No_Type: string, newPosition: { x: number; y: number }) => {
    const updatedState = buttons.map((button) => {
      if (button.No_Type === No_Type) {
        return { ...button, Position: newPosition }
      } else {
        return button
      }
    })
    setButtons(updatedState)
  }

  // Define the mutation function to button positions to the server
  const { trigger } = useSWRMutation(floorDartboardApi.saveButtonPositions, sendPostRequest, {
    onSuccess: () => {
      mutate()
    },
  })

  useEffect(() => {
    if (saveFunctionCall) {
      // Modify form data to match API requirements and trigger the mutation
      const modifiedFormData = buttons.map((button) => ({
        FloorItemId: button.FloorItemNo,
        PositionX: button.Position.x,
        PositionY: button.Position.y,
      }))
      promiseToast(trigger({ FloorItems: modifiedFormData }), {
        loading: 'Saving...',
        success: 'Success',
      })
    }
  }, [saveFunctionCall])

  const reloadButtonData = () => {
    mutate()
  }
  return (
    <div>
      <DeviceActions
        selectedDeviceType={(filterState.DeviceType?.value || '') as keyof IFloorDashboardItems}
        selected={
          filterState.Device?.value.split('_')[0] ? [filterState.Device?.value.split('_')[0]] : []
        }
        selectedDeviceName={
          filterState.Device?.value.split('_')[0] ? filterState.Device?.label : ''
        }
        reloadButtonData={reloadButtonData}
      />
      <DragContainer imageSrc={IMAGE_URL + floorDeviceData?.data.Dashboard.ImageFile}>
        {/* <div className="h-full w-max min-w-max"> */}
        {buttons.map((button) => (
          <DragButton
            key={button.FloorItemNo}
            button={button}
            onPositionChange={handlePositionChange}
            isEditMode={isEditMode}
            selectedFloorItemNo={filterState.Device?.value || ''}
            handleInputChange={handleInputChange}
          />
        ))}
        {/* </div> */}
      </DragContainer>
    </div>
  )
}

export default FloorDashboardDrag
