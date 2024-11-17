import { channelApi, partitionApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import Selector from '../../../../components/atomic/Selector'
import Textarea from '../../../../components/atomic/Textarea'
import MultiSelect from '../../../../components/common/form/MultiSelect'
import useSWR from 'swr'
import { THandleInputChange } from '../../../../types/components/common'
import { IChannelResult } from '../../../../types/pages/channel'
import { IFormErrors, IListServerResponse } from '../../../../types/pages/common'
import { IPartitionResult } from '../../../../types/pages/partition'
import { IViewFormData } from '../../../../types/pages/view'
import { SERVER_QUERY } from '../../../../utils/config'
import { doorIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'
import useAuth from '../../../../hooks/useAuth'
interface IProps {
  formData?: IViewFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function ViewForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  const { showPartition } = useAuth()
  const { isLoading: partitionIsLoading, data: partitionData } = useSWR<
    IListServerResponse<IPartitionResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : partitionApi.list(SERVER_QUERY.selectorDataQuery)
  )

  const { isLoading: channelIsLoading, data: channelData } = useSWR<
    IListServerResponse<IChannelResult[]>
  >(channelApi.list(SERVER_QUERY.selectorDataQuery))

  return (
    <FormCardWithHeader icon={doorIcon} header={t`View`}>
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
        name="ViewName"
        // placeholder="View Name"
        label={t`View Name `}
        value={formData?.ViewName}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.ViewName}
        isLoading={isLoading}
        required={true} // modified by Imran
      />
      <Input
        name="ViewDesc"
        // placeholder="Description"
        label={t`Description`}
        value={formData?.ViewDesc}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.ViewDesc}
        isLoading={isLoading}
      />
      {(disabled || typeof handleInputChange === 'undefined') && (
        <Textarea
          name="ChannelNos"
          label={t`View Channel`}
          value={formData?.Channels?.map((channel) => channel.ChannelName).join(', ')}
          row={6} //added by Imran
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          isLoading={isLoading || channelIsLoading}
        />
      )}
      {!(disabled || typeof handleInputChange === 'undefined') && (
        <MultiSelect
          name="ChannelNos"
          label={t`View Channel`}
          value={formData?.ChannelNos}
          onChange={handleInputChange}
          options={channelData?.data.map((item) => ({
            id: item.ChannelNo.toString(),
            label: item.ChannelName,
          }))}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          isLoading={isLoading || channelIsLoading}
          gridColSpan2
        />
      )}
    </FormCardWithHeader>
  )
}

export default ViewForm
