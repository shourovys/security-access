import { INewFormErrors } from '../../types/pages/common'
import { IDefinedFieldFormData } from '../../types/pages/definedField'
import t from '../translator'

const validateDefinedFieldFormData = (
  formData: IDefinedFieldFormData
): INewFormErrors<IDefinedFieldFormData> => {
  const errors: INewFormErrors<IDefinedFieldFormData> = {}
  if (!formData.FieldName) {
    errors.FieldName = t`Defined Field Name is required`
  }
  if (!formData.FieldNo) {
    errors.FieldNo = t`Field No is required`
  } else if (isNaN(Number(formData.FieldNo))) {
    errors.FieldNo = t`Defined Field No should be a number`
  } else if (Number(formData.FieldNo) < 1) {
    errors.FieldNo = t`Defined Field No cannot be less than 1`
  }

  // if (!formData.FieldNo) {
  //   errors.FieldNo = t`Defined Field No is required`
  // } else if (isNaN(Number(formData.FieldNo))) {
  //   errors.FieldNo = t`Defined Field No should be a number`
  // } else if (Number(formData.FieldNo) > 20) {
  //   errors.FieldNo = t`Defined Field No cannot be greater than 20`
  // } else if (Number(formData.FieldNo) < 1) {
  //   errors.FieldNo = t`Defined Field No cannot be less than 1`
  // }

  return errors
}
export default validateDefinedFieldFormData
