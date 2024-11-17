import FormCardWithHeader from '../../../components/HOC/FormCardWithHeader'
import Input from '../../../components/atomic/Input'
import SwitchButtonSelect from '../../../components/atomic/SelectSwitch'
import { THandleInputChange } from '../../../types/components/common'
import { INewFormErrors } from '../../../types/pages/common'
import { IFaceFormData } from '../../../types/pages/face'
import { faceIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

interface IProps {
  formData?: IFaceFormData
  handleInputChange?: THandleInputChange
  formErrors?: INewFormErrors<IFaceFormData>
  disabled?: boolean
  isLoading?: boolean
}

function FaceForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  return (
    <FormCardWithHeader icon={faceIcon} header={t`Face Configuration`}>
      <SwitchButtonSelect
        name="Enable"
        label={t`Enable`}
        value={formData?.Enable}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
      {formData?.Enable?.value === '1' && (
        <Input
          name="ImagePath"
          label={t`Image Path `}
          value={formData?.ImagePath}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.ImagePath}
          isLoading={isLoading}
          required={true} // modified by Imran
        />
      )}
    </FormCardWithHeader>
  )
}

export default FaceForm
