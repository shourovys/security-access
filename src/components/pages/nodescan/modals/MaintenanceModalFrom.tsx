import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors } from '../../../../types/pages/common'
import {
  INodeScanUpdateFormData,
  nodeScanDefaultTypeOptions,
  nodeScanRebootTypeOptions,
  nodeScanUpdateTypeOptions,
} from '../../../../types/pages/nodeScan'
import { defaultIcon, rebootIcon, updateIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'
import RadioButtons from '../../../atomic/RadioButtons'

interface IProps {
  formData: INodeScanUpdateFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function UpdateModalFieldFrom({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
}: IProps) {
  return (
    <FormCardWithHeader icon={updateIcon} header={t`Update`} twoPart={false}>
      <RadioButtons
        name="Type"
        inputLabel={t`Update Type`}
        checked={formData.Type}
        radios={nodeScanUpdateTypeOptions}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Type}
        isLoading={isLoading}
      />
    </FormCardWithHeader>
  )
}

function RebootModalFieldFrom({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
}: IProps) {
  return (
    <FormCardWithHeader icon={rebootIcon} header={t`Reboot`} twoPart={false}>
      <RadioButtons
        name="Type"
        inputLabel={t`Reboot Type`}
        checked={formData.Type}
        radios={nodeScanRebootTypeOptions}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Type}
        isLoading={isLoading}
      />
    </FormCardWithHeader>
  )
}

function DefaultModalFieldFrom({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
}: IProps) {
  return (
    <FormCardWithHeader icon={defaultIcon} header={t`Default`} twoPart={false}>
      <RadioButtons
        name="Type"
        inputLabel={t`Default Type`}
        checked={formData.Type}
        radios={nodeScanDefaultTypeOptions}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Type}
        isLoading={isLoading}
      />
    </FormCardWithHeader>
  )
}

export { DefaultModalFieldFrom, RebootModalFieldFrom, UpdateModalFieldFrom }
