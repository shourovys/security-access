import { INewFormErrors } from '../../types/pages/common'
import { IHolidayFormData } from '../../types/pages/holiday'
import t from '../translator'

const validateHolidayFormData = (formData: IHolidayFormData): INewFormErrors<IHolidayFormData> => {
  const errors: INewFormErrors<IHolidayFormData> = {}
  if (!formData.HolidayName) {
    errors.HolidayName = t`Name is required`
  }
  if (!formData.Partition) {
    errors.Partition = t`Partition is required`
  }

  return errors
}
export default validateHolidayFormData
