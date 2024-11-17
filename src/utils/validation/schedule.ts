import { INewFormErrors } from '../../types/pages/common'
import { IScheduleFormData } from '../../types/pages/schedule'
import t from '../translator'

const validateScheduleFormData = (
  formData: IScheduleFormData
): INewFormErrors<IScheduleFormData> => {
  const errors: INewFormErrors<IScheduleFormData> = {}
  if (!formData.ScheduleName) {
    errors.ScheduleName = t`Schedule Name is required`
  }
  if (!formData.Partition?.value) {
    errors.Partition = t`Partition is required`
  }
  // if (!formData.Holiday?.value) {
  //   errors.Holiday = t`Holiday is required`
  // }

  return errors
}
export default validateScheduleFormData
