import FormCardWithHeader from '../../../components/HOC/FormCardWithHeader'
import Textarea from '../../../components/atomic/Textarea'
import { THandleInputChange } from '../../../types/components/common'
import { IFormErrors } from '../../../types/pages/common'
import { INetworkCaCertificateFormData } from '../../../types/pages/network'
import { certificateIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

interface IProps {
  formData?: INetworkCaCertificateFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function CaCertificateUploadForm({
  formData,
  handleInputChange,
  formErrors,
  disabled,
  isLoading,
}: IProps) {
  return (
    <FormCardWithHeader icon={certificateIcon} header={t`CA-Certificate`} twoPart={false}>
      <Textarea
        name="CertificateKey"
        label={t`Certificate Key`}
        value={formData?.CertificateKey}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.CertificateKey}
        isLoading={isLoading}
      />
      <Textarea
        name="Certificate"
        label={t`Certificate`}
        value={formData?.Certificate}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Certificate}
        isLoading={isLoading}
      />
    </FormCardWithHeader>
  )
}

export default CaCertificateUploadForm
