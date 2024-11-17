import { INewFormErrors } from '../../types/pages/common'
import { IActionFormData } from '../../types/pages/eventAndAction'
import t from '../translator'

const validateActionFormData = (formData: IActionFormData): INewFormErrors<IActionFormData> => {
  const errors: INewFormErrors<IActionFormData> = {}

  if (!formData.ActionType || !formData.ActionType.value) {
    errors.ActionType = t`Action Type is required`
  }

  // if (formData.ActionItemIds.length === 0) {
  //   errors.ActionItemIds = t`At least one Action Item is required`
  // }

  return errors
}

export default validateActionFormData
