import { INewFormErrors } from '../../types/pages/common'
import { IInputEditFormData, IInputFormData } from '../../types/pages/input'
import t from '../translator'

const validateInputFormData = (
  formData: IInputFormData | IInputEditFormData
): INewFormErrors<IInputFormData | IInputEditFormData> => {
  const errors: INewFormErrors<IInputFormData | IInputEditFormData> = {}

  if (!formData.InputName) {
    errors.InputName = t`Name is required`
  }
  // if (!formData.InputPort) {
  //   errors.InputPort = t`Port is required`
  // }
  if (!formData.InputType?.value) {
    errors.InputType = t`Type is required`
  }
  // if (!formData.InputStat) {
  //   errors.InputStat = t`Stat is required`
  // }
  if (!formData.Partition?.value) {
    errors.Partition = t`Partition is required`
  }
  // if (!formData.Node?.value) {
  //   errors.Node = t`Node is required`
  // }
  return errors
}

export default validateInputFormData
