import useSWR from 'swr'
import { nodeApi } from '../../../../api/urls'
import FileInput from '../../../../components/atomic/FileInput'
import Selector from '../../../../components/atomic/Selector'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import { THandleInputChange } from '../../../../types/components/common'
import {
  ICommandResponse,
  IFormErrors,
  ISingleServerResponse,
} from '../../../../types/pages/common'
import { INodeSwSyncFormData, nodeSwSyncMediaOptionsWithLabel } from '../../../../types/pages/node'
import { swSyncIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData: INodeSwSyncFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function SwSyncForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  const { isLoading: serverFilesLoading, data: serverFilesData } = useSWR<ICommandResponse<[]>>(
    !formData.MediaType?.value ||
      disabled ||
      typeof handleInputChange === 'undefined' ||
      formData.MediaType?.value === 'UserPC'
      ? null
      : nodeApi.mediaType(`MediaType=${formData.MediaType?.value}`)
  )

  return (
    <FormCardWithHeader icon={swSyncIcon} header={t`SW Sync`}>
      <Selector
        name="MediaType"
        label={t`Media`}
        value={formData.MediaType}
        options={nodeSwSyncMediaOptionsWithLabel}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
        error={formErrors?.MediaType}
      />
      <div>
        {formData.MediaType?.value === 'UserPC' ? (
          <FileInput
            name="File"
            label={t`File`}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            isLoading={isLoading}
            error={formErrors?.File}
          />
        ) : (
          <Selector
            name="FileName"
            label={t`File`}
            value={formData.FileName}
            options={serverFilesData?.cgi.data.map((option) => ({
              label: option,
              value: option,
            }))}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            isLoading={isLoading || serverFilesLoading}
            error={formErrors?.FileName}
          />
        )}
      </div>
    </FormCardWithHeader>
  )
}

export default SwSyncForm
