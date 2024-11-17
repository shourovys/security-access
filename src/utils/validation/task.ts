import { INewFormErrors } from '../../types/pages/common'
import { ITaskFormData } from '../../types/pages/task'
import t from '../translator'

const validateTaskFormData = (formData: ITaskFormData): INewFormErrors<ITaskFormData> => {
  const errors: INewFormErrors<ITaskFormData> = {}
  if (!formData.Partition?.value) {
    errors.Partition = t`Partition is required`
  }
  if (!formData.TaskName) {
    errors.TaskName = t`Task Name is required`
  }

  if (!formData.Schedule?.value) {
    errors.Schedule = t`Schedule is required`
  }
  if (!formData.ActionType?.value) {
    errors.ActionType = t`Action Type is required`
  }
  if (formData.StartOnly?.value === '1' && !formData.ActionCtrl?.value) {
    errors.ActionCtrl = t`Action Control is required`
  }
  if (!formData.ItemSelect?.value) {
    errors.ItemSelect = t`Select Type is required`
  }
  // if (
  //     formData.ItemSelect?.value === taskSelectType[0].value &&
  //     !formData.Groups.length
  // ) {
  //     // if Group type
  //     errors.Groups = "Groups are required";
  // }
  // if (
  //     formData.ItemSelect?.value === taskSelectType[1].value &&
  //     !formData.Devices.length
  // ) {
  //     // if Individual type
  //     errors.Devices = "Devices are required";
  // }
  return errors
}

export default validateTaskFormData
