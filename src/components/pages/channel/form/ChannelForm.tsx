import useSWR from 'swr'
import { nvrApi, partitionApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import SwitchButtonSelect from '../../../../components/atomic/SelectSwitch'
import Selector from '../../../../components/atomic/Selector'
import useAuth from '../../../../hooks/useAuth'
import { THandleInputChange } from '../../../../types/components/common'
import { IChannelFormData } from '../../../../types/pages/channel'
import { IFormErrors, IListServerResponse } from '../../../../types/pages/common'
import { INvrResult } from '../../../../types/pages/nvr'
import { IPartitionResult } from '../../../../types/pages/partition'
import { SERVER_QUERY } from '../../../../utils/config'
import { channelIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData?: IChannelFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function ChannelForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  const { showPartition } = useAuth()
  const { isLoading: partitionIsLoading, data: partitionData } = useSWR<
    IListServerResponse<IPartitionResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : partitionApi.list(SERVER_QUERY.selectorDataQuery)
  )

  const { isLoading: nvrIsLoading, data: nvrData } = useSWR<IListServerResponse<INvrResult[]>>(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : nvrApi.list(SERVER_QUERY.selectorDataQuery)
  )

  return (
    <FormCardWithHeader icon={channelIcon} header={t`Channel`}>
      {showPartition && (
        <Selector
          name="Partition"
          label={t`Partition`}
          value={formData?.Partition}
          options={partitionData?.data.map((result) => ({
            value: result.PartitionNo.toString(),
            label: result.PartitionName,
          }))}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.Partition}
          isLoading={isLoading || partitionIsLoading}
        />
      )}
      <Input
        name="ChannelName"
        label={t`Channel Name `}
        value={formData?.ChannelName}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.ChannelName}
        isLoading={isLoading}
        required={true} // modified by Imran
      />
      <Input
        name="ChannelDesc"
        label={t`Description`}
        value={formData?.ChannelDesc}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.ChannelDesc}
        isLoading={isLoading}
      />
      <Selector
        name="Nvr"
        label={t`NVR `}
        value={formData?.Nvr}
        options={nvrData?.data.map((result) => ({
          value: result.NvrNo.toString(),
          label: result.NvrName,
        }))}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Nvr}
        isLoading={isLoading || nvrIsLoading}
        required={true} // modified by Imran
      />
      <Input
        name="ChannelId"
        label={t`Channel ID `}
        value={formData?.ChannelId}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.ChannelId}
        isLoading={isLoading}
        required={true} // modified by Imran
      />
      <SwitchButtonSelect
        name="Streaming"
        label={t`Streaming`}
        value={formData?.Streaming}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
      {(disabled || typeof handleInputChange === 'undefined') && (
        <Input
          name="Online"
          label={t`Online`}
          value={formData?.Online}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.Online}
          isLoading={isLoading}
        />
      )}
    </FormCardWithHeader>
  )
}

export default ChannelForm
