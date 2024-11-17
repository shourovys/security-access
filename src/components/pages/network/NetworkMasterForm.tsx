import FormCardWithHeader from '../../../components/HOC/FormCardWithHeader'
import Input from '../../../components/atomic/Input'
import { THandleInputChange } from '../../../types/components/common'
import { IFormErrors } from '../../../types/pages/common'
import { INetworkFormData } from '../../../types/pages/network'
import { masterIcon } from '../../../utils/icons'
import useAuth from '../../../hooks/useAuth'
import t from '../../../utils/translator'

interface IProps {
  formData?: INetworkFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function NetworkMasterForm({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
}: IProps) {
  const { license } = useAuth()
  return (
    <FormCardWithHeader icon={masterIcon} header={t`Master`}>
      {formData?.Cloud?.value !== '1' && license?.NodeType !== 1 && (
        <Input
          name="MasterAddr"
          label={t`Master Address `}
          value={formData?.MasterAddr}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.MasterAddr}
          isLoading={isLoading}
          required={true} // modified by Imran
        />
      )}
      {formData?.Cloud?.value !== '1' && license?.NodeType !== 1 && (
        <Input
          name="MasterPort"
          type="number"
          label={t`Master Port `}
          value={formData?.MasterPort}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.MasterPort}
          isLoading={isLoading}
          required={true} // modified by Imran
        />
      )}
    </FormCardWithHeader>
  )
}

export default NetworkMasterForm
