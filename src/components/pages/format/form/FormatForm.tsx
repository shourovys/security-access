import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import Input from '../../../../components/atomic/Input'
import SwitchButtonSelect from '../../../../components/atomic/SelectSwitch'
import Selector from '../../../../components/atomic/Selector'
import { THandleInputChange } from '../../../../types/components/common'
import { IFormErrors } from '../../../../types/pages/common'
import { IFormatFormData, formatTypeOptions } from '../../../../types/pages/format'
import { formatIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'

interface IProps {
  formData: IFormatFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function FormatForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  return (
    <FormCardWithHeader icon={formatIcon} header={t`Format`}>
      <Input
        name="FormatName"
        // placeholder="Format Name"
        label={t`Format Name `}
        value={formData.FormatName}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.FormatName}
        isLoading={isLoading}
        required={true}
      />
      <Input
        name="FormatDesc"
        // placeholder="Description"
        label={t`Description`}
        value={formData.FormatDesc}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.FormatDesc}
        isLoading={isLoading}
      />
      <SwitchButtonSelect
        name="DefaultFormat"
        label={t`Default Format`}
        value={formData.DefaultFormat}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
      <SwitchButtonSelect
        name="NapcoFormat"
        label={t`Napco Format`}
        value={formData.NapcoFormat}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
      <SwitchButtonSelect
        name="BigEndian"
        label={t`Big Endian`}
        value={formData.BigEndian}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        isLoading={isLoading}
      />
      <Selector
        name="FormatType"
        label={t`Format Type`}
        value={formData.FormatType}
        options={formatTypeOptions}
        onChange={handleInputChange}
        error={formErrors?.FormatType}
        isLoading={isLoading}
        disabled={disabled || typeof handleInputChange === 'undefined'}
      />
      {/* <Input
        name="TotalLength"
        placeholder="Total Length"
        label={t`Total Length`}
        type="number"
        value={formData.TotalLength}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.TotalLength}
        isLoading={isLoading}
      />
      <Input
        name="FacilityCode"
        placeholder="Facility Code"
        label={t`Facility Code `}
        type="number"
        value={formData.FacilityCode}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.FacilityCode}
        isLoading={isLoading}
        required={true} 
      /> */}

      {/* <div className="flex items-center justify-between">
        <SwitchButton
          name="KeyFormat"
          label={t`Key Format`}
          checked={formData.KeyFormat}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          isLoading={isLoading}
        />
        <SwitchButton
          name="DefaultFormat"
          label={t`Default Format`}
          checked={formData.DefaultFormat}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          isLoading={isLoading}
        />
      </div> */}
    </FormCardWithHeader>
  )
}

export default FormatForm
