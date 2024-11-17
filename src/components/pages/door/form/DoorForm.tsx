import { faUser } from '@fortawesome/free-regular-svg-icons'
import { partitionApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import Selector from '../../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors, IListServerResponse } from '../../../../types/pages/common'
import { IDoorFormData, IDoorInfoFormData } from '../../../../types/pages/door'
import { IPartitionResult } from '../../../../types/pages/partition'
import { SERVER_QUERY } from '../../../../utils/config'
import t from '../../../../utils/translator'

interface IProps {
  formData?: IDoorFormData | IDoorInfoFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function DoorForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  const { isLoading: partitionIsLoading, data: partitionData } = useSWR<
    IListServerResponse<IPartitionResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : partitionApi.list(SERVER_QUERY.selectorDataQuery)
  )

  return (
    <FormCardWithHeader icon={faUser} header={t`Door`}>
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
        isLoading={isLoading || partitionIsLoading}
      />
      <Input
        name="DoorName"
        label={t`Door Name `}
        value={formData?.DoorName}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
        error={formErrors?.DoorName}
        required={true} // modified by Imran
      />
      <Input
        name="DoorDesc"
        label={t`Description`}
        value={formData?.DoorDesc?.toString()}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
        error={formErrors?.DoorDesc}
      />
      <div>
        {(disabled || typeof handleInputChange === 'undefined') &&
          formData &&
          'NodeName' in formData && (
            <Input
              name="NodeName"
              label={t`Node`}
              value={`${formData?.NodeName} ${
                formData?.SubnodeName && '-' + formData?.SubnodeName
              }`}
              onChange={handleInputChange}
              isLoading={isLoading}
              disabled={disabled || typeof handleInputChange === 'undefined'}
              error={formErrors?.NodeName}
            />
          )}
      </div>
      <div>
        {(disabled || typeof handleInputChange === 'undefined') &&
          formData &&
          'DoorPort' in formData && (
            <Input
              name="DoorPort"
              label={t`Door Port`}
              type="number"
              value={formData?.DoorPort}
              onChange={handleInputChange}
              disabled={disabled || typeof handleInputChange === 'undefined'}
              error={formErrors?.DoorPort}
            />
          )}
      </div>
    </FormCardWithHeader>
  )
}

export default DoorForm
