import FormCardWithHeader from '../../../components/HOC/FormCardWithHeader'
import IconButton from '../../../components/atomic/IconButton'
import Input from '../../../components/atomic/Input'
import SwitchButtonSelect from '../../../components/atomic/SelectSwitch'
import { THandleInputChange } from '../../../types/components/common'
import { IFormErrors } from '../../../types/pages/common'
import { IRestApiFormData } from '../../../types/pages/restApi'
import { resetIcon, restAPIIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

function generateRandomString(): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const randomIndices = Array.from({ length: 16 }, () => Math.floor(Math.random() * charset.length))
  return randomIndices.map((index) => charset[index]).join('')
}

interface IProps {
  formData?: IRestApiFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function RestApiForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  return (
    <FormCardWithHeader icon={restAPIIcon} header={t`REST API Configuration`}>
      <SwitchButtonSelect
        name="Enable"
        label={t`Enable`}
        value={formData?.Enable}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
      <div>
        {formData?.Enable?.value === '1' && (
          <div className="flex items-end gap-2">
            <Input
              name="ApiKey"
              // placeholder="API Key"
              readOnly
              label={t`API key `}
              value={formData?.ApiKey}
              onChange={handleInputChange}
              disabled={disabled || typeof handleInputChange === 'undefined'}
              error={formErrors?.ApiKey}
              isLoading={isLoading}
              required={true}
            />

            {typeof handleInputChange !== 'undefined' && (
              <IconButton
                icon={resetIcon}
                tooltip="Generate"
                iconClass="mb-.5"
                onClick={() => {
                  handleInputChange('ApiKey', generateRandomString())
                }}
              />
            )}
          </div>
        )}
      </div>
    </FormCardWithHeader>
  )
}

export default RestApiForm
