import FormCardWithHeader from '../../../components/HOC/FormCardWithHeader'
import Input from '../../../components/atomic/Input'
import { THandleInputChange } from '../../../types/components/common'
import { IFormErrors } from '../../../types/pages/common'
import { ILicenseFormData } from '../../../types/pages/license'
import { doorIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

interface IProps {
  formData?: ILicenseFormData
  handleInputChange?: THandleInputChange
  formErrors?: IFormErrors
  disabled?: boolean
  isLoading?: boolean
}

function LicenseInformationForm({
  formData,
  handleInputChange,
  formErrors,
  // disabled,
  isLoading,
}: IProps) {
  return (
    <FormCardWithHeader icon={doorIcon} header={t`License Information`}>
      {formData?.Mac && formData?.Mac !== '0' && (
        <Input
          name="Mac"
          label={t`MAC`}
          value={formData?.Mac}
          onChange={handleInputChange}
          disabled
          error={formErrors?.Mac}
          isLoading={isLoading}
        />
      )}

      {formData?.Product && formData?.Product !== '0' && (
        <Input
          name="Product"
          label={t`Product`}
          value={formData?.Product}
          onChange={handleInputChange}
          disabled
          error={formErrors?.Product}
          isLoading={isLoading}
        />
      )}

      {formData?.Model && formData?.Model !== '0' && (
        <Input
          name="Model"
          label={t`Model`}
          value={formData?.Model}
          onChange={handleInputChange}
          disabled
          error={formErrors?.Model}
          isLoading={isLoading}
        />
      )}

      {formData?.Type && formData?.Type !== '0' && (
        <Input
          name="Type"
          label={t`Type`}
          value={formData?.Type}
          onChange={handleInputChange}
          disabled
          error={formErrors?.Type}
          isLoading={isLoading}
        />
      )}

      {formData?.OptionsStr && formData?.OptionsStr !== '0' && (
        <Input
          name="Options"
          label={t`Options`}
          value={formData?.OptionsStr}
          onChange={handleInputChange}
          disabled
          error={formErrors?.Options}
          isLoading={isLoading}
        />
      )}

      {formData?.Oem && (
        <Input
          name="Oem"
          label={t`OEM`}
          value={formData?.Oem}
          onChange={handleInputChange}
          disabled
          error={formErrors?.Oem}
          isLoading={isLoading}
        />
      )}

      {formData?.Camera && formData?.Camera !== '0' && (
        <Input
          name="Camera"
          label={t`Camera`}
          value={formData?.Camera}
          onChange={handleInputChange}
          disabled
          error={formErrors?.Camera}
          isLoading={isLoading}
        />
      )}

      {formData?.Channel && formData?.Channel !== '0' && (
        <Input
          name="Channel"
          label={t`Channel`}
          value={formData?.Channel}
          onChange={handleInputChange}
          disabled
          error={formErrors?.Channel}
          isLoading={isLoading}
        />
      )}

      {formData?.Lockset && formData?.Lockset !== '0' && (
        <Input
          name="Lockset"
          label={t`Lockset`}
          value={formData?.Lockset}
          onChange={handleInputChange}
          disabled
          error={formErrors?.Lockset}
          isLoading={isLoading}
        />
      )}

      {formData?.Facegate && formData?.Facegate !== '0' && (
        <Input
          name="Facegate"
          label={t`Facegate`}
          value={formData?.Facegate}
          onChange={handleInputChange}
          disabled
          error={formErrors?.Facegate}
          isLoading={isLoading}
        />
      )}

      {formData?.Subnode && formData?.Subnode !== '0' && (
        <Input
          name="Subnode"
          label={t`Subnode`}
          value={formData?.Subnode}
          onChange={handleInputChange}
          disabled
          error={formErrors?.Subnode}
          isLoading={isLoading}
        />
      )}

      {formData?.ContLock && formData?.ContLock !== '0' && (
        <Input
          name="ContLock"
          label={t`ContLock`}
          value={formData?.ContLock}
          onChange={handleInputChange}
          disabled
          error={formErrors?.ContLock}
          isLoading={isLoading}
        />
      )}

      {formData?.Intercom && formData?.Intercom !== '0' && (
        <Input
          name="Intercom"
          label={t`Intercom`}
          value={formData?.Intercom}
          onChange={handleInputChange}
          disabled
          error={formErrors?.Intercom}
          isLoading={isLoading}
        />
      )}

      {/* {formData?.Licensed && formData?.Licensed !== '0' && (
        <Input
          name="Licensed"
          label={t`Licensed`}
          value={formData?.Licensed}
          onChange={handleInputChange}
          disabled
          error={formErrors?.Licensed}
          isLoading={isLoading}
        />
      )}

      {formData?.Eula && formData?.Eula !== '0' && (
        <Input
          name="Eula"
          label={t`EULA`}
          value={formData?.Eula}
          onChange={handleInputChange}
          disabled
          error={formErrors?.Eula}
          isLoading={isLoading}
        />
      )} */}
    </FormCardWithHeader>
  )
}

export default LicenseInformationForm
