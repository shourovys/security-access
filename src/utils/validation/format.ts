import { INewFormErrors } from '../../types/pages/common'
import { IFormatFormData, parityOptions } from '../../types/pages/format'
import t from '../translator'

const validateFormatFormData = (formData: IFormatFormData): INewFormErrors<IFormatFormData> => {
  const parityFields1Present =
    formData.Parity1Type?.value && formData.Parity1Type?.value !== parityOptions[0].value
  const parityFields2Present =
    formData.Parity2Type?.value && formData.Parity2Type?.value !== parityOptions[0].value

  const errors: INewFormErrors<IFormatFormData> = {}
  if (!formData.FormatName) {
    errors.FormatName = t`Format Name is required`
  }
  if (!formData.TotalLength) {
    errors.TotalLength = t`Total Length is required`
  }
  // if (formData.KeyFormat && !formData.FacilityCode) {
  //   errors.FacilityCode = t`Facility Code is required for Key Format`
  // }
  // if (formData.DefaultFormat && formData.KeyFormat) {
  //   errors.DefaultFormat = t`You cannot select both Use setting and Key Format`
  // }
  // if (!formData.DefaultFormat && !formData.KeyFormat) {
  //   errors.DefaultFormat = t`You must select either Use setting or Key Format`
  // }
  if (!formData.FacilityCode) {
    errors.FacilityCode = t`Facility Code is required`
  }
  if (!formData.FacilityStart) {
    errors.FacilityStart = t`Facility Start is required`
  }
  if (!formData.FacilityLength) {
    errors.FacilityLength = t`Facility Length is required`
  }

  if (!formData.NumberStart) {
    errors.NumberStart = t`Number Start is required`
  }
  if (!formData.NumberLength) {
    errors.NumberLength = t`Number Length is required`
  }

  if (parityFields1Present && !formData.Parity1Position) {
    errors.Parity1Position = t`Priority Position 1 is required`
  }
  if (parityFields1Present && !formData.Parity1Start) {
    errors.Parity1Start = t`Priority Start 1 is required`
  }
  if (parityFields1Present && !formData.Parity1Length) {
    errors.Parity1Length = t`Priority Length 1 is required`
  }
  if (parityFields2Present && !formData.Parity2Position) {
    errors.Parity2Position = t`Priority Position 2 is required`
  }
  if (parityFields2Present && !formData.Parity2Start) {
    errors.Parity2Start = t`Priority Start 2 is required`
  }
  if (parityFields2Present && !formData.Parity2Length) {
    errors.Parity2Length = t`Priority Length 2 is required`
  }
  return errors
}

export default validateFormatFormData
