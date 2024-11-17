import { channelApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import SwitchButtonSelect from '../../../../components/atomic/SelectSwitch'
import Selector from '../../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange } from '../../../../types/components/common'
import { IChannelResult } from '../../../../types/pages/channel'
import { IFormErrors, IListServerResponse } from '../../../../types/pages/common'
import { IDoorFormData } from '../../../../types/pages/door'
import { SERVER_QUERY } from '../../../../utils/config'
import { listIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData?: IDoorFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function DoorChannelForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  const { isLoading: channelIsLoading, data: channelData } = useSWR<
    IListServerResponse<IChannelResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : channelApi.list(SERVER_QUERY.selectorDataQuery)
  )
  return (
    <FormCardWithHeader icon={listIcon} header={t`Channel`}>
      <SwitchButtonSelect
        name="ChannelEnable"
        value={formData?.ChannelEnable}
        onChange={handleInputChange}
        label={t`Channel Enable`}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />

      {formData?.ChannelEnable?.value === '1' && (
        <Selector
          name="Channel"
          label={t`Channel `}
          value={formData?.Channel}
          options={channelData?.data.map((item) => ({
            value: item.ChannelNo.toString(),
            label: item.ChannelName,
          }))}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.Channel}
          isLoading={isLoading || channelIsLoading}
          required={true} // modified by Imran
        />
      )}
    </FormCardWithHeader>
  )
}

export default DoorChannelForm
