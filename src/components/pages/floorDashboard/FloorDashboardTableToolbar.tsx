import { useEffect, useMemo } from 'react'
import useSWR from 'swr'
import { floorApi } from '../../../api/urls'
import { THandleFilterInputChange } from '../../../types/components/common'
import { IListServerResponse } from '../../../types/pages/common'
import { IFloorItemResult, IFloorResult } from '../../../types/pages/floor'
import { IFloorDashboardFilters, IFloorDashboardItems } from '../../../types/pages/floorDashboard'
import { SERVER_QUERY } from '../../../utils/config'
import t from '../../../utils/translator'
import Selector, { TSelectValue } from '../../atomic/Selector'
import TableToolbarContainerOnlyForDashboard from '../../HOC/style/table/TableToolbarContainerOnlyForDashboard'

interface IProps {
  filterState: IFloorDashboardFilters
  handleInputChange: THandleFilterInputChange
  currentDeviceItems?: IFloorDashboardItems
  isLoading: boolean
}

function FloorDashboardTableToolbar({
  filterState,
  handleInputChange,
  currentDeviceItems,
  isLoading,
}: IProps) {
  // const location = useLocation()

  const { isLoading: floorIsLoading, data: floorData } = useSWR<
    IListServerResponse<IFloorResult[]>
  >(floorApi.list(SERVER_QUERY.selectorDataQuery))

  const floorCurrentDeviceTypeOptions: { value: string; label: string }[] = useMemo(() => {
    if (!currentDeviceItems) return []

    return Object.entries(currentDeviceItems)
      .filter(([key, value]) => value && value.length)
      .map(([key]) => ({ value: key, label: t(key) }))
  }, [currentDeviceItems])

  const floorCurrentDeviceOptions = useMemo(
    () =>
      currentDeviceItems?.[filterState.DeviceType?.value as keyof IFloorItemResult]?.map(
        (device) => ({
          value: `${device.No}_${filterState.DeviceType?.value}`,
          label: device.Name,
        })
      ),
    [currentDeviceItems, filterState.DeviceType]
  )

  useEffect(() => {
    const queryDeviceType = filterState.DeviceType?.label
    const queryDevice = filterState.Device?.label

    if (!queryDeviceType) {
      handleInputChange('DeviceType', floorCurrentDeviceTypeOptions[0] || null)
    }

    if (!queryDevice) {
      const newDeviceOption =
        currentDeviceItems?.[
          floorCurrentDeviceTypeOptions[0]?.value as keyof IFloorItemResult
        ]?.map((device) => ({
          value: `${device.No}_${floorCurrentDeviceTypeOptions[0]?.value}`,
          label: device.Name,
        })) || []
      handleInputChange('Device', newDeviceOption?.[0] || null)
    }
  }, [filterState.Floor, currentDeviceItems, floorCurrentDeviceTypeOptions])

  const handleDeviceTypeChange = (name: string, selectedValue: TSelectValue) => {
    if (
      handleInputChange &&
      selectedValue &&
      !Array.isArray(selectedValue) &&
      typeof selectedValue === 'object'
    ) {
      handleInputChange(name, selectedValue)

      const newDeviceOption =
        currentDeviceItems?.[selectedValue.value as keyof IFloorItemResult]?.map((device) => ({
          value: `${device.No}_${selectedValue.value}`,
          label: device.Name,
        })) || []

      handleInputChange('Device', newDeviceOption[0])
    }
  }

  return (
    <TableToolbarContainerOnlyForDashboard>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-x-3 sm:gap-y-2 lg:gap-x-5">
        <Selector
          name="Floor"
          placeholder={t`Floor`}
          value={filterState.Floor}
          options={floorData?.data.map((result) => ({
            value: result.FloorNo.toString(),
            label: result.FloorName,
          }))}
          onChange={handleInputChange}
          isLoading={floorIsLoading}
        />
        <Selector
          name="DeviceType"
          placeholder={t`Device Type`}
          value={filterState.DeviceType}
          options={floorCurrentDeviceTypeOptions}
          onChange={handleDeviceTypeChange}
          isLoading={floorIsLoading || isLoading}
        />
        <Selector
          name="Device"
          placeholder={t`Device`}
          value={filterState.Device}
          options={floorCurrentDeviceOptions}
          onChange={handleInputChange}
          isLoading={floorIsLoading || isLoading}
        />
      </div>
    </TableToolbarContainerOnlyForDashboard>
  )
}

export default FloorDashboardTableToolbar
