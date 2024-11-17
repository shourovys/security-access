import React from 'react'
import { THandleFilterInputChange } from '../../../types/components/common'
import { IPlaybackFilters } from '../../../types/pages/playback'
import t from '../../../utils/translator'
import Selector from '../../atomic/Selector'

interface IProps {
  selectedHour: string
  setSelectedHour: React.Dispatch<React.SetStateAction<string>>
  selectedMinute: string
  setSelectedMinute: React.Dispatch<React.SetStateAction<string>>
  filterState: IPlaybackFilters
  handleInputChange: THandleFilterInputChange
  recordedDates?: string[]
  selectedDateRecordedTimes?: string[]
  handleReloadData: () => void
  isLoading: boolean
}

function SelectRecordedTime({
  selectedHour,
  setSelectedHour,
  selectedMinute,
  setSelectedMinute,
  filterState,
  handleInputChange,
  recordedDates,
  selectedDateRecordedTimes,
  handleReloadData,
  isLoading,
}: IProps) {
  // const { isLoading: channelIsLoading, data: channelData } = useSWR<
  //   IListServerResponse<IChannelResult[]>
  // >(channelApi.list(SERVER_QUERY.selectorDataQuery))

  function removeDuplicateDates(Dates?: string[]): string[] {
    if (!Dates) {
      return []
    }
    return Array.from(new Set(Dates.map((item) => item.split(' ')[0])))
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-center mb-2 bg-white">
      <div className="grid justify-between grid-cols-1 gap-2 sm:grid-cols-3 md:grid-cols-3 w-full lg:grid-cols-3 sm:gap-x-3 sm:gap-y-2 lg:gap-x-5">
        {/* <Selector
          name="Channel"
          label={t`Channel`}
          value={filterState.Channel}
          options={channelData?.data.map((result) => ({
            value: result.ChannelNo.toString(),
            label: result.ChannelName,
          }))}
          onChange={handleInputChange}
          isLoading={channelIsLoading}
        /> */}

        <Selector
          name="Time"
          label={t`Date`}
          value={filterState.Time}
          options={removeDuplicateDates(recordedDates)?.map((time) => ({
            label: time,
            value: time,
          }))}
          onChange={handleInputChange}
          isLoading={isLoading}
          // isLoading={channelIsLoading || isLoading}
        />

        <Selector
          name="Hour"
          label={t`Hour`}
          value={selectedHour ? { label: selectedHour, value: selectedHour } : null}
          options={Array.from(
            new Set(selectedDateRecordedTimes?.map((time) => time.slice(11, 13)))
          ).map((time) => ({
            label: time,
            value: time,
          }))}
          onChange={(name, selectedValue) =>
            setSelectedHour(selectedValue && 'value' in selectedValue ? selectedValue?.value : '')
          }
          isLoading={isLoading}
          // isLoading={channelIsLoading || isLoading}
        />

        <Selector
          name="Minute"
          label={t`Minute`}
          value={selectedMinute ? { label: selectedMinute, value: selectedMinute } : null}
          options={selectedDateRecordedTimes
            ?.filter((time) => time.slice(11, 13) === selectedHour)
            ?.map((time) => ({
              label: time.slice(14, 16),
              value: time.slice(14, 16),
            }))}
          onChange={(name, selectedValue) =>
            setSelectedMinute(selectedValue && 'value' in selectedValue ? selectedValue?.value : '')
          }
          isLoading={isLoading}
          // isLoading={channelIsLoading || isLoading}
        />
      </div>
      {/* <Button onClick={handleReloadData} className="flex mt-2">
          <Icon icon={reloadIcon} />
          <span>Reload</span>
        </Button> */}
    </div>
  )
}

export default SelectRecordedTime
