import { inputApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import SwitchButtonSelect from '../../../../components/atomic/SelectSwitch'
import Selector from '../../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors, IListServerResponse } from '../../../../types/pages/common'
import { IDoorFormData, doorRexAndContactTypeOption } from '../../../../types/pages/door'
import { IInputResult } from '../../../../types/pages/input'
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

function DoorContactForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  const { isLoading: inputIsLoading, data: inputData } = useSWR<
    IListServerResponse<IInputResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : inputApi.list(`${SERVER_QUERY.selectorDataQuery}&NodeNo=${formData?.NodeNo}`)
  )

  return (
    <FormCardWithHeader icon={listIcon} header={t`Door Contact`}>
      <SwitchButtonSelect
        name="ContactEnable"
        value={formData?.ContactEnable}
        onChange={handleInputChange}
        label={t`Door Contact Enable`}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />

      {formData?.ContactEnable?.value === '1' &&
        formData?.SubnodeNo &&
        formData?.SubnodeNo !== '0' && (
          <Selector
            name="ContactInput"
            label={t`Door Contact Input`}
            value={formData?.ContactInput}
            onChange={handleInputChange}
            options={inputData?.data.map((result) => ({
              value: result.InputNo.toString(),
              label: result.InputName,
            }))}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.ContactInput}
            isLoading={isLoading || inputIsLoading}
          />
        )}

      {formData?.ContactEnable?.value === '1' && (
        <Selector
          name="ContactType"
          label={t`Door Contact Type`}
          value={formData?.ContactType}
          onChange={handleInputChange}
          options={doorRexAndContactTypeOption}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.ContactType}
          isLoading={isLoading}
        />
      )}

      {formData?.ContactEnable?.value === '1' && (
        <Input
          name="ProppedTime"
          label={t`Propped Time (sec) `}
          type="number"
          value={formData?.ProppedTime}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.ProppedTime}
          isLoading={isLoading}
          required={true} // modified by Imran
        />
      )}
      {formData?.ContactEnable?.value === '1' && (
        <Input
          name="AdaTime"
          label={t`ADA Time (sec) `}
          type="number"
          value={formData?.AdaTime}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.AdaTime}
          isLoading={isLoading}
          required={true} // modified by Imran
        />
      )}
    </FormCardWithHeader>
  )
}

export default DoorContactForm
