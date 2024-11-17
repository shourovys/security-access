import { outputApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import SwitchButtonSelect from '../../../../components/atomic/SelectSwitch'
import Selector from '../../../../components/atomic/Selector'
import useSWR from 'swr'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors, IListServerResponse } from '../../../../types/pages/common'
import { IDoorFormData, doorLockTypeOption } from '../../../../types/pages/door'
import { IOutputResult } from '../../../../types/pages/output' // Update interface import
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

function DoorLockForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  const { isLoading: outputIsLoading, data: outputData } = useSWR<
    IListServerResponse<IOutputResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : outputApi.list(`${SERVER_QUERY.selectorDataQuery}&NodeNo=${formData?.NodeNo}`)
  )

  return (
    <FormCardWithHeader icon={listIcon} header={t`Door Lock`}>
      <Selector
        name="LockType"
        label={t`Door Lock Type`}
        value={formData?.LockType}
        options={doorLockTypeOption}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.LockType}
        isLoading={isLoading}
      />

      {formData?.RexEnable?.value === '1' && formData?.SubnodeNo && formData?.SubnodeNo !== '0' && (
        <Selector
          name="LockOutputNo"
          label={t`Door Lock Output`}
          value={formData?.LockOutput}
          onChange={handleInputChange}
          options={outputData?.data.map((result) => ({
            value: result.OutputNo.toString(),
            label: result.OutputName,
          }))}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.LockOutput}
          isLoading={isLoading || outputIsLoading}
        />
      )}

      <SwitchButtonSelect
        name="RelockOnOpen"
        label={t`Relock On Open`}
        value={formData?.RelockOnOpen}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />

      <Input
        name="UnlockTime"
        label={t`Unlock Time (Sec) `}
        type="number"
        value={formData?.UnlockTime}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.UnlockTime}
        isLoading={isLoading}
        required={true} // modified by Imran
      />

      <SwitchButtonSelect
        name="ExtendedUnlock"
        label={t`Extended Unlock`}
        value={formData?.ExtendedUnlock}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />

      {formData?.ExtendedUnlock?.value === '1' && (
        <Input
          name="ExUnlockTime"
          label={t`Extended Unlock Time (min) `}
          type="number"
          value={formData?.ExUnlockTime}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.ExUnlockTime}
          isLoading={isLoading}
          required={true} // modified by Imran
        />
      )}
    </FormCardWithHeader>
  )
}

export default DoorLockForm
