import { useEffect } from 'react'
import useSWR from 'swr'
import { channelApi } from '../../../api/urls'
import { THandleFilterInputChange } from '../../../types/components/common'
import { IChannelResult } from '../../../types/pages/channel'
import { IListServerResponse } from '../../../types/pages/common'
import { IPlaybackFilters } from '../../../types/pages/playback'
import { SERVER_QUERY } from '../../../utils/config'
import t from '../../../utils/translator'
import DateTimeInput from '../../atomic/DateTimeInput'
import Selector, { TSelectValue } from '../../atomic/Selector'

interface IProps {
  isLoading: boolean
  filterState: IPlaybackFilters
  handleInputChange: THandleFilterInputChange
}

function RecordGoToModal({ filterState, handleInputChange, isLoading }: IProps) {
  const { isLoading: channelIsLoading, data: channelData } = useSWR<
    IListServerResponse<IChannelResult[]>
  >(channelApi.list(SERVER_QUERY.selectorDataQuery))

  const handleChannelChange: (name: string, selectedValue: TSelectValue) => void = (
    name,
    value
  ) => {
    handleInputChange(name, value)
    if (value && 'value' in value) {
      // Check if 'value' exists and is an object
      const selectedChannelNvr = channelData?.data.find(
        (result) => result.ChannelNo.toString() === value.value.toString()
      )
      if (selectedChannelNvr) {
        handleInputChange('NvrType', selectedChannelNvr.Nvr.NvrType)
      }
    }
  }

  useEffect(() => {
    if (!filterState.Channel?.label && channelData && channelData.data.length > 0) {
      handleChannelChange('Channel', {
        label: channelData.data[0].ChannelName,
        value: channelData.data[0].ChannelId.toString(),
      })
    }
  }, [channelData])

  return (
    <div className="space-y-3">
      <Selector
        name="Channel"
        label={t`Channel`}
        value={filterState.Channel}
        options={channelData?.data.map((result) => ({
          value: result.ChannelNo.toString(),
          label: result.ChannelName,
        }))}
        onChange={handleChannelChange}
        isLoading={channelIsLoading}
      />
      {filterState.NvrType !== 0 && (
        <DateTimeInput
          name="RecordTime"
          label={t`Record Time`}
          // type="datetime-local"
          value={filterState.RecordTime}
          onChange={handleInputChange}
          format="yyyy-MM-dd HH:mm"
          required={true}
        />
      )}
    </div>
  )
}

export default RecordGoToModal
